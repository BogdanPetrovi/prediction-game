import { FinishedMatch } from "@/types/PredictionHistory"
import { formatDayKey } from "./formatDate"

export interface MatchDay {
  key: string,
  date: number,
  matches: FinishedMatch[],
  correct: number,
  incorrect: number,
  points: number | null
}

export const groupMatchesByDay = (matches: FinishedMatch[]): MatchDay[] => {
  const days = new Map<string, MatchDay>()

  for(const match of matches) {
    const key = formatDayKey(match.playedAt)
    const day = days.get(key) ?? { key, date: match.playedAt, matches: [], correct: 0, incorrect: 0, points: null }

    day.matches.push(match)
    if(match.isCorrect) day.correct++
    else day.incorrect++

    const points = match[match.predictedWinner].points
    if(points !== null) day.points = (day.points ?? 0) + (match.isCorrect ? points : 0)

    days.set(key, day)
  }

  return [...days.values()]
}
