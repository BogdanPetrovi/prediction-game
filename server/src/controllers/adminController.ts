import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";
import hltvWrapper from "../utils/hltvWrapper.js";
import AppError from "../utils/customErrorHandlers/appError.js";
import { event, matchList } from "../schemas/admin.schemas.js";
import Match from "../types/Match.js";
import z from "zod";


export const adminMatches = async (req: Request, res: Response) => {
  const matches = await redisClient.get("matches")
  const expire = await redisClient.ttl("matches")

  if(!matches || !expire)
    return res.status(200).json({ matches: null, expire: null })
  
  const matchesArrayWithGuesses = await Promise.all(
    JSON.parse(matches).map(async (match: Match) => {
      const result = await database.query("SELECT COUNT(*) AS guesses FROM predictions WHERE match_id=$1;", [match.id])
      return { ...match, guesses: Number(result.rows[0].guesses) }
    })
  ) 

  return res.status(200).json({ 
    matches: matchesArrayWithGuesses,
    expire
   })
}

export const updateMatches = async(req: Request, res: Response) => {
  if(!req.body || !req.body.updatedList)
    throw new AppError("You need to provide list of matches", 400)

  const { updatedList } = req.body

  const parsedUpdatedList = matchList.parse(updatedList)

  await redisClient.del("matches")
  await redisClient.set("matches", JSON.stringify(parsedUpdatedList), {
    EX: 1800
  })

  return res.sendStatus(200)
}

export const searchEvent = async (req: Request, res: Response) => {
  const { eventId } = z.object({ eventId: z.coerce.number() }).parse(req.query)

  const result = await database.query("SELECT * FROM events WHERE id=$1;", [eventId])

  if(result.rows.length > 0){
    return res.status(200).json({
      id: result.rows[0].id,
      logo: result.rows[0].logo,
      name: result.rows[0].name,
      startDate: result.rows[0].start_date,
      endDate: result.rows[0].end_date
    })
  }

  console.log('Checking HLTV for event...')
  const event = await hltvWrapper(HLTV.getEvent({ id: eventId }))

  return res.status(200).json({
      id: event.id,
      logo: event.logo,
      name: event.name,
      startDate: event.dateStart,
      endDate: event.dateEnd
    })
}

export const searchParentEvent = async (req: Request, res: Response) => {
  const { eventId } = z.object({ eventId: z.coerce.number() }).parse(req.query)
  
  const result = await database.query("SELECT * FROM events WHERE id=$1 AND parent_event_id IS NULL;", [eventId])

  if(result.rows.length < 1)
    throw new AppError("Event with this id doesn't exist in database, please add it first! Problem also may occure if it has parent event too.", 404)

  res.sendStatus(200)
}

export const eventUpsert = async (req: Request, res: Response) => {
  if(!req.body)
    throw new AppError("You need to provide event", 400)

  const parsedEvent = event.parse(req.body)

  const result = await database.query(`INSERT INTO events (id, name, logo, start_date, end_date, is_active, parent_event_id)
                                       VALUES ($1, $2, $3, $4, $5, $6, $7)
                                       ON CONFLICT (id)
                                       DO UPDATE SET name = EXCLUDED.name, logo = EXCLUDED.logo, start_date = EXCLUDED.start_date,
                                          end_date = EXCLUDED.end_date, is_active = EXCLUDED.is_active, 
                                          parent_event_id = EXCLUDED.parent_event_id;`,
                                       [parsedEvent.id, parsedEvent.name, parsedEvent.logo, parsedEvent.startDate, parsedEvent.endDate,
                                        parsedEvent.isActive, parsedEvent.parentEventId || null])
  
  if(parsedEvent.isActive){
    await redisClient.del("active_event")
    await redisClient.del("matches")
    await redisClient.del("active_parent_event")
    await redisClient.set("active_event", parsedEvent.id)
    await redisClient.set("active_parent_event", parsedEvent.parentEventId || parsedEvent.id)
  }

  return res.sendStatus(200)
}

export const appVersion = (req: Request, res: Response) => {
  return res.json({ 
    version: "1.0.0", 
    downloadUrl: "https://countersite.gg/app/countersite.apk" 
  });
}