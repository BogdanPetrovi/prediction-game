import redisClient from "../config/redis.js"
import database from "../database/database.js"
import posthog from "../config/posthog.js"

const trackPredictions = async (userId: number, activeEventId: string, predictionCount: number, newCount: number) => {
  const parentEventId = await redisClient.get("active_parent_event")

  let tournamentDay: number | undefined
  if(parentEventId !== null) {
    const result = await database.query(`
      SELECT (now() AT TIME ZONE 'Europe/Belgrade')::date
        - (to_timestamp(MIN(start_date) / 1000) AT TIME ZONE 'Europe/Belgrade')::date + 1 AS tournament_day
      FROM events
      WHERE id = $1 OR parent_event_id = $1;
    `, [parentEventId])
    tournamentDay = result.rows[0].tournament_day ?? undefined
  }

  posthog.capture({
    distinctId: String(userId),
    event: newCount === predictionCount ? 'prediction_made' : 'prediction_changed',
    properties: {
      event_id: Number(activeEventId),
      parent_event_id: parentEventId !== null ? Number(parentEventId) : undefined,
      tournament_day: tournamentDay,
      prediction_count: predictionCount,
      new_count: newCount
    }
  })
}

export default trackPredictions
