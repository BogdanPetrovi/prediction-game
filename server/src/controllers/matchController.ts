import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import database from "../database/database.js";
import matchesPoints from "../utils/matchesPoints.js";

export const getMatches = async (req: Request, res: Response) => {
  const matches = await redisClient.get("matches");
  
  if(matches)
    return res.status(200).json(JSON.parse(matches))

 const result = await database.query(`
    SELECT
      id,
      (team1).name AS team1_name,
      (team1).logo AS team1_logo,
      (team2).name AS team2_name,
      (team2).logo AS team2_logo,
      event_id,
      date,
      format
    FROM matches
    WHERE result IS NULL;
  `)

  const formatedMatches = result.rows.map((m) => ({
    id: m.id,
    team1: {
      name: m.team1_name,
      logo: m.team1_logo,
    },
    team2: {
      name: m.team2_name,
      logo: m.team2_logo,
    },
    event: {
      id: m.event_id,
    },
    date: m.date,
    format: m.format,
  }))

  return res.status(200).json(formatedMatches)
}

export const getMatchesPoints = async (req: Request, res: Response) => {
  const matches = await redisClient.get("matches")

  if(!matches){
    const activeEvent = await redisClient.get("active_event")
    const matches = await database.query("SELECT * FROM matches WHERE event_id=$1 AND result IS NULL;", [activeEvent])
    const votes = await matchesPoints(matches.rows)
    return res.status(200).json(votes)
  }

  const votes = await matchesPoints(JSON.parse(matches))

  return res.status(200).json(votes)
}