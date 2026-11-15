"use client"

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { isOptimizedImage } from "@/utils/isOptimizedImage"
import { leaderboardHref } from "@/utils/leaderboardPage"
import { predictionHistoryQueryOptions } from "@/utils/profileQueryOptions"

export default function CurrentPlacement({ username }: { username?: string }) {
  const { data } = useQuery(predictionHistoryQueryOptions(username))

  const current = data?.find(event => event.placement && !event.placement.isFinal)

  if(!current?.placement) return <></>

  const { place } = current.placement

  return (
    <Link
      href={leaderboardHref(Math.ceil(place / 10))}
      title={current.name}
      aria-label={`${place}. mesto na tabeli turnira ${current.name}, ${current.score.correct} tačnih i ${current.score.incorrect} netačnih`}
      className="group mt-2 mb-2.5 h-10 pl-1.5 pr-2.5 inline-flex items-center gap-2 rounded-lg bg-secondary border border-slate-700 hover:border-orange-500/60 hover:brightness-120 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 duration-200 slide-down
                 sg:bg-white sg:border-sg-sand sg:hover:border-sg-red/60 sg:hover:brightness-100 sg:focus-visible:ring-sg-red sg:shadow-sm"
    >
      <div className="relative size-6 shrink-0">
        <Image
          src={current.logo}
          alt=""
          fill
          sizes="24px"
          className="object-contain"
          unoptimized={!isOptimizedImage(current.logo)}
        />
      </div>
      <span className="text-sm font-semibold text-slate-300 sg:text-stone-700">
        <span className="text-orange-500 font-bold text-base tabular-nums sg:text-sg-crimson">{place}.</span> mesto na tabeli
      </span>
      <span className="text-muted" aria-hidden="true">·</span>
      <span className="text-sm font-semibold tabular-nums">
        <span className="text-green-400 sg:text-green-600">{current.score.correct}</span>
        <span className="text-muted px-1">-</span>
        <span className="text-red-400 sg:text-red-600">{current.score.incorrect}</span>
      </span>
      <svg className="size-3.5 text-slate-500 group-hover:text-orange-500 group-hover:translate-x-0.5 duration-200 sg:text-stone-400 sg:group-hover:text-sg-red" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  )
}
