import database from "../database/database.js"
import { Request, Response } from "express"
import { DatabaseError } from "pg"
import { HLTV } from "@bogdanpet/hltv"
import redisClient from "../config/redis.js"
import { ErrorReply } from "redis"

export const getMatches = async (req: Request, res: Response) => {
  try {
    const matches = await redisClient.get("matches");

    if(matches)
      return res.status(200).json(JSON.parse(matches))

    const activeTournamentId = await redisClient.get("active_tournament")
    if(activeTournamentId === null )
      return res.status(200).json([]) 

    const apiResult = await HLTV.getMatches(parseInt(activeTournamentId))
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
    const activeTournamentId = await redisClient.get("active_tournament")
    if(activeTournamentId === null )
      return res.status(200).json([]) 

    const offset = (parseInt(page as string) - 1) * 10;
    const leaderboardResult = await database.query(`SELECT users.username, leaderboards.points FROM leaderboards
                                        JOIN users ON users.id = leaderboards.user_id
                                        WHERE event_id = $1
                                        ORDER BY points DESC
                                        LIMIT 10 OFFSET $2;`, [activeTournamentId, offset])
    const countResult = await database.query("SELECT COUNT(*) FROM leaderboards WHERE event_id = $1;", [activeTournamentId]);

    const pages = Math.ceil(countResult.rows[0].count / 10)

    return res.status(200).json({pages, leaderboard: leaderboardResult.rows})
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