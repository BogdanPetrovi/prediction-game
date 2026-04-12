import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";
import Match from "../types/Match.js";
import hltvWrapper from "../utils/hltvWrapper.js";
import calculateMatchesVotes from "../utils/calculateMatchesVotes.js";

export const getMatches = async (req: Request, res: Response) => {
  const matches = await redisClient.get("matches");

  if(matches)
    return res.status(200).json(JSON.parse(matches))

  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null )
    return res.status(200).json([]) 

  console.log('HLTV is checking for the latest matches... ' + new Date().toISOString())
  const apiResult = await hltvWrapper(HLTV.getMatches(parseInt(activeEventId)))

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

  if(!matches){
    const activeEvent = await redisClient.get("active_event")
    const matches = await database.query("SELECT * FROM matches WHERE event_id=$1 AND result IS NULL;", [activeEvent])
    const votes = await calculateMatchesVotes(matches.rows)
    return res.status(200).json(votes)
  }

  const votes = await calculateMatchesVotes(JSON.parse(matches))

  return res.status(200).json(votes)
}