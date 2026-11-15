"use client"

import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { leaderboardHref, parseLeaderboardPage, saveLeaderboardPage } from "@/utils/leaderboardPage";
import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import ShortcutButtons from "./ShortcutButtons";
import PaginationControl from "./PaginationControl";
import Table from "./Table";
import dynamic from "next/dynamic";
import NoResult from "@/components/shared/NoResult";

const LastUpdated = dynamic (() => import('@/components/predictions-pages/tabela/LastUpdated'), 
  {
    ssr: false,
    loading: () => <></>
  }
)

export default function Leaderboard() {
  const searchParams = useSearchParams()
  const page = parseLeaderboardPage(searchParams.get('strana'))
  const [showLastUpdated, setShowLastUpdated] = useState(false)

  const setPage: Dispatch<SetStateAction<number>> = (value) => {
    const nextPage = typeof value === 'function' ? value(page) : value
    window.history.replaceState(null, '', leaderboardHref(nextPage))
  }

  const { data, isPending, error } = useQuery(leaderboardQueryOptions(page));
  const queryClient = useQueryClient();
  useEffect(() => {
    setShowLastUpdated(true)
    saveLeaderboardPage(page)

    if(page !== 1)
      queryClient.prefetchQuery(leaderboardQueryOptions(page-1))

    queryClient.prefetchQuery(leaderboardQueryOptions(page+1))
  }, [page, queryClient])

  useEffect(() => {
    if(data && data.pages > 0 && page > data.pages)
      window.history.replaceState(null, '', leaderboardHref(data.pages))
  }, [data, page])

  if(error) return <Error err={error} />

  if(isPending) return <Loading />

  if(!data || data.pages === 0) {
    return (
      <NoResult title="Pauza između turnira" subtitle="Trenutno nema aktivne tabele. Novi turnir počinje uskoro." />
    )
  }

  return (
    <>
      {
        data.leaderboard.length > 0 &&
        <div className="w-full h-14 flex justify-between mb-2">
          <ShortcutButtons page={page} setPage={setPage} />
        </div>
      }
      <div className={`${data.leaderboard.length === 0 ? "mt-5" : ""} bg-secondary/50 border border-slate-700 rounded-lg overflow-hidden shadow-md shadow-slate-900/50 sg:bg-white sg:border-sg-sand sg:shadow-sg-ink/5`}>
        <div className="overflow-x-auto">
          <Table data={data} page={page} />
        </div>
        <div className="bg-secondary border-t h-12 border-slate-700 p-3 flex justify-center items-center gap-4 sg:bg-sg-cream sg:border-sg-sand">
          <PaginationControl direction="back" page={page} setPage={setPage} totalPages={data.pages} />
          <h3 className="font-semibold">{page}</h3>
          <PaginationControl direction="next" page={page} setPage={setPage} totalPages={data.pages} />
        </div>
      </div>
      <div className="w-full h-0.5 bg-secondary mt-2 rounded-xl sg:bg-sg-red/40"></div>
      {
        showLastUpdated && <LastUpdated />
      }
    </>
  )
}