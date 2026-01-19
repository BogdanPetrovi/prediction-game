import redisClient from "../config/redis.js";
import { HLTV } from "@bogdanpet/hltv";
import database from "../database/database.js";

const calculatePoints = async () => {
  console.log("Starting points calculation at: ", new Date())

  try {
    const activeEventId = await redisClient.get("active_event")
    if(activeEventId === null)
      return console.log("There is no active events. Cron job is finished at: ", new Date())

    const results = await HLTV.getResults(parseInt(activeEventId))
    // insert results of the matches into the database
    for(const match of results) {
      console.log(match)
      const winner = match.result.team1 > match.result.team2 ? 'team1' : 'team2';
      const result = `${match.result.team1}:${match.result.team2}`
      await database.query('UPDATE matches SET winner_team = $1, result = $2 WHERE id = $3 AND result IS NULL AND winner_team IS NULL;', [winner, result, match.id])
    }

    // calculate points and updates leaderboards table
    await database.query(`WITH active_players AS (
                          SELECT DISTINCT predictions.user_id FROM predictions
                          JOIN matches ON matches.id = predictions.match_id
                          WHERE matches.event_id = $1	
                          ),
                          finished_matches AS (
                            SELECT id AS match_id FROM matches
                            WHERE result IS NOT NULL AND event_id = $1
                          ),
                          user_match_combinations AS (
                            SELECT * FROM active_players
                            CROSS JOIN finished_matches
                          )
                          INSERT INTO leaderboards (user_id, event_id, points)
                          SELECT user_match_combinations.user_id, $1, 
                          SUM(
                            CASE 
                              WHEN predictions.predicted_winner IS NULL THEN -1
                              WHEN predictions.predicted_winner = matches.winner_team THEN 1 ELSE -1 
                            END) AS points
                          FROM user_match_combinations
                          LEFT JOIN predictions ON predictions.match_id = user_match_combinations.match_id 
                                               AND predictions.user_id = user_match_combinations.user_id
                          LEFT join matches ON matches.id = user_match_combinations.match_id
                          GROUP BY user_match_combinations.user_id
                          ON CONFLICT (user_id, event_id)
                          DO UPDATE SET points = EXCLUDED.points, updated_at = CURRENT_TIMESTAMP;`, [activeEventId])

    console.log("Cron job finished successfully at: ", new Date())
  } catch (err) {
    console.log("Error in cron job points calculation: ", err)
  }
}

export default calculatePoints