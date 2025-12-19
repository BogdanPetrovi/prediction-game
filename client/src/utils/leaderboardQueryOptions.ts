import { queryOptions } from "@tanstack/react-query"
import LeaderboardItem from "@/types/LeaderboardItem"
import backend from "@/services/api/backend"

const leaderboardQueryOptions = (page: number) => queryOptions({
  queryKey: ["leaderboard", { page }],
  queryFn: () => getLeaderboard(page)
})

const getLeaderboard = async (page: number): Promise<apiLeaderboardType> => {
  const result = await backend.get(`/leaderboard?page=${page}`)

  return result.data
}

interface apiLeaderboardType {
  pages: number,
  leaderboard: Array<LeaderboardItem>
}

export default leaderboardQueryOptions