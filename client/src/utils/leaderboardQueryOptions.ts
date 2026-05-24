import { queryOptions } from "@tanstack/react-query"
import backend from "@/services/api/backend"
import ApiLeaderboardType from "@/types/ApiLeaderboardType"

const leaderboardQueryOptions = (page: number) => queryOptions({
  queryKey: ["leaderboard", { page }],
  queryFn: () => getLeaderboard(page)
})

const getLeaderboard = async (page: number): Promise<ApiLeaderboardType> => {
  const result = await backend.get(`/leaderboard?page=${page}`)

  return result.data
}

export default leaderboardQueryOptions