"use client"

import Image from "next/image";
import { useId, useState } from "react"
import PredictionHistory from "@/types/PredictionHistory";
import { isOptimizedImage } from "@/utils/isOptimizedImage";
import { pluralize } from "@/utils/pluralize";
import ProfileEventMatches from "./ProfileEventMatches";

interface ProfileEventHistoryProps {
  data: PredictionHistory,
  username?: string,
  collapsible: boolean
}

const EventSummary = ({ data }: { data: PredictionHistory }) => (
  <>
    <span className="relative size-7 shrink-0">
      <Image
        src={data.logo}
        alt=""
        fill
        sizes="28px"
        className="object-contain"
        unoptimized={!isOptimizedImage(data.logo)}
      />
    </span>
    <span className="min-w-0 flex-1 flex flex-col">
      <span className="text-lg leading-snug font-semibold md:tracking-wider">{data.name}</span>
      <span className="text-xs font-normal text-slate-400 tabular-nums sg:text-stone-500">
        {data.placement && <>{data.placement.isFinal ? 'Konačna' : 'Trenutna'} pozicija: {data.placement.place}. · </>}
        {pluralize(data.points, 'poen', 'poena', 'poena')}
      </span>
    </span>
    <span className="shrink-0 font-semibold tabular-nums">
      <span className="text-green-400 sg:text-green-700">{data.score.correct}</span>
      <span className="px-1.5 text-slate-400 sg:text-stone-500">-</span>
      <span className="text-red-400 sg:text-red-600">{data.score.incorrect}</span>
    </span>
  </>
)

export default function ProfileEventHistory({ data, username, collapsible }: ProfileEventHistoryProps) {
  const [isOpen, setIsOpen] = useState(!collapsible)
  const matchesId = useId()

  if(!collapsible)
    return (
      <section className="mt-3">
        <h3 className="flex items-center gap-2">
          <EventSummary data={data} />
        </h3>
        <ProfileEventMatches event={data} username={username} />
      </section>
    )

  return (
    <section className="mt-5">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={matchesId}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-16 px-3 py-2 flex items-center gap-2 text-left rounded-xl cursor-pointer bg-secondary border border-zinc-700 hover:brightness-120 duration-200
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                     sg:bg-white sg:border-sg-sand sg:shadow-sm sg:hover:brightness-100 sg:hover:bg-sg-sand/40 sg:focus-visible:ring-sg-red"
        >
          <EventSummary data={data} />
          <svg className={`${isOpen ? 'rotate-180' : ''} size-4 shrink-0 text-slate-400 duration-200 motion-reduce:transition-none sg:text-stone-500`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </h3>
      <div id={matchesId} hidden={!isOpen}>
        {isOpen && <ProfileEventMatches event={data} username={username} />}
      </div>
    </section>
  )
}
