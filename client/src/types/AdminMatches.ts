import { UpcomingMatch } from "./UpcomingMatches";

export interface MatchWithGuesses extends UpcomingMatch {
  guesses: number
}

// redis = HLTV list from cache, database = fallback when the cache key is missing
export type MatchesSource = 'redis' | 'database'

interface AdminMatches {
  expire: number | null,
  matches: MatchWithGuesses[] | null,
  source: MatchesSource | null
}

export default AdminMatches
