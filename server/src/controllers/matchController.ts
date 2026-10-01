import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import matchesPoints from "../utils/matchesPoints.js";
import getActiveMatches from "../utils/getActiveMatches.js";

export const getMatches = async (req: Request, res: Response) => {
  const active_event = await redisClient.get("active_event")
  if(!active_event)
    return res.status(200).json({
      matches: null,
      message: "Pauza između turnira",
      description: "Trenutno nema aktivnih mečeva. Novi turnir počinje uskoro."
    })
  
  const matches = await getActiveMatches(active_event)
  if(matches.length === 0) 
    return res.status(200).json({
      matches: null,
      message: 'Žreb je u toku',
      description: 'Postoji aktivan turnir, ali mečevi još uvek nisu dostupni. Čim raspored izađe, dobićete obaveštenje na Discordu!'
    })

  return res.status(200).json({
    matches: matches,
    message: "Success"
  })
}

export const getMatchesPoints = async (req: Request, res: Response) => {
  const activeEvent = await redisClient.get("active_event")
  if(!activeEvent) return res.status(200).json([])

  const votes = await matchesPoints(await getActiveMatches(activeEvent))

  return res.status(200).json(votes)
}