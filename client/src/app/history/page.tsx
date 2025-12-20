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

  if(data)
    return (
      <div className="h-[calc(98vh-9.5rem)] w-full flex justify-around select-none">
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
    )
}

export default HistoryPage