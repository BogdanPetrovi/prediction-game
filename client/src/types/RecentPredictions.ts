export default interface RecentPredictions {
  id: number
  team1: Team
  team2: Team
  predictedWinner: string
  winnerTeam: string | null
  result: string | null
}

interface Team {
  name: string,
  logo: string
}