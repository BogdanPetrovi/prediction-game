"use client"

import { useQuery } from "@tanstack/react-query"
import { ReactNode } from "react"
import Loading from "@/components/shared/Loading"
import { profileQueryOptions } from "@/utils/profileQueryOptions"

interface ProfileProps {
  username?: string,
  belowName?: ReactNode
}

export default function Profile({ username, belowName }: ProfileProps) {
  const { data, isPending, isError } = useQuery(profileQueryOptions(username))

  if(isPending) return <Loading />

  if(isError || !data) return <></>

  return (
    <>
    <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0">
      <div className="min-w-0">
        <h2 className="font-bold text-4xl text-white break-words sg:text-sg-ink">{data.username}</h2>
        {belowName}
          {
            data.form.length > 0 &&
              <div className="flex items-center gap-2">
                <h4 className="uppercase tracking-[1.5px] text-lg text-muted">Trenutna forma:</h4>
                {
                  data.form.map((isRight, index) => (
                    isRight ? 
                    <div className="w-4 h-4 rounded-sm bg-green-400 shadow-md shadow-green-400/50" key={index}></div>
                    :
                    <div className="w-4 h-4 rounded-sm bg-red-400 shadow-md shadow-red-400/50" key={index}></div>
                  ))
                } 
              </div>
          }
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col items-start md:items-end">
          <h4 className="uppercase tracking-wide text-sm text-muted">Trenutni niz</h4>
          <h4 className={`${data.streak.type === 'win' ? "text-green-400 sg:text-green-600" : "text-red-400 sg:text-red-600"} text-3xl text-green-300 font-bold`}>
            { data.streak.count }
          </h4>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <h4 className="uppercase tracking-wide text-sm text-muted">Uspešnost</h4>
          <h4 className="text-3xl text-white font-bold sg:text-sg-ink">{ data.stats.successRate }%</h4>
        </div>
      </div>
    </div>

    {/* Profile bar */}
    <div className="mt-4 flex justify-between items-end">
      <div className="flex gap-4">
        <div>
          <h3 className="uppercase text-muted text-xs tracking-tighter">Ukupno</h3>
          <h3 className="text-white text-md font-bold sg:text-sg-ink">{ data.stats.total }</h3>
        </div>
        <div>
          <h3 className="uppercase text-muted text-xs tracking-tighter">Tačnih</h3>
          <h3 className="text-green-300 text-md font-bold sg:text-green-600">{ data.stats.correct }</h3>
        </div>
        <div>
          <h3 className="uppercase text-muted text-xs tracking-tighter">Netačnih</h3>
          <h3 className="text-red-400 text-md font-bold sg:text-red-600">{ data.stats.incorrect }</h3>
        </div>
      </div>
      <h4 className="uppercase text-muted text-xs tracking-tight">Ukupni učinak</h4>
    </div>
    <div className="h-2 w-full rounded-lg bg-secondary relative sg:bg-sg-sand">
      <div className={`absolute h-2 bg-green-400 rounded-lg sg:bg-green-500`} style={{ width: `${data.stats.successRate}%` }}></div>
    </div>
    </>
  )
}