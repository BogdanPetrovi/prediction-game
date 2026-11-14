"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import { getSavedLeaderboardHref } from "@/utils/leaderboardPage"

const subscribe = () => () => {}

export default function BackToLeaderboard() {
  const href = useSyncExternalStore(subscribe, getSavedLeaderboardHref, () => '/tabela')

  return (
    <Link
      href={href}
      className="min-h-11 -ml-1 px-1 mb-2 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 duration-200 group"
    >
      <svg className="size-4 group-hover:-translate-x-0.5 duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
      Nazad na tabelu
    </Link>
  )
}
