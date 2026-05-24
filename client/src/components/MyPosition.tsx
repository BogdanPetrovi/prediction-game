'use client'

import backend from "@/services/api/backend"
import LeaderboardPlace from "@/types/LeaderboardPlace"
import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React, { Dispatch, SetStateAction } from "react"

interface MyPositionProps {
  page: number,
  setPage: Dispatch<SetStateAction<number>>
}

const MyPosition: React.FC<MyPositionProps> = ({ page, setPage }) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['users-ledaerboard-page'],
    queryFn: async (): Promise<LeaderboardPlace> => {
      const result = await backend.get("/users-ledaerboard-page")

      return result.data
    }
  })

  const prefetchPage = async () => {
    if(data?.page)
      queryClient.prefetchQuery(leaderboardQueryOptions(data?.page))
  }

  if(isLoading) return <></>

  if(!data) return <></>

  if(data.page === null || data.place === null) return <></>

  return(
    <button 
      className={`
        ${page === data.page ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-light-secondary"}
        flex items-center gap-2 px-2 py-1 bg-secondary border border-slate-700 rounded-md text-sm font-bold text-slate-200 `}
      onMouseEnter={prefetchPage}
      onClick={() => setPage(data.page!)}
    >
      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
      Moja pozcija
    </button>
  )
}

export default MyPosition