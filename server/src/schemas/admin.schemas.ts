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
    event: z.object({ id: z.number() }),
    live: z.boolean()
})

export const matchList = z.array(match)

const newMatchTeam = z.object({
    name: z.string().min(1),
    logo: z.url().or(z.literal(''))
})

export const newMatch = z.object({
    id: z.number().positive(),
    team1: newMatchTeam,
    team2: newMatchTeam,
    date: z.number().positive(),
    format: z.enum(['bo1', 'bo3', 'bo5'])
})

export const event = z.object({
    id: z.coerce.number().positive(),
    logo: z.string(),
    name: z.string(),
    startDate: z.coerce.number(),
    endDate: z.coerce.number(),
    isActive: z.boolean(),
    parentEventId: z.coerce.number().optional()
})

enum Status {
  First = 1,
  Second = 2,
  Third = 3,
}

export const prize = z.object({
    skinName: z.string(),
    skinImage: z.url(),
    eventId: z.coerce.number(),
    place: z.enum(Status)
})