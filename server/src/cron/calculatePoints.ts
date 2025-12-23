import cron from "node-cron";
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
      const winner = match.result.team1 > match.result.team2 ? 'team1' : 'team2';
      const result = `${match.result.team1}:${match.result.team2}`
      await database.query('UPDATE matches SET winner_team = $1, result = $2 WHERE id = $3 AND result IS NULL AND winner_team IS NULL;', [winner, result, match.id])
    }

    // calculate points and updates leaderboards table
    // TO DO: Penalize users that didn't place a prediction on a match 
    await database.query(`WITH calculated_points AS (
                          SELECT users.id AS user_id,
                          SUM(CASE WHEN predictions.predicted_winner = matches.winner_team THEN 1 ELSE -1 END) AS points
                          FROM predictions
                          JOIN matches ON matches.id = predictions.match_id 
                          JOIN users ON users.id = predictions.user_id 
                          WHERE matches.event_id = $1
                          AND matches.result IS NOT NULL
                          GROUP BY users.id
                        )
                        INSERT INTO leaderboards (user_id, event_id, points)
                        SELECT user_id, $1, points FROM calculated_points
                        ON CONFLICT (user_id, event_id)
                        DO UPDATE SET points = EXCLUDED.points;`, [activeEventId])

    
    console.log("Cron job finished successfully at: ", new Date())
    
  } catch (err) {
    console.log("Error in cron job points calculation: ", err)
  }
}

cron.schedule("* */8 * * *", calculatePoints)