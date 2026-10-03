import { HLTV } from "@bogdanpet/hltv"
import redisClient, { MATCHES_CACHE_TTL } from "../config/redis.js"
import database from "../database/database.js"
import TeamNames from "../types/TeamNames.js"
import hltvWrapper from "./hltvWrapper.js"
import formatDateAndTime from "./formatDateAndTime.js"
import sendMatchesNotification from "./sendMatchesNotification.js"

let isFetching = false;

const fetchMatches = async () => {
  const activeEventId = await redisClient.get("active_event")
  if(activeEventId === null ){
    console.log('There are no active events. Scheduler finished at ' + formatDateAndTime())
    return
  }

  isFetching = true
  console.log('HLTV is checking for the latest matches... ' + formatDateAndTime())
  const apiResult = await hltvWrapper(HLTV.getMatches(parseInt(activeEventId)))

  await redisClient.set("matches", JSON.stringify(apiResult), {
    EX: MATCHES_CACHE_TTL
  });
  console.log('Succesfuly fetched matches from HLTV at ' + formatDateAndTime())

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

  if(newMatches.length > 0)
    await sendMatchesNotification(newMatches).catch(err => console.error('Error with discord webhook: ', err))
}

export default fetchMatches