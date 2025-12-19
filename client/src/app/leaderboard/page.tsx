"use client"

import Loading from "@/components/shared/Loading"
import LeaderboardEntry from "@/components/ui/LeaderboardEntry"
import PaginationControl from "@/components/ui/PaginationControl"
import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

const LeaderboardPage = () => {
  const [page, setPage] = useState(1);

  const { data, isPending, error } = useQuery(leaderboardQueryOptions(page));
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(leaderboardQueryOptions(page+1))
  }, [page])
  
  if(isPending) return <Loading />

  if(error) return <h1>Error</h1>

  if(data && data.leaderboard) return (
    <>
      <div className="min-h-[40rem] w-3/5 rounded-2xl mx-auto bg-secondary flex flex-col items-center select-none overflow-y-hidden ">
        {
          data.leaderboard.map((user, index) => (
            <LeaderboardEntry
              item={user}
              ranking={(index+1) + (( page-1 ) *10)}
              key={user.username}
            />
          ))
        }
      </div>
      <div className="w-3/5 mx-auto flex justify-end pr-3 text-3xl gap-5 mt-1">
        <PaginationControl
          page={page}
          setPage={setPage}
          totalPages={data.pages}
          direction="back"
        />
        <PaginationControl
          page={page}
          setPage={setPage}
          totalPages={data.pages}
          direction="next"
        />
      </div>
    </>
  )

  return (
  <div className="w-full mt-20 flex justify-center text-4xl font-bold">
    <h2>There is currently no leaderboard, check back again later!</h2>
  </div>
  )
}

export default LeaderboardPage