"use client"

import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
  const [page, setPage] = useState(1)
  const [showLastUpdated, setShowLastUpdated] = useState(false)

  const { data, isPending, error } = useQuery(leaderboardQueryOptions(page));
  const queryClient = useQueryClient();
  useEffect(() => {
    setShowLastUpdated(true)

    if(page !== 1)
      queryClient.prefetchQuery(leaderboardQueryOptions(page-1))

    queryClient.prefetchQuery(leaderboardQueryOptions(page+1))
  }, [page, queryClient])

  if(error) return <Error err={error} />

  if(isPending) return <Loading />

  if(!data || (Array.isArray(data) && data.length === 0) || data.leaderboard.length < 1) {
    return (
      <NoResult title="Pauza između turnira" subtitle="Trenutno nema aktivne tabele. Novi turnir počinje uskoro." />
    )
  }

  return (
    <>
      <div className="w-full h-14 flex justify-between mb-2">
        <ShortcutButtons page={page} setPage={setPage} />
      </div>
      <div className="bg-secondary/50 border border-slate-700 rounded-lg overflow-hidden shadow-md shadow-slate-900/50">
        <div className="overflow-x-auto">
          <Table data={data} page={page} />
        </div>
        <div className="bg-secondary border-t h-12 border-slate-700 p-3 flex justify-center items-center gap-4">
          <PaginationControl direction="back" page={page} setPage={setPage} totalPages={data.pages} />
          <h3 className="font-semibold">{page}</h3>
          <PaginationControl direction="next" page={page} setPage={setPage} totalPages={data.pages} />
        </div>
      </div>
      <div className="w-full h-0.5 bg-slate-700 brightness-50 mt-2 rounded-xl"></div>
      {
        showLastUpdated && <LastUpdated />
      }
    </>
  )
}