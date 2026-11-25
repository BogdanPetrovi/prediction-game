"use client"

import { useRef, useState } from "react"
import { FinishedMatch } from "@/types/PredictionHistory"
import ProfileHistoryMatch from "./ProfileHistoryMatch"

interface ProfileMatchListProps {
  matches: FinishedMatch[],
  previewCount: number
}

export default function ProfileMatchList({ matches, previewCount }: ProfileMatchListProps) {
  const [showAll, setShowAll] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const toggle = () => {
    setShowAll(!showAll)
    if(showAll) requestAnimationFrame(() => listRef.current?.scrollIntoView({ block: 'nearest' }))
  }

  return (
    <div ref={listRef} className="mt-2 scroll-my-4 bg-secondary rounded-xl border border-zinc-700 overflow-hidden sg:bg-white sg:border-sg-sand sg:shadow-sm">
      <ul className="divide-y divide-zinc-700 sg:divide-sg-sand">
        {(showAll ? matches : matches.slice(0, previewCount)).map(match => <ProfileHistoryMatch data={match} key={match.id} />)}
      </ul>
      {
        matches.length > previewCount &&
          <button
            type="button"
            aria-expanded={showAll}
            onClick={toggle}
            className="min-h-11 w-full flex justify-center items-center font-semibold cursor-pointer border-t border-zinc-700 hover:bg-white/10 active:bg-white/15 duration-200
                       focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500
                       sg:border-transparent sg:bg-sg-crimson sg:text-white sg:hover:bg-sg-wine sg:active:bg-sg-wine sg:focus-visible:outline-white"
          >
            {showAll ? 'Prikaži manje' : `Prikaži sve (${matches.length})`}
          </button>
      }
    </div>
  )
}
