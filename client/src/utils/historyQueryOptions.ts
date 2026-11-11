import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import backend from "@/services/api/backend"
import ApiHistoryType from "@/types/ApiHistoryType"

const historyQueryOptions = (page: number) => queryOptions({
  queryKey: ["history", { page }],
  queryFn: () => getHistory(page),
  placeholderData: keepPreviousData
})

const getHistory = async (page: number): Promise<ApiHistoryType> => {
  const result = await backend.get(`/history?page=${page}`)

  return result.data
}

export default historyQueryOptions
