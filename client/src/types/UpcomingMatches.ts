import Team from "./Team"

interface Event {
  id: number
}

export interface UpcomingMatch {
  id: number,
  // if match is live there is no date
  date?: number,
  team1: Team,
  team2: Team,
  format: string,
  event: Event,
  live: boolean 
}

export interface NoMatches {
  message: string,
  description?: string
}

export default interface UpcomingMatchesApiResponse {
  matches: UpcomingMatch[] | null,
  message: string,
  description?: string
}