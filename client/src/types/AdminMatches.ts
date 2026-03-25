import Match from "./Match";

export interface MatchWithGuesses extends Match {
  guesses: number
}

interface AdminMatches {
  expire: number,
  matches: MatchWithGuesses[]
}

export default AdminMatches