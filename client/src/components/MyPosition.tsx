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
    <div className={`${page === data.page ? "hidden" : ""} text-xl xl:text-2xl font-semibold cursor-pointer hover:text-blue-200 active:text-blue-400 duration-200`}
      onMouseEnter={prefetchPage}
      onClick={() => setPage(data.page!)}>
      <h2>Moja pozicija</h2>
    </div>
  )
}

export default MyPosition