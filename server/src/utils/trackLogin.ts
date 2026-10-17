import redisClient from "../config/redis.js"
import posthog from "../config/posthog.js"

const trackLogin = async (userId: number, isNewUser: boolean) => {
  const [eventId, parentEventId] = await Promise.all([
    redisClient.get("active_event"),
    redisClient.get("active_parent_event")
  ])

  posthog.capture({
    distinctId: String(userId),
    event: isNewUser ? 'user_signed_up' : 'user_logged_in',
    properties: {
      event_id: eventId !== null ? Number(eventId) : undefined,
      parent_event_id: parentEventId !== null ? Number(parentEventId) : undefined
    }
  })
}

export default trackLogin
