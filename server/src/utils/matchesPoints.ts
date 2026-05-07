import database from "../database/database.js"
import Match from "../types/Match.js"

const matchesPoints = async (matches: Match[]) => {
  const formatedMatches = await Promise.all(
    matches.map(async (match: Match) => {
      const result = await database.query(`
        WITH predictions_count AS (
          SELECT
            COUNT(CASE WHEN predicted_winner='team1' THEN 1 END) AS team1,
            COUNT(CASE WHEN predicted_winner='team2' THEN 1 END) AS team2,
            COUNT(*) AS total
          FROM predictions
          JOIN matches ON  predictions.match_id = matches.id  
          WHERE match_id=$1
        )
        SELECT
          $1::int AS id,
          COALESCE(ROUND((team2::numeric / NULLIF(total, 0)) * 100 + 100), 100)::int AS team1,
          COALESCE(ROUND((team1::numeric / NULLIF(total, 0)) * 100 + 100), 100)::int AS team2 
        FROM predictions_count`, [match.id])

      return result.rows[0]
    })
  )

  return formatedMatches
}

export default matchesPoints