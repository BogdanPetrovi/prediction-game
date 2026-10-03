import Team from "./Team"

export default interface MatchWithoutResult {
  id: number,
  team1: Team,
  team2: Team,
  date?: number,
  format: string
}
