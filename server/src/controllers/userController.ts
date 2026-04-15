import { Request, Response } from "express";
import { UserType } from "../schemas/shared.schemas.js";
import database from "../database/database.js";

export const getProfile = async (req: Request, res: Response) => {
  const user = req.user;
  const { id, username } = UserType.parse(user)

  const { rows: [stats] } = await database.query(
    `SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE p.predicted_winner = m.winner_team) AS correct,
      COUNT(*) FILTER (WHERE p.predicted_winner != m.winner_team) AS incorrect,
      ARRAY(
        SELECT p2.predicted_winner = m2.winner_team
        FROM predictions p2
        JOIN matches m2 ON p2.match_id = m2.id
        WHERE p2.user_id = $1
          AND m2.winner_team IS NOT NULL
        ORDER BY p2.created_at DESC
        LIMIT 5
      ) AS form
    FROM predictions p
    JOIN matches m ON p.match_id = m.id
    WHERE p.user_id = $1 AND m.winner_team IS NOT NULL;`,
    [id]
  );

  const total = parseInt(stats.total)
  const correct = parseInt(stats.correct)
  const incorrect = parseInt(stats.incorrect)
  const form = stats.form

  const streakQuery = await database.query(
    `SELECT p.predicted_winner = m.winner_team AS hit
      FROM predictions p
      JOIN matches m ON p.match_id = m.id
      WHERE p.user_id = $1 AND m.winner_team IS NOT NULL
      ORDER BY p.created_at DESC
      LIMIT 120;`,
    [id]
  );

  let streak = 0;
  let streakType = null;
  for (const { hit } of streakQuery.rows) {
    if (streakType === null) {
      streakType = hit ? 'win' : 'loss';
      streak = 1;
    } else if ((streakType === 'win') === hit) {
      streak++;
    } else {
      break;
    }
  }

  return res.json({
    username: username,
    form,
    streak: { count: streak, type: streakType },
    stats: {
      successRate: total > 0 ? parseFloat(((correct / total) * 100).toFixed(1)) : 0,
      total,
      correct,
      incorrect,
    },
  });
}