"use client"

import { useQuery } from "@tanstack/react-query";
import ProfileEventHistory from "./ProfileEventHistory";
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
        data.length ?
          data.map(event => (
            <ProfileEventHistory data={event} key={event.id} />
          ))
        :
          <div className="w-full flex flex-col items-center mt-2 gap-2">
            <div className="w-40 h-4 rounded-full rounded-b-none bg-gradient-to-l from-[#667EEA] to-[#9333EA]" />
            <h2 className="w-11/12 text-center text-xl font-semibold">
              Nisi odigrao nijednu predikciju do sada. 
              Kada budeš napravio svoju prvu predikciju ovde ćeš moći da pratiš svoje rezultate!
            </h2>
            <div className="w-40 h-4 rounded-full rounded-t-none bg-gradient-to-l from-[#F39C12] to-[#FFA500]" />
          </div>
      }
    </div>
  )
}