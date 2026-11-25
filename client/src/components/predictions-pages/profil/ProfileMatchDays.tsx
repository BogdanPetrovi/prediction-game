"use client"

import { useId, useState } from "react"
import { FinishedMatch } from "@/types/PredictionHistory"
import { formatDay } from "@/utils/formatDate"
import { groupMatchesByDay } from "@/utils/matchDays"
import { pluralize } from "@/utils/pluralize"
import { matchesOutcome, Outcome } from "./OutcomeFilter"
import PendingIcon from "./PendingIcon"
import ProfileHistoryMatch from "./ProfileHistoryMatch"

interface ProfileMatchDaysProps {
  matches: FinishedMatch[],
  outcome: Outcome,
  openAll: boolean
}

export default function ProfileMatchDays({ matches, outcome, openAll }: ProfileMatchDaysProps) {
  const days = groupMatchesByDay(matches)
    .map(day => ({ ...day, visible: day.matches.filter(match => matchesOutcome(match, outcome)) }))
    .filter(day => day.visible.length > 0)

  const allKeys = days.map(day => day.key)

  const [openDays, setOpenDays] = useState<string[]>(openAll ? allKeys : allKeys.slice(0, 1))
  const id = useId()

  const isAllOpen = allKeys.every(key => openDays.includes(key))
  const visibleCount = days.reduce((count, day) => count + day.visible.length, 0)

  const toggle = (key: string) =>
    setOpenDays(prev => prev.includes(key) ? prev.filter(openKey => openKey !== key) : [...prev, key])

  return (
    <>
      <div className="min-h-11 flex items-center justify-between gap-2">
        <p aria-live="polite" className="pl-1 text-xs text-slate-400 tabular-nums sg:text-stone-500">
          {pluralize(visibleCount, 'meč', 'meča', 'mečeva')}, {pluralize(days.length, 'dan', 'dana', 'dana')}
        </p>
        {
          days.length > 1 &&
            <button
              type="button"
              onClick={() => setOpenDays(isAllOpen ? [] : allKeys)}
              className="min-h-11 px-2 rounded-md text-sm font-semibold cursor-pointer text-orange-400 hover:text-orange-300 duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                         sg:text-sg-crimson sg:hover:text-sg-wine sg:focus-visible:ring-sg-red"
            >
              {isAllOpen ? 'Zatvori sve' : 'Otvori sve'}
            </button>
        }
      </div>

      <div className="bg-secondary rounded-xl border border-zinc-700 divide-y divide-zinc-700 overflow-hidden sg:bg-white sg:border-sg-sand sg:divide-sg-sand sg:shadow-sm">
        {
          days.map(day => {
            const isOpen = openDays.includes(day.key)
            const listId = `${id}-${day.key}`
            const pointsLabel = day.points === null ? 'čeka obračun poena' : pluralize(day.points, 'poen', 'poena', 'poena')

            return (
              <section key={day.key}>
                <h4>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={listId}
                    aria-label={`${formatDay(day.date)}, pogođenih ${day.correct}, promašenih ${day.incorrect}, ${pointsLabel}`}
                    onClick={() => toggle(day.key)}
                    className={`${isOpen ? 'bg-white/[0.06] sg:bg-sg-sand/50' : ''}
                      w-full min-h-12 px-3 flex items-center gap-2 text-left cursor-pointer hover:bg-white/10 duration-200
                      focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-500
                      sg:hover:bg-sg-sand/70 sg:focus-visible:outline-sg-red`}
                  >
                    <svg className={`${isOpen ? 'rotate-90' : ''} size-4 shrink-0 text-slate-400 duration-200 motion-reduce:transition-none sg:text-stone-500`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <span className="min-w-0 flex-1 truncate font-semibold first-letter:uppercase">{formatDay(day.date)}</span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      <span className="text-green-400 sg:text-green-700">{day.correct}</span>
                      <span className="px-1 text-slate-400 sg:text-stone-500">-</span>
                      <span className="text-red-400 sg:text-red-600">{day.incorrect}</span>
                    </span>
                    <span title={day.points === null ? 'Čeka obračun poena' : undefined} className="shrink-0 min-w-18 flex justify-end text-sm font-semibold text-slate-300 tabular-nums sg:text-stone-600">
                      {day.points === null ? <PendingIcon /> : `+${day.points}pts`}
                    </span>
                  </button>
                </h4>
                <ul id={listId} hidden={!isOpen} className="border-t border-zinc-700 divide-y divide-zinc-700 sg:border-sg-sand sg:divide-sg-sand">
                  {isOpen && day.visible.map(match => <ProfileHistoryMatch data={match} key={match.id} />)}
                </ul>
              </section>
            )
          })
        }
      </div>
    </>
  )
}
