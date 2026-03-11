import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";
import Match from "../types/Match.js";

export const getMatches = async (req: Request, res: Response) => {
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

export const getVotesPrecentage = async (req: Request, res: Response) => {
  const matches = await redisClient.get("matches")

  if(!matches)
    return res.status(200).json([])


  const votes = await Promise.all(
    JSON.parse(matches).map(async (match: Match) => {
      const result = await database.query(`SELECT predicted_winner, COUNT(*) AS votes
                                            FROM predictions
                                            WHERE match_id = $1
                                            GROUP BY predicted_winner;`, [match.id])

      if(result.rows.length === 0)
        return { id: match.id, team1: 0, team2: 0 }

      if(result.rows.length === 1){
        return {
          id: match.id,
          team1: result.rows[0].predicted_winner === 'team1' ? 100 : 0,
          team2: result.rows[0].predicted_winner === 'team2' ? 100 : 0
        }
      }
      
      const allVotes = Number(result.rows[0].votes) + Number(result.rows[1].votes)
      const precentageTeam1 = result.rows[0].predicted_winner === 'team1' ? ( (result.rows[0].votes / allVotes) * 100 ) : ( (result.rows[0].votes / allVotes) * 100 )

      return {
        id: match.id,
        team1: Number(precentageTeam1.toFixed(1)),
        team2: Number((100 - precentageTeam1).toFixed(1))
      }
    })
  )

  return res.status(200).json(votes)
}