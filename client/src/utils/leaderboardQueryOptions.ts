import { queryOptions } from "@tanstack/react-query"
import { leaderboardCut } from "./leaderboardExapmleArray"

const leaderboardQueryOptions = (page: number) => queryOptions({
  queryKey: ["leaderboard", { page }],
  queryFn: () => leaderboardCut(page)
})

export default leaderboardQueryOptions