import { date, z } from "zod"

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

export const event = z.object({
    id: z.coerce.number().positive(),
    logo: z.string(),
    name: z.string(),
    startDate: z.coerce.number(),
    endDate: z.coerce.number(),
    isActive: z.boolean(),
    parentEventId: z.coerce.number().optional()
})