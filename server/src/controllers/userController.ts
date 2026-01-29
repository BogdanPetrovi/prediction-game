import database from "../database/database.js"
import { Request, Response } from "express"
import { DatabaseError } from "pg"
import { HLTV } from "@bogdanpet/hltv"
import redisClient from "../config/redis.js"
import { ErrorReply } from "redis"
import User from "../types/User.js"
import Prediction from "../types/Prediction.js"
import RecentPredictions from "../types/RecentPredictions.js"

export const getMatches = async (req: Request, res: Response) => {
  try {
    const matches = await redisClient.get("matches");

    if(matches)
      return res.status(200).json(JSON.parse(matches))

    const activeEventId = await redisClient.get("active_event")
    if(activeEventId === null )
      return res.status(200).json([]) 

    const apiResult = await HLTV.getMatches(parseInt(activeEventId))
    console.log('HLTV is checking for the latest matches...')

    res.status(200).json(apiResult);

    redisClient.set("matches", JSON.stringify(apiResult), {
      EX: 1800
    });

    return apiResult.map((match) => {
      database.query(`INSERT INTO matches (id, team1, team2, event_id, date, format)
        VALUES ($1, ($2, $3), ($4, $5), $6, $7, $8)
        ON CONFLICT(id)
        DO UPDATE SET date = EXCLUDED.date;`, 
        [match.id, match.team1.name, match.team1.logo, match.team2.name, match.team2.logo, match.event.id, match.date, match.format])
    })

  } catch (err: unknown) {
    console.log(err)

    if(err instanceof Error)
      return res.status(500).send(err.message)
    if(err instanceof TypeError)
      return res.status(400).send(err.message)
    if(err instanceof DatabaseError)
      return res.status(400).send(err.message)
    if(err instanceof ErrorReply)
      return res.status(500).send(err.message)
    
    return res.status(500).send('Unknown error')
  }
}

export const getLeaderboard = async (req: Request, res: Response) => {
  const { page } = req.query
  try {
    const activeEventId = await redisClient.get("active_event")
    if(activeEventId === null )
      return res.status(200).json([]) 

    const offset = (parseInt(page as string) - 1) * 10;
    const leaderboardResult = await database.query(`SELECT users.username, leaderboards.points FROM leaderboards
                                        JOIN users ON users.id = leaderboards.user_id
                                        WHERE event_id = $1
                                        ORDER BY points DESC, discord_id ASC
                                        LIMIT 10 OFFSET $2;`, [activeEventId, offset])
    const countResult = await database.query("SELECT COUNT(*) FROM leaderboards WHERE event_id = $1;", [activeEventId]);

    const pages = Math.ceil(countResult.rows[0].count / 10)
    
    const pagesWithoutZero = pages === 0 ? 1 : pages
    return res.status(200).json({pages: pagesWithoutZero, leaderboard: leaderboardResult.rows})
  } catch (err) {
    console.log(err)

    if(err instanceof Error)
      return res.status(500).send(err.message)
    if(err instanceof TypeError)
      return res.status(400).send(err.message)
    if(err instanceof DatabaseError)
      return res.status(400).send(err.message)
    if(err instanceof ErrorReply)
      return res.status(500).send(err.message)
    
    return res.status(500).send('Unknown error')
  }
}

export const getEvent = async (req: Request, res: Response) => {
  try {
    const activeEventId = await redisClient.get("active_event")
    if(activeEventId === null)
      return res.status(200).json([])

    const result = await database.query("SELECT logo, name FROM events WHERE id=$1", [activeEventId])

    return res.status(200).json(result.rows[0])
  } catch (err) {
    console.log(err)
  }
}

export const getHistory = async (req: Request, res: Response) => {
  try {
    const result = await database.query(`WITH RankedLeaderboards AS (
                                          SELECT users.username, events.name, events.logo, events.id,
                                          ROW_NUMBER() OVER (PARTITION BY events.id ORDER BY leaderboards.points DESC) as rank
                                          FROM leaderboards
                                          JOIN users ON leaderboards.user_id = users.id
                                          JOIN events ON leaderboards.event_id = events.id
                                          WHERE events.is_active = false
                                        )
                                        SELECT username, name, logo, id, rank
                                        FROM RankedLeaderboards
                                        WHERE rank <= 3
                                        ORDER BY id, rank;`);

    const response = result.rows.reduce((accumulator, current) => {
      // name is event name
      if(!accumulator[current.name]){
        accumulator[current.name] = {
          placements: {},
          logo: current.logo
        }
      }

      const places = ['firstPlace', 'secondPlace', 'thirdPlace']
      accumulator[current.name].placements[places[current.rank - 1]] = current.username

      return accumulator
    }, {})

    return res.status(200).json(response)
  } catch (err) {
    console.log(err)
  }
}

export const predict = async (req: Request, res: Response) => {
  const { predictions } = req.body;
  const user = req.user as User;

  try {
    predictions.forEach(async (prediction: Prediction) => {
      await database.query(
        `INSERT INTO predictions (user_id, match_id, predicted_winner) VALUES ($1, $2, $3)
        ON CONFLICT(user_id, match_id) 
        DO UPDATE SET predicted_winner = EXCLUDED.predicted_winner;`,
      [user.id, prediction.matchId, prediction.predictedTeam])
    });

    return res.sendStatus(200);
  } catch (err) {
    console.log(err)
    return res.status(500);
  }
}

// get predictions from active tournament and unfinished matches
export const getPredictions = async (req: Request, res: Response) => {
  const { id } = req.user as User;
  
  try {
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
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

// gets all predictions from the last 3 weeks
export const getRecentPredictions = async (req: Request, res: Response) => {
  const { id } = req.user as User;

  try {
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
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}