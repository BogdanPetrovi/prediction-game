import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";
import hltvWrapper from "../utils/hltvWrapper.js";
import calculateMatchesVotes from "../utils/calculateMatchesVotes.js";
import TeamNames from "../types/TeamNames.js";

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

  let newMatches: TeamNames[] = []
  await Promise.all(
    apiResult.map(async (match) => {
      const result = await database.query(`INSERT INTO matches (id, team1, team2, event_id, date, format)
        VALUES ($1, ($2, $3), ($4, $5), $6, $7, $8)
        ON CONFLICT(id)
        DO NOTHING RETURNING *;`, 
        [match.id, match.team1.name, match.team1.logo, match.team2.name, match.team2.logo, match.event.id, match.date, match.format])

      if(result.rows.length > 0) {
        newMatches.push({ team1Name: match.team1.name, team2Name: match.team2.name })
      }

      return null
    })
  ).catch(err => {
    console.error("DB error: " + err)
  })

  if(newMatches.length > 0){
    const embedFields = newMatches.map(match => ({
      name: "Novi meč",
      value: `${match.team1Name} 🆚 ${match.team2Name}`,
      inline: false
    }))

    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: "**[Igraj predikcije](<https://predikcije.countersite.gg>)** <@&1496218575428653066>",
        embeds: [
          {
            title: "📢 Novi mečevi",
            color: 0xFF0000,
            fields: embedFields,
            footer: {
              text: "Automatska notifikacija"
            },
            timestamp: new Date().toISOString()
          }
        ]
      }),
    }).catch(err => console.error('Error with discord webhook: ', err))
  }
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