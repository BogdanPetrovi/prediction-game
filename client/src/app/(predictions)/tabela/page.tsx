"use client"

import Error from "@/components/shared/Error"
import Loading from "@/components/shared/Loading"
import LeaderboardEntry from "@/components/ui/LeaderboardEntry"
import PaginationControl from "@/components/ui/PaginationControl"
import ToTop from "@/components/ui/ToTop"
import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const Event = dynamic(() => import('@/components/shared/Event'),
  {
    ssr: false,
    loading: () => <></>
  }
)

const MyPosition = dynamic (() => import('@/components/MyPosition'), 
  {
    ssr: false,
    loading: () => <></>
  }
)

const LastUpdated = dynamic (() => import('@/components/LastUpdated'), 
  {
    ssr: false,
    loading: () => <></>
  }
)

const LeaderboardPage = () => {
  const [page, setPage] = useState(1);
  const [showEvent, setShowEvent] = useState(false)
  const [showMyPosition, setShowMyPosition] = useState(false)
  const [showLastUpdated, setShowLastUpdated] = useState(false)

  const { data, isPending, error } = useQuery(leaderboardQueryOptions(page));
  const queryClient = useQueryClient();
  useEffect(() => {
    setShowEvent(true)
    setShowMyPosition(true)
    setShowLastUpdated(true)

    if(page !== 1)
      queryClient.prefetchQuery(leaderboardQueryOptions(page-1))

    queryClient.prefetchQuery(leaderboardQueryOptions(page+1))
  }, [page])
  
  if(isPending) return <Loading />

  if(error) return <Error err={error} />

  if(!data || !data.leaderboard) return (
    <div className="w-full lg:mt-20 flex justify-center items-center text-5xl lg:text-4xl text-center font-bold px-5 lg:px-0">
      <h2>Trenutno nema tabele, proverite kasnije!</h2>
    </div>
  )

  return (
    <>
      <div className="w-[90%] xl:w-3/5 h-[46rem] xl:mt-6 rounded-2xl mx-auto bg-secondary flex flex-col items-center select-none relative overflow-hidden xl:overflow-visible">
        <div className="hidden xl:block xl:absolute -top-12">
          {showEvent && <Event />}
        </div>
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
      <div className="w-full xl:w-3/5 xl:mx-auto flex items-start justify-between px-5 md:px-14 xl:px-3 text-3xl mt-1 select-none">
        { showLastUpdated && <LastUpdated /> }
        <div className="flex gap-3 lg:gap-5">
          { showMyPosition && <MyPosition page={page} setPage={setPage} /> } 
          { page !== 1 && <ToTop handleClick={() => setPage(1)} /> }
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
      </div>
    </>
  )
}

export default LeaderboardPage