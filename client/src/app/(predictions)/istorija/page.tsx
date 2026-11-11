"use client"

import Placements from "@/components/predictions-pages/istorija/Placements"
import HistoryPagination from "@/components/predictions-pages/istorija/HistoryPagination"
import Error from "@/components/shared/Error"
import Loading from "@/components/shared/Loading"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { isOptimizedImage } from "@/utils/isOptimizedImage"
import historyQueryOptions from "@/utils/historyQueryOptions"
import { useEffect, useState } from "react"

const IstorijaPage = () => {
  const [page, setPage] = useState(1)

  const { data, isPending, isPlaceholderData, error } = useQuery(historyQueryOptions(page))
  const queryClient = useQueryClient()
  const totalPages = data?.pages ?? 0

  useEffect(() => {
    if(page > 1)
      queryClient.prefetchQuery(historyQueryOptions(page - 1))

    if(page < totalPages)
      queryClient.prefetchQuery(historyQueryOptions(page + 1))
  }, [page, totalPages, queryClient])

  if(isPending) return <Loading />

  if(error) return <Error err={error} />

  if(!data || data.total < 1) return (
    <div className="w-full flex justify-center items-center text-5xl lg:text-4xl text-center font-bold px-5 lg:px-0">
      <h2>Trenutno nema završenih turnira, proverite kasnije!</h2>
    </div>
  )

  const changePage = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-[calc(100vh-9.5rem)] max-w-3xl mx-3 md:mx-auto">
      <div className={`pt-4 pb-6 flex flex-col gap-4 duration-200 ${isPlaceholderData ? "opacity-60" : ""}`}>

        {data.events.map((event) => (
          <div key={event.name} className="rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-gradient-to-r from-[#667EEA] via-[#9333EA] to-[#F39C12] px-5 py-4 flex items-center gap-4">
              <div className="relative size-11 shrink-0 rounded-lg overflow-hidden bg-white/15 p-1.5">
                <Image src={event.logo} fill sizes="32px" alt={event.name} className="object-contain" unoptimized={!isOptimizedImage(event.logo)} />
              </div>
              <h3 className="text-white font-extrabold text-lg tracking-tight drop-shadow-sm">
                {event.name}
              </h3>
            </div>

            <div className="bg-white/[0.04] flex flex-col divide-y divide-white/10">
              <Placements placements={event.placements} key={event.name} />
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="pt-2">
            <HistoryPagination
              page={page}
              totalPages={totalPages}
              totalEvents={data.total}
              pageSize={data.pageSize}
              onPageChange={changePage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default IstorijaPage