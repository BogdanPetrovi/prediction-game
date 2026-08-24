import { Request, Response } from "express";
import redisClient from "../config/redis.js"
import database from "../database/database.js"

export const getEvent = async (req: Request, res: Response) => {
  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null)
    return res.status(200).json([])

  const result = await database.query("SELECT logo, name FROM events WHERE id=$1;", [activeEventId])

  return res.status(200).json(result.rows[0])
}

export const getParentEvent = async (req: Request, res: Response) => {
  const activeParentEventId = await redisClient.get("active_parent_event")
  if(activeParentEventId === null)
    return res.status(200).json([])

  const result = await database.query("SELECT logo, name FROM events WHERE id=$1;", [activeParentEventId])

  return res.status(200).json(result.rows[0])
}