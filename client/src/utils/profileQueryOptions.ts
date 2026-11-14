import { queryOptions } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import backend from "@/services/api/backend"
import type Profile from "@/types/Profile"
import type PredictionHistory from "@/types/PredictionHistory"

export const profileQueryOptions = (username?: string) => queryOptions({
  queryKey: username ? ['profile', username] : ['profile'],
  queryFn: async (): Promise<Profile> => {
    const url = username ? `/users/${encodeURIComponent(username)}/profile` : '/profile'
    const result = await backend.get(url)
    return result.data
  },
  staleTime: 60_000,
  retry: (failureCount, error) => !isNotFound(error) && failureCount < 3
})

export const predictionHistoryQueryOptions = (username?: string) => queryOptions({
  queryKey: username ? ['prediction-history', username] : ['prediction-history'],
  queryFn: async (): Promise<PredictionHistory[]> => {
    const url = username ? `/users/${encodeURIComponent(username)}/prediction-history` : '/prediction-history'
    const result = await backend.get(url)
    return result.data
  },
  staleTime: 60_000,
  retry: (failureCount, error) => !isNotFound(error) && failureCount < 3
})

export const isNotFound = (error: unknown) => isAxiosError(error) && error.response?.status === 404
