import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";
import hltvWrapper from "../utils/hltvWrapper.js";
import matchesPoints from "../utils/matchesPoints.js";
import TeamNames from "../types/TeamNames.js";

export const getMatches = async (req: Request, res: Response) => {
  const matches = await redisClient.get("matches");

  if(matches)
    return res.status(200).json(JSON.parse(matches))

  return res.status(200).json([])
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