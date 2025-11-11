"use client"

import LeaderboardEntry from "@/components/ui/LeaderboardEntry"
import PaginationControl from "@/components/ui/PaginationControl"
import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"

const LeaderboardPage = () => {
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery(leaderboardQueryOptions(page));
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.prefetchQuery(leaderboardQueryOptions(page+1))
  }, [page])
  
  // will get this information from backend
  const totalPages = 3;
  
  if(isPending) return <h1>Loading</h1>

  return (
    <>
      <div className="w-3/5 rounded-2xl mx-auto bg-secondary flex flex-col items-center select-none overflow-y-hidden ">
        {
          data && data.map((user, index) => (
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
          totalPages={totalPages}
          direction="back"
        />
        <PaginationControl
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          direction="next"
        />
      </div>
    </> 
  )
}

export default LeaderboardPage