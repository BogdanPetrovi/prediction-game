import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import database from "../database/database.js";
import Prediction from "../types/Prediction.js";
import { PredictionsArray } from "../schemas/prediction.schemas.js";
import { UserType } from "../schemas/shared.schemas.js";

export const predict = async (req: Request, res: Response) => {
  const { predictions } = req.body;
  const user = req.user;
  const { id } = UserType.parse(user)

  const parsedPredictions = PredictionsArray.parse(predictions)

  parsedPredictions.forEach(async prediction => {
    await database.query(
      `INSERT INTO predictions (user_id, match_id, predicted_winner) VALUES ($1, $2, $3)
      ON CONFLICT(user_id, match_id) 
      DO UPDATE SET predicted_winner = EXCLUDED.predicted_winner;`,
    [id, prediction.matchId, prediction.predictedTeam])
  });

  return res.sendStatus(200);
}

export const getPredictions = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = UserType.parse(user)
  
  const activeEvent = await redisClient.get("active_event")

  const result = await database.query(`SELECT matches.id , predicted_winner FROM predictions
                                        JOIN matches ON matches.id = predictions.match_id 
                                        WHERE user_id = $1 AND event_id = $2 AND result IS NULL;`, [id, activeEvent])

  const predictions: Prediction[] = result.rows.map(prediction => {
    return {
      matchId: parseInt(prediction.id),
      predictedTeam: prediction.predicted_winner
    }
  })
  
  return res.status(200).json({ predictions })
}

export const getPredictionsHistory = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = UserType.parse(user)

  const { rows: events } = await database.query(`
    SELECT e.id, e.name, e.logo, e.start_date, e.end_date, e.is_active FROM events e
    JOIN matches ON matches.event_id = e.id
    JOIN predictions ON predictions.match_id = matches.id
    WHERE predictions.user_id = $1 
    GROUP BY e.id
    ORDER BY e.start_date DESC LIMIT 2;
  `, [id])
  
  if(events.length === 0)
    return res.json([])

  const eventIds = events.map((e: { id:number }) => e.id)

  const eventsScoreResults = await database.query(`
    SELECT 
     e.id,
     COUNT(*) FILTER (WHERE p.predicted_winner = m.winner_team) AS correct,
     COUNT(*) FILTER (WHERE p.predicted_winner != m.winner_team) AS incorrect
    FROM predictions p
    JOIN matches m ON m.id = p.match_id
    JOIN events e ON e.id = m.event_id
    WHERE p.user_id = $1 AND e.id = ANY($2::bigint[]) AND m.winner_team IS NOT NULL
    GROUP BY e.id; 
  `, [id, eventIds])

  const matchesResults = await database.query(`
    SELECT 
     m.id, 
     m.event_id, 
     (m.team1).name AS team1_name, 
     (m.team1).logo AS team1_logo,
     (m.team2).name AS team2_name, 
     (m.team2).logo AS team2_logo,
     m.result,
     m.winner_team,
     m.date,
     p.predicted_winner,
     CASE
      WHEN m.winner_team = p.predicted_winner THEN 'correct'
      ELSE 'incorrect'
     END AS is_correct
    FROM predictions p
    JOIN matches m ON m.id = p.match_id
    JOIN events e ON e.id = m.event_id
    WHERE p.user_id = $1 AND e.id = ANY($2::bigint[]) AND m.winner_team IS NOT NULL
    ORDER BY m.id DESC;
  `, [id, eventIds])

  const scoreMap: Record<number, { correct: number; incorrect: number }> = {};
  for (const row of eventsScoreResults.rows) {
    scoreMap[row.id] = {
      correct: parseInt(row.correct),
      incorrect: parseInt(row.incorrect)
    };
  }

  const matchesMap: Record<number, any[]> = {};
  for (const row of matchesResults.rows) {
    if (!matchesMap[row.event_id]) matchesMap[row.event_id] = [];
    matchesMap[row.event_id].push({
      id: row.id,
      team1: { name: row.team1_name, logo: row.team1_logo },
      team2: { name: row.team2_name, logo: row.team2_logo },
      result: row.result,
      winner_team: row.winner_team,
      date: row.date,
      predicted_winner: row.predicted_winner,
      is_correct: row.is_correct
    });
  }

  const response = events.map((event: { id: number; name: string; logo: string; start_date: number; end_date: number; is_active: boolean }) => {
    const allMatches = matchesMap[event.id] || [];
    return {
      id: event.id,
      name: event.name,
      logo: event.logo,
      start_date: event.start_date,
      end_date: event.end_date,
      is_active: event.is_active,
      score: scoreMap[event.id] || { correct: 0, incorrect: 0 },
      recentMatches: allMatches.slice(0, 10),
      allMatches
    };
  });

  return res.json(response);
}