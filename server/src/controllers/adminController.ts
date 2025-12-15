import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";

export const addTournament = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { active } = req.query;
  
  console.log(id + '\n' + active)

  if(!id)
    return res.status(400).send("You need to provide id in url!")

  try {
    const event = await HLTV.getEvent({ id: parseInt(id) })

    if(!event)
      return res.status(400).send("This event doesn't exists! Double check the id")

    await database.query(`INSERT INTO events (id, name, logo, start_date, end_date, is_active)
                          VALUES ($1, $2, $3, $4, $5, $6) 
                          ON CONFLICT(id) DO UPDATE 
                          SET is_active = EXCLUDED.is_active`,
                        [event.id, event.name, event.logo, event.dateStart, event.dateEnd, active || false])

    if(active) {
      await redisClient.del("active_tournament")
      await redisClient.set("active_tournament", id)  
    }

    return res.status(200).send("You succesfully added/updated tournament!");
  } catch (err) {
    console.log(err)
  }
}