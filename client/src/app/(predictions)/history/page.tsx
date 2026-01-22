'use client'

import Loading from "@/components/shared/Loading"
import HistoryCard from "@/components/ui/HistoryCard"
import backend from "@/services/api/backend"
import { EventHistory } from "@/types/EventHistory"
import { useQuery } from "@tanstack/react-query"

const HistoryPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ['history'],
    queryFn: async (): Promise<EventHistory> => {
      const result = await backend.get('/history')

      return result.data
    }
  })

  if(isPending) return <Loading />

  if(data && Object.keys(data).length > 0) return (
    <div className="min-h-[calc(98vh-9.5rem)] w-full px-10 lg:px-40 flex flex-col gap-8 pb-10 select-none">
      {
        Object.entries(data).reverse().map(([eventName, eventData]) => (
          <HistoryCard 
            eventName={eventName}
            logo={eventData.logo}
            placements={eventData.placements} 
            key={eventName} />
        ))
      }
    </div>
  );

  return (
    <div className="w-full lg:mt-20 flex justify-center items-center text-5xl lg:text-4xl text-center font-bold px-5 lg:px-0">
      <h2>There is currently no finished events, check back again later!</h2>
    </div>
  )
}

export default HistoryPage