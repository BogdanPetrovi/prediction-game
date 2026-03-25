import { z } from "zod"

const teamObject = z.object({
    id: z.number().positive().nullable(),
    name: z.string(),
    logo: z.string()
})

const match = z.object({
    id: z.number().positive(),
    date: z.number().optional(),
    team1: teamObject,
    team2: teamObject,
    format: z.string(),
    live: z.boolean()
})

export const matchList = z.array(match)