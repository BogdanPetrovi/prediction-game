"use client"

import Placements from "@/components/predictions-pages/istorija/Placements"
import Error from "@/components/shared/Error"
import Loading from "@/components/shared/Loading"
import backend from "@/services/api/backend"
import EventHistory from "@/types/EventHistory"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

const IstorijaPage = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['history'],
    queryFn: async (): Promise<EventHistory[]> => {
      const result = await backend.get('/history')

      return result.data
    }
  })

  if(isPending) return <Loading />

  if(error) return <Error err={error} />

  if(!data || data.length < 1) return (
    <div className="w-full flex justify-center items-center text-5xl lg:text-4xl text-center font-bold px-5 lg:px-0">
      <h2>Trenutno nema završenih turnira, proverite kasnije!</h2>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-9.5rem)] max-w-3xl mx-3 md:mx-auto">
      <div className="pt-4 pb-6 flex flex-col gap-4">

        {data.map((event, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-gradient-to-r from-[#667EEA] via-[#9333EA] to-[#F39C12] px-5 py-4 flex items-center gap-4">
              <div className="relative size-11 shrink-0 rounded-lg overflow-hidden bg-white/15 p-1.5">
                <Image src={event.logo} fill alt={event.name} className="object-contain" unoptimized />
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
      </div>
    </div>
  )
}

export default IstorijaPage