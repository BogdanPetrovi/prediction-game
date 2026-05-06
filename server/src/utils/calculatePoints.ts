import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";

const calculatePoints = async () => {
  console.log("Starting points calculation at: ", new Date())

  try {
    const activeEventId = await redisClient.get("active_event")
    const activeParentEventId = await redisClient.get("active_parent_event")
    if(activeEventId === null || activeParentEventId === null)
      return console.log("There is no active events. Cron job is finished at: ", new Date())

    console.log('Checking HLTV for latest results...')
    const results = await HLTV.getResults(parseInt(activeEventId))
    
    // insert results of the matches into the database
    for(const match of results) {
      const winner = match.result.team1 > match.result.team2 ? 'team1' : 'team2';
      const result = `${match.result.team1}:${match.result.team2}`
      await database.query('UPDATE matches SET winner_team = $1, result = $2 WHERE id = $3 AND result IS NULL AND winner_team IS NULL;', [winner, result, match.id])
    }

    await database.transaction(async (client) => {
      // calculate points for each match
      await client.query(`WITH finished_matches AS (
          SELECT matches.id FROM matches 
          JOIN events ON  matches.event_id = events.id
          WHERE matches.result IS NOT NULL 
          AND ( events.id = $1 OR events.parent_event_id = $1 )
        ),
        predictions_count AS (
          SELECT 
            finished_matches.id,
            COUNT(CASE WHEN predicted_winner='team1' THEN 1 END) AS team1,
            COUNT(CASE WHEN predicted_winner='team2' THEN 1 END) AS team2,
            COUNT(*) AS total
          FROM predictions
          JOIN finished_matches ON predictions.match_id = finished_matches.id
          GROUP BY finished_matches.id
        ),
        predictions_percentages AS (
          SELECT
            id,
            COALESCE(ROUND((team2::numeric / NULLIF(total, 0)) * 100 + 100), 100) AS team1_percentage,
            COALESCE(ROUND((team1::numeric / NULLIF(total, 0)) * 100 + 100), 100) AS team2_percentage 
          FROM predictions_count
        )
        INSERT INTO matches_points (match_id, team1_points, team2_points)
        SELECT id, team1_percentage, team2_percentage FROM predictions_percentages
        ON CONFLICT DO NOTHING;`, [activeParentEventId])

      // calculate users points
      await client.query(`WITH target_matches AS (
          SELECT m.id, m.winner_team
          FROM matches m
          JOIN events e ON m.event_id = e.id
          WHERE (e.id = $1 OR e.parent_event_id = $1)
          AND m.winner_team IS NOT NULL
        ),
        user_scores AS (
          SELECT 
            p.user_id,
            $1 AS event_id,
            SUM(
              CASE 
                WHEN tm.winner_team = 'team1' AND p.predicted_winner = 'team1' THEN mp.team1_points
                WHEN tm.winner_team = 'team2' AND p.predicted_winner = 'team2' THEN mp.team2_points
                ELSE 0 
              END
              ) AS total_points
          FROM predictions p
          JOIN target_matches tm ON p.match_id = tm.id
          JOIN matches_points mp ON tm.id = mp.match_id
          GROUP BY p.user_id
        )
        INSERT INTO leaderboards (user_id, event_id, points)
        SELECT user_id, event_id, total_points 
        FROM user_scores
        ON CONFLICT (user_id, event_id) 
        DO UPDATE SET points = EXCLUDED.points;`, [activeParentEventId])
    })

    console.log("Calculation successfully finished at: ", new Date())
  } catch (err) {
    console.error("Error in points calculation: ", err)
  }
}

export default calculatePoints