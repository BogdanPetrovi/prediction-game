import { Request, Response } from "express";
import redisClient from "../config/redis.js";
import database from "../database/database.js";
import User from "../types/User.js";
import Prediction from "../types/Prediction.js";
import RecentPredictions from "../types/RecentPredictions.js";
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
    [id, prediction.matchId, prediction.predictedWinner])
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

export const getRecentPredictions = async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = UserType.parse(user)

  const result = await database.query(`SELECT matches.id, team1, team2, predicted_winner, winner_team, result FROM predictions
                                        JOIN matches ON predictions.match_id = matches.id
                                        WHERE user_id = $1
                                        AND predictions.created_at >= NOW() - INTERVAL '21 days'
                                        ORDER BY predictions.created_at DESC
                                        LIMIT 30;`, [id])
  
  const recentPredictions: RecentPredictions[] = result.rows.map(prediction => {
    // prediction type is (teamName, teamLogo) and this functions will make a JSON out of it, as well as change naming to camel casing
    // postgresql sometimes saves name with quotes, resulting in cutting off first or last letter by quotes
    const team1NameAndLogoWithoutQuotes = prediction.team1.replaceAll('"', '')
    const team1CommaIndex = team1NameAndLogoWithoutQuotes.indexOf(",")
    const team1Name = team1NameAndLogoWithoutQuotes.substring(1, team1CommaIndex)
    const team1Logo = team1NameAndLogoWithoutQuotes.substring(team1CommaIndex + 1, team1NameAndLogoWithoutQuotes.length - 1)

    const team2NameAndLogoWithoutQuotes = prediction.team2.replaceAll('"', '')
    const team2CommaIndex = team2NameAndLogoWithoutQuotes.indexOf(",")
    const team2Name = team2NameAndLogoWithoutQuotes.substring(1, team2CommaIndex)
    const team2Logo = team2NameAndLogoWithoutQuotes.substring(team2CommaIndex + 1, team2NameAndLogoWithoutQuotes.length - 1)

    return {
      id: prediction.id,
      team1: {
        name: team1Name,
        logo: team1Logo
      },
      team2: {
        name: team2Name,
        logo: team2Logo
      },
      predictedWinner: prediction.predicted_winner,
      winnerTeam: prediction.winner_team,
      result: prediction.result
    }
  });

  return res.status(200).json(recentPredictions)
}