export default interface RecentPredictions {
  id: number,
  team1: Team,
  team2: Team,
  predictedWinner: string,
  winnerTeam: string,
  result: string
}

interface Team {
  name: string,
  logo: string
}