import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";
import hltvWrapper from "../utils/hltvWrapper.js";
import AppError from "../utils/customErrorHandlers/appError.js";

export const addEvent = async (req: Request, res: Response) => {
  const { id, isActive, parentEventId } = req.body;
  
  console.log(`New event id:${id} \n Parent event id:${parentEventId} \n Is event active:${isActive}`)

  if(!id)
    throw new AppError("You need to provide id!", 400)

  try {
    console.log('Checking HLTV for event... ' + new Date().toISOString())
    const event = await hltvWrapper(HLTV.getEvent({ id: parseInt(id) }))

    if(!event)
      throw new AppError("This event doesn't exists! Double check the id", 400)

    await database.query(`INSERT INTO events (id, name, logo, start_date, end_date, is_active, parent_event_id)
                          VALUES ($1, $2, $3, $4, $5, $6, $7)
                          ON CONFLICT(id) DO UPDATE 
                          SET is_active = EXCLUDED.is_active, parent_event_id = EXCLUDED.parent_event_id;`,
                        [event.id, event.name, event.logo, event.dateStart, event.dateEnd, isActive || false, parentEventId || null])

    if(isActive) {
      await redisClient.del("active_event")
      await redisClient.del("matches")
      await redisClient.del("active_parent_event")
      await redisClient.set("active_event", id)
      await redisClient.set("active_parent_event", parentEventId || id)
    }

    return res.status(200).send("You succesfully added/updated event!");
  } catch (err) {
    console.log(err)
  }
}