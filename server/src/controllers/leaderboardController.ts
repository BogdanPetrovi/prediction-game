import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import database from "../database/database.js";
import User from "../types/User.js";
import { Page } from "../schemas/leaderboard.schemas.js";
import { UserType } from "../schemas/shared.schemas.js";

export const getLeaderboard = async (req: Request, res: Response) => {
  const { page } = req.query

  const activeParentEventId = await redisClient.get("active_parent_event")
  if(activeParentEventId === null )
    return res.status(200).json([]) 

  const parsedPage = Page.parse(page)

  const offset = (parsedPage - 1) * 10;
  const leaderboardResult = await database.query(`SELECT users.username, leaderboards.points
                                                  FROM leaderboards
                                                  JOIN users ON users.id = leaderboards.user_id
                                                  WHERE event_id = $1
                                                  ORDER BY points DESC, discord_id DESC, users.id ASC
                                                  LIMIT 10 OFFSET $2;`, [activeParentEventId, offset])
  const countResult = await database.query("SELECT COUNT(*) FROM leaderboards WHERE event_id = $1;", [activeParentEventId]);

  const pages = Math.ceil(countResult.rows[0].count / 10)
  const pagesWithoutZero = pages === 0 ? 1 : pages
  return res.status(200).json({pages: pagesWithoutZero, leaderboard: leaderboardResult.rows})
}

export const getUsersLeaderboardPlaceAndPage = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = UserType.parse(user);
  const activeParentEventId = await redisClient.get("active_parent_event")
  if(activeParentEventId === null)
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
  `, [activeParentEventId, id])
  
  if(placeOnLeaderboard.rows.length < 1)
    return res.status(200).json({ page: null, place:null })
  
  const place: number = placeOnLeaderboard.rows[0].place
  const page: number = Math.ceil(place / 10);

  return res.status(200).json({ page, place })
}

export const getLastLeaderboardUpdateAt = async (req: Request, res: Response) => {
  const activeParentEventId = await redisClient.get("active_parent_event")
  if(activeParentEventId === null)
    return res.status(200).json(null)

  const result = await database.query(`SELECT updated_at FROM leaderboards 
                                       WHERE event_id = $1
                                       ORDER BY updated_at DESC
                                       LIMIT 1;`, [activeParentEventId])

    console.log(result)

  console.log()

  if(!result || result.rows.length < 1)
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