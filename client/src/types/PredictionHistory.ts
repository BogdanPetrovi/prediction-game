import Team from "./Team"

export default interface PredictionHistory {
  id: number,
  name: string,
  logo: string,
  start_date: string,
  end_date: string,
  is_active: boolean,
  score: Score,
  recentMatches: FinishedMatch[],
  allMatches: FinishedMatch[]
}

interface Score {
  correct: number,
  incorrect: number
}

export interface FinishedMatch {
  id: number,
  team1: Team,
  team2: Team,
  result: string,
  winner_team: "team1" | "team2",
  date: number,
  predicted_winner: "team1" | "team2",
  is_correct: "correct" | "incorrect"
}