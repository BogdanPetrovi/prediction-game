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

export const matchResult = z.object({
    matchId: z.number().positive(),
    team1Score: z.number().int().min(0),
    team2Score: z.number().int().min(0)
}).refine(r => r.team1Score !== r.team2Score, { message: "Result can't be a draw" })

export const calculationHours = z.array(z.number().int().min(0).max(23)).min(1)
    .transform(hours => [...new Set(hours)].sort((a, b) => a - b))

export const MIN_EVENT_ID = 10000

const eventId = z.coerce.number().int().min(MIN_EVENT_ID, "Events with id 9999 or lower are from the old HLTV system")

export const eventQuery = z.object({ eventId })

export const eventSearch = z.object({ query: z.string().trim().min(1) })

export const event = z.object({
    id: eventId,
    logo: z.url(),
    name: z.string(),
    startDate: z.coerce.number(),
    endDate: z.coerce.number(),
    isActive: z.boolean(),
    parentEventId: eventId.or(z.literal(0)).optional()
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