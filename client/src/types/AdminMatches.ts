import Match from "./UpcomingMatch";

export interface MatchWithGuesses extends Match {
  guesses: number
}

interface AdminMatches {
  expire: number,
  matches: MatchWithGuesses[]
}

export default AdminMatches