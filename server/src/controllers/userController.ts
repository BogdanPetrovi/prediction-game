import database from "../database/database.js"
import { NextFunction, Request, Response } from "express"
import { HLTV } from "@bogdanpet/hltv"
import redisClient from "../config/redis.js"
import User from "../types/User.js"
import Prediction from "../types/Prediction.js"
import History from "../types/History.js"
import RecentPredictions from "../types/RecentPredictions.js"

export const getMatches = async (req: Request, res: Response, next: NextFunction) => {
  const matches = await redisClient.get("matches");

  if(matches)
    return res.status(200).json(JSON.parse(matches))

  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null )
    return res.status(200).json([]) 

  console.log('HLTV is checking for the latest matches...')
  const apiResult = await HLTV.getMatches(parseInt(activeEventId))

  res.status(200).json(apiResult);

  redisClient.set("matches", JSON.stringify(apiResult), {
    EX: 1800
  });

  await Promise.all(
    apiResult.map((match) => {
      return database.query(`INSERT INTO matches (id, team1, team2, event_id, date, format)
        VALUES ($1, ($2, $3), ($4, $5), $6, $7, $8)
        ON CONFLICT(id)
        DO UPDATE SET date = EXCLUDED.date;`, 
        [match.id, match.team1.name, match.team1.logo, match.team2.name, match.team2.logo, match.event.id, match.date, match.format])
    })
  ).catch(err => {
    console.error("DB error: " + err)
  })
}

export const getLeaderboard = async (req: Request, res: Response) => {
  const { page } = req.query

  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null )
    return res.status(200).json([]) 

  const offset = (parseInt(page as string) - 1) * 10;
  const leaderboardResult = await database.query(`SELECT users.username, leaderboards.points
                                                  FROM leaderboards
                                                  JOIN users ON users.id = leaderboards.user_id
                                                  WHERE event_id = $1
                                                  ORDER BY points DESC, discord_id DESC, users.id ASC
                                                  LIMIT 10 OFFSET $2;`, [activeEventId, offset])
  const countResult = await database.query("SELECT COUNT(*) FROM leaderboards WHERE event_id = $1;", [activeEventId]);

  const pages = Math.ceil(countResult.rows[0].count / 10)
  const pagesWithoutZero = pages === 0 ? 1 : pages
  return res.status(200).json({pages: pagesWithoutZero, leaderboard: leaderboardResult.rows})
}

export const getEvent = async (req: Request, res: Response) => {
  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null)
    return res.status(200).json([])

  const result = await database.query("SELECT logo, name FROM events WHERE id=$1", [activeEventId])

  return res.status(200).json(result.rows[0])
}

export const getHistory = async (req: Request, res: Response) => {
  const result = await database.query(`WITH RankedLeaderboards AS (
                                        SELECT users.username, events.name, events.logo, events.id, events.start_date AS date,
                                          ROW_NUMBER() OVER (PARTITION BY events.id ORDER BY leaderboards.points DESC) AS rank
                                        FROM leaderboards
                                        JOIN users ON leaderboards.user_id = users.id
                                        JOIN events ON leaderboards.event_id = events.id
                                        WHERE events.is_active = false
                                      )
                                      SELECT username, name, logo, id, rank
                                      FROM RankedLeaderboards
                                      WHERE rank <= 3
                                      ORDER BY date DESC;`);

  const arrayOfEventsWithRanking = result.rows.reduce((accumulator: History[], current) => {
    const eventIndex = accumulator.findIndex(event => event.name === current.name)

    if(eventIndex >= 0){
      if(current.rank === '1'){
        accumulator[eventIndex].placements.firstPlace = current.username
      } else if(current.rank === '2') {
        accumulator[eventIndex].placements.secondPlace = current.username
      } else {
        accumulator[eventIndex].placements.thirdPlace = current.username
      }

    } else {
      accumulator.push({
      name: current.name,
      logo: current.logo,
      placements: current.rank === '1' ? 
                    { firstPlace: current.username } : 
                  current.rank === '2' ? 
                    { secondPlace: current.username } : 
                  { thirdPlace: current.username }
      })
    }

    return accumulator
  }, [])

  return res.status(200).json(arrayOfEventsWithRanking)
}

export const predict = async (req: Request, res: Response) => {
  const { predictions } = req.body;
  const user = req.user as User;

  predictions.forEach(async (prediction: Prediction) => {
    await database.query(
      `INSERT INTO predictions (user_id, match_id, predicted_winner) VALUES ($1, $2, $3)
      ON CONFLICT(user_id, match_id) 
      DO UPDATE SET predicted_winner = EXCLUDED.predicted_winner;`,
    [user.id, prediction.matchId, prediction.predictedTeam])
  });

  return res.sendStatus(200);
}

// get predictions from active tournament and unfinished matches
export const getPredictions = async (req: Request, res: Response) => {
  const { id } = req.user as User;
  
  const activeEvent = await redisClient.get("active_event")

  const result = await database.query(`SELECT matches.id , predicted_winner FROM predictions
                                        JOIN matches ON matches.id = predictions.match_id 
                                        WHERE user_id = $1 AND event_id = $2 AND result IS NULL;`, [id, activeEvent])

  const predictions: Prediction[] = result.rows.map(prediction => {
    return {
      matchId: parseInt(prediction.id),
      predictedTeam: prediction.predicted_winner
    }
  })
  
  return res.status(200).json({ predictions })
}

// gets all predictions from the last 3 weeks
export const getRecentPredictions = async (req: Request, res: Response) => {
  const { id } = req.user as User;

  const result = await database.query(`SELECT matches.id, team1, team2, predicted_winner, winner_team, result FROM predictions
                                        JOIN matches ON predictions.match_id = matches.id
                                        WHERE user_id = $1
                                        AND predictions.created_at >= NOW() - INTERVAL '21 days'
                                        ORDER BY predictions.created_at DESC
                                        LIMIT 30;`, [id])
  
  const recentPredictions: RecentPredictions[] = result.rows.map(prediction => {
    // prediction type is (teamName, teamLogo) and this functions will make a JSON out of it, as well as change naming to camel casing
    // postgresql sometimes saves name with quotes, resulting in cutting off first or last letter by quotes
    const team1NameAndLogoWithoutQuotes = prediction.team1.replaceAll('"', '')
    const team1CommaIndex = team1NameAndLogoWithoutQuotes.indexOf(",")
    const team1Name = team1NameAndLogoWithoutQuotes.substring(1, team1CommaIndex)
    const team1Logo = team1NameAndLogoWithoutQuotes.substring(team1CommaIndex + 1, team1NameAndLogoWithoutQuotes.length - 1)

    const team2NameAndLogoWithoutQuotes = prediction.team2.replaceAll('"', '')
    const team2CommaIndex = team2NameAndLogoWithoutQuotes.indexOf(",")
    const team2Name = team2NameAndLogoWithoutQuotes.substring(1, team2CommaIndex)
    const team2Logo = team2NameAndLogoWithoutQuotes.substring(team2CommaIndex + 1, team2NameAndLogoWithoutQuotes.length - 1)

    return {
      id: prediction.id,
      team1: {
        name: team1Name,
        logo: team1Logo
      },
      team2: {
        name: team2Name,
        logo: team2Logo
      },
      predictedWinner: prediction.predicted_winner,
      winnerTeam: prediction.winner_team,
      result: prediction.result
    }
  });

  return res.status(200).json(recentPredictions)
}

export const getUsersLeaderboardPlaceAndPage = async (req: Request, res: Response) => {
  const { id } = req.user as User;
  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null)
    return res.status(200).json(null)

  const placeOnLeaderboard = await database.query(`
      WITH full_leaderboard AS (
        SELECT users.id, ROW_NUMBER() OVER(ORDER BY points DESC, discord_id DESC, users.id ASC) AS place
        FROM leaderboards
        JOIN users ON users.id = leaderboards.user_id
        WHERE event_id = $1
      )
      SELECT place FROM full_leaderboard
      WHERE id = $2;
  `, [activeEventId, id])
  
  if(placeOnLeaderboard.rows.length < 1)
    return res.status(200).json({ page: null, place:null })
  
  const place: number = placeOnLeaderboard.rows[0].place
  const page: number = Math.ceil(place / 10);

  return res.status(200).json({ page, place })
}

export const getLastLeaderboardUpdateAt = async (req: Request, res: Response) => {
  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null)
    return res.status(200).json(null)

  const result = await database.query(`SELECT updated_at FROM leaderboards 
                                       WHERE event_id = $1
                                       ORDER BY updated_at DESC
                                       LIMIT 1;`, [activeEventId])

  if(!result || !result.rows[0].updated_at)
    return res.status(200).json(null)

  const date = new Date(result.rows[0].updated_at)
  // converting date to right time zone
  date.setHours(date.getHours() + 1)

  const formatedDate = new Intl.DateTimeFormat('sr-RS', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: false
                                    }).format(date);

  return res.status(200).json({ lastUpdated: formatedDate })
}