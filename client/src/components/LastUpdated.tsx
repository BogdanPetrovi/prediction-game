'use client'

import backend from "@/services/api/backend"
import { useQuery } from "@tanstack/react-query"

const LastUpdated = () => {
  interface LastUpdated {
    lastUpdated: number
  }

  const { data, isPending, error } = useQuery({
    queryKey: ['last-updated'],
    queryFn: async (): Promise<LastUpdated | null> => {
      const result = await backend.get('/leaderboard-last-update-at')

      return result.data
    }
  })

  if(isPending || error || data === null) return <></>

  return (
    <div className="text-xl xl:text-2xl font-semibold flex items-end w-1/3">
      <h2>Ažurirano: {data.lastUpdated}</h2>
    </div>
  )
}

export default LastUpdated