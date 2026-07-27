import { UpcomingMatch } from "./UpcomingMatches";

export interface MatchWithGuesses extends UpcomingMatch {
  guesses: number
}

interface AdminMatches {
  expire: number,
  matches: MatchWithGuesses[]
}

export default AdminMatches