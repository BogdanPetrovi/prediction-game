import { HLTV } from "@bogdanpet/hltv"
import redisClient from "../config/redis.js"
import database from "../database/database.js"
import TeamNames from "../types/TeamNames.js"
import hltvWrapper from "./hltvWrapper.js"

let isFetching = false;

const fetchMatches = async () => {
  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null )
    return

  isFetching = true
  console.log('HLTV is checking for the latest matches... ' + new Date().toISOString())
  const apiResult = await hltvWrapper(HLTV.getMatches(parseInt(activeEventId)))

  await redisClient.set("matches", JSON.stringify(apiResult), {
    EX: 7200
  });
  console.log('Succesfuly fetched matches from HLTV at ' + new Date().toISOString())

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
  }).finally(() => isFetching = false)

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
        content: "**[Igraj predikcije](<https://predikcije.countersite.gg/igraj?utm_source=discord>)** <@&1496218575428653066>",
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

export default fetchMatches