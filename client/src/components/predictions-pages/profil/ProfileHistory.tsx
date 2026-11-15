"use client"

import { useQuery } from "@tanstack/react-query";
import ProfileEventHistory from "./ProfileEventHistory";
import { predictionHistoryQueryOptions } from "@/utils/profileQueryOptions";

export default function ProfileHistory({ username }: { username?: string }) {
  const { data, isPending, isError } = useQuery(predictionHistoryQueryOptions(username))

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
            <div className="w-40 h-4 rounded-full rounded-b-none bg-gradient-to-l from-[#667EEA] to-[#9333EA] sg:from-sg-red sg:to-sg-wine" />
            <h2 className="w-11/12 text-center text-xl font-semibold">
              {
                username ?
                  <>Ovaj korisnik još nema završenih predikcija.</>
                :
                  <>
                    Nisi odigrao nijednu predikciju do sada.
                    Kada budeš napravio svoju prvu predikciju ovde ćeš moći da pratiš svoje rezultate!
                  </>
              }
            </h2>
            <div className="w-40 h-4 rounded-full rounded-t-none bg-gradient-to-l from-[#F39C12] to-[#FFA500] sg:bg-none sg:bg-white sg:ring-1 sg:ring-sg-red/40" />
          </div>
      }
    </div>
  )
}