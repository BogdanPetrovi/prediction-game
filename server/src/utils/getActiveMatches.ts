import redisClient from "../config/redis.js";
import database from "../database/database.js";
import Match from "../types/Match.js";

const getActiveMatches = async (activeEventId: string): Promise<Match[]> => {
  const cached = await redisClient.get("matches");
  if(cached !== null) {
    const now = Date.now();
    return (JSON.parse(cached) as Match[]).map((m) => ({
      ...m,
      live: m.live || (m.date !== undefined && m.date <= now)
    }))
  } 

  const result = await database.query(`
    SELECT
      id,
      (team1).name AS team1_name,
      (team1).logo AS team1_logo,
      (team2).name AS team2_name,
      (team2).logo AS team2_logo,
      event_id,
      date,
      format
    FROM matches
    WHERE result IS NULL
    AND event_id=$1
    ORDER BY date NULLS FIRST;
  `, [activeEventId]);

  const now = Date.now();
  return result.rows.map((m) => ({
    id: Number(m.id),
    team1: { name: m.team1_name, logo: m.team1_logo },
    team2: { name: m.team2_name, logo: m.team2_logo },
    event: { id: Number(m.event_id) },
    date: m.date ? Number(m.date) : undefined,
    format: m.format,
    live: !m.date || Number(m.date) <= now
  }))
}

export default getActiveMatches