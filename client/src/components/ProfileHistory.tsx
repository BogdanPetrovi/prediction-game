"use client"

import { useQuery } from "@tanstack/react-query";
import ProfileEventHistory from "./ui/ProfileEventHistory";
import backend from "@/services/api/backend";
import PredictionHistory from "@/types/PredictionHistory";

export default function ProfileHistory() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['prediction-history'],
    queryFn: async (): Promise<PredictionHistory[]> => {
      const result = await backend.get('prediction-history')
      return result.data
    }
  })

  if(isPending) return <></>

  if(!data || isError) return <></>

  return (
    <div className="slide-down">
      <h2 className="text-xl text-muted uppercase tracking-[1.5px] mt-5 mb-1">Istorija predikcija</h2>
      
      {
        data.map(event => (
          <ProfileEventHistory data={event} key={event.id} />
        ))
      }
    </div>
  )
}