"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import PredictionHistory from "@/types/PredictionHistory"
import { eventMatchesQueryOptions } from "@/utils/profileQueryOptions"
import OutcomeFilter, { matchesOutcome, Outcome } from "./OutcomeFilter"
import ProfileHistoryError from "./ProfileHistoryError"
import ProfileMatchDays from "./ProfileMatchDays"
import ProfileMatchList from "./ProfileMatchList"

const GROUP_BY_DAY_FROM = 8
const PREVIEW_COUNT = 10

const emptyMessage = {
  all: 'Još nema završenih mečeva na ovom turniru.',
  correct: 'Nema pogođenih mečeva na ovom turniru.',
  incorrect: 'Nema promašenih mečeva na ovom turniru.'
}

export default function ProfileEventMatches({ event, username }: { event: PredictionHistory, username?: string }) {
  const [outcome, setOutcome] = useState<Outcome>('all')
  const { data, isPending, refetch } = useQuery(eventMatchesQueryOptions(event.id, username))

  if(isPending) {
    const rows = Math.min(event.score.correct + event.score.incorrect, PREVIEW_COUNT) || 1

    return (
      <div role="status" className="mt-2 rounded-xl border border-zinc-700 bg-secondary divide-y divide-zinc-700 overflow-hidden sg:bg-white sg:border-sg-sand sg:divide-sg-sand">
        <span className="sr-only">Učitavanje mečeva</span>
        {
          Array.from({ length: rows }, (_, i) => (
            <div key={i} className="h-13 px-3 flex items-center gap-3 motion-safe:animate-pulse">
              <div className="size-4 rounded-full bg-white/10 sg:bg-sg-sand" />
              <div className="h-4 flex-1 rounded bg-white/10 sg:bg-sg-sand" />
              <div className="h-4 w-10 rounded bg-white/10 sg:bg-sg-sand" />
            </div>
          ))
        }
      </div>
    )
  }

  if(!data)
    return <ProfileHistoryError message="Nismo uspeli da učitamo mečeve." onRetry={() => refetch()} />

  const { matches } = data
  const isLong = matches.length > PREVIEW_COUNT
  const filtered = matches.filter(match => matchesOutcome(match, outcome))
  const isGroupedByDay = (event.durationDays ?? 0) >= GROUP_BY_DAY_FROM

  return (
    <div className="slide-down">
      {isLong && <OutcomeFilter matches={matches} value={outcome} onChange={setOutcome} />}
      {
        filtered.length === 0 ?
          <p className="mt-2 px-3 py-4 rounded-xl border border-zinc-700 bg-secondary text-center text-slate-300 sg:bg-white sg:border-sg-sand sg:text-stone-600">
            {emptyMessage[outcome]}
          </p>
        : isGroupedByDay ?
          <ProfileMatchDays key={outcome} matches={matches} outcome={outcome} openAll={!isLong || outcome !== 'all'} />
        :
          <ProfileMatchList key={outcome} matches={filtered} previewCount={PREVIEW_COUNT} />
      }
    </div>
  )
}
