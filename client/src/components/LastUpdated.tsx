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
    <h3 className="w-full text-right">Ažurirano: {data.lastUpdated}</h3>
  )
}

export default LastUpdated