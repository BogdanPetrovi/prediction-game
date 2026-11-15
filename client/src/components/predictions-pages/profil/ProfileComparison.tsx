"use client"

import { useQuery } from "@tanstack/react-query"
import type Profile from "@/types/Profile"
import { profileQueryOptions } from "@/utils/profileQueryOptions"

interface ComparisonRowProps {
  label: string,
  mine: number,
  theirs: number,
  suffix?: string
}

function ComparisonRow({ label, mine, theirs, suffix = '' }: ComparisonRowProps) {
  const total = mine + theirs
  const myShare = total === 0 ? 50 : (mine / total) * 100

  return (
    <div>
      <div className="flex justify-between items-baseline gap-3">
        <span className={`${mine >= theirs ? "text-white sg:text-sg-ink" : "text-slate-400 sg:text-stone-400"} text-lg font-bold tabular-nums`}>
          {mine}{suffix}
        </span>
        <span className="uppercase text-muted text-xs tracking-wide">{label}</span>
        <span className={`${theirs >= mine ? "text-white sg:text-sg-ink" : "text-slate-400 sg:text-stone-400"} text-lg font-bold tabular-nums`}>
          {theirs}{suffix}
        </span>
      </div>
      <div className="mt-1 h-2 flex gap-0.5 rounded-full overflow-hidden" aria-hidden="true">
        <div
          className={`${total === 0 ? "bg-slate-700 sg:bg-sg-sand" : "bg-orange-500 sg:bg-sg-red"} h-full duration-500`}
          style={{ width: `${myShare}%` }}
        />
        <div className={`${total === 0 ? "bg-slate-700 sg:bg-sg-sand" : "bg-[#9333EA] sg:bg-stone-600"} h-full flex-1`} />
      </div>
    </div>
  )
}

export default function ProfileComparison({ them }: { them: Profile }) {
  const { data: me } = useQuery(profileQueryOptions())

  if(!me) return <></>

  return (
    <section className="slide-down">
      <h2 className="text-xl text-muted uppercase tracking-[1.5px] mt-6 mb-2">Poređenje</h2>
      <div className="bg-secondary/50 border border-slate-700 rounded-lg p-4 shadow-md shadow-slate-900/50 sg:bg-white sg:border-sg-sand sg:shadow-sg-ink/5">
        <div className="flex justify-between items-center gap-4 mb-3 text-sm font-bold">
          <span className="flex items-center gap-2 text-orange-500 sg:text-sg-crimson">
            <span className="size-2.5 rounded-full bg-orange-500 sg:bg-sg-red" aria-hidden="true" />
            Ti
          </span>
          <span className="flex items-center gap-2 text-white min-w-0 sg:text-sg-ink">
            <span className="truncate">{them.username}</span>
            <span className="size-2.5 shrink-0 rounded-full bg-[#9333EA] sg:bg-stone-600" aria-hidden="true" />
          </span>
        </div>
        <div className="flex flex-col gap-3">
          <ComparisonRow label="Uspešnost" mine={me.stats.successRate} theirs={them.stats.successRate} suffix="%" />
          <ComparisonRow label="Tačnih" mine={me.stats.correct} theirs={them.stats.correct} />
          <ComparisonRow label="Ukupno" mine={me.stats.total} theirs={them.stats.total} />
        </div>
      </div>
    </section>
  )
}
