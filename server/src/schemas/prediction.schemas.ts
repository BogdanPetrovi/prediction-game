import { z } from 'zod'

const Prediction = z.object({
    matchId: z.number().positive(),
    predictedTeam: z.enum(['team1','team2'])
})

export const PredictionsArray = z.array(Prediction)