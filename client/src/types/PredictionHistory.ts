export default interface PredictionHistory {
  id: number,
  name: string,
  logo: string,
  start_date: string,
  end_date: string,
  is_active: boolean,
  durationDays: number | null,
  score: Score,
  points: number,
  placement: Placement | null
}

interface Score {
  correct: number,
  incorrect: number
}

interface Placement {
  place: number,
  isFinal: boolean
}

export interface EventMatches {
  total: number,
  matches: FinishedMatch[]
}

export interface FinishedMatch {
  id: number,
  playedAt: number,
  team1: FinishedMatchTeam,
  team2: FinishedMatchTeam,
  result: string,
  winnerTeam: "team1" | "team2",
  predictedWinner: "team1" | "team2",
  isCorrect: boolean
}

export interface FinishedMatchTeam {
  name: string,
  logo: string,
  points: number | null
}
