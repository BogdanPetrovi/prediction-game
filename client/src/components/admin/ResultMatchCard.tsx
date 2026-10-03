'use client'

import MatchWithoutResult from "@/types/MatchWithoutResult"
import { formatDateTime } from "@/utils/formatDate"
import { useState } from "react"
import ResultScoreInput from "./ResultScoreInput"
import ResultTeam from "./ResultTeam"

interface ResultMatchCardProps {
  match: MatchWithoutResult,
  isPending: boolean,
  onSave: (team1Score: number, team2Score: number) => void
}

export default function ResultMatchCard({ match, isPending, onSave }: ResultMatchCardProps) {
  const [team1Score, setTeam1Score] = useState('')
  const [team2Score, setTeam2Score] = useState('')

  // draws are rejected by the backend
  const isDisabled = isPending || team1Score === '' || team2Score === '' || Number(team1Score) === Number(team2Score)

  const handleClick = () => {
    if(isDisabled) return

    onSave(Number(team1Score), Number(team2Score))
  }

  return (
    <div className="w-full max-w-[780px] bg-secondary rounded-xl border p-4 flex flex-col gap-3">
      <h4 className="text-sm">
        ID: { match.id } · <span className="uppercase">{ match.format }</span>{ match.date && ` · ${formatDateTime(match.date)}` }
      </h4>
      <div className="flex items-center gap-3">
        <ResultTeam team={match.team1} />
        <ResultScoreInput value={team1Score} setValue={setTeam1Score} />
        <span className="text-xl font-bold">:</span>
        <ResultScoreInput value={team2Score} setValue={setTeam2Score} />
        <ResultTeam team={match.team2} isReversed />
      </div>
      <button
        className={`${isDisabled ? 'cursor-not-allowed brightness-75' : 'cursor-pointer hover:bg-white/10 active:bg-white/15'}
          w-full h-10 bg-white/5 rounded-lg border font-semibold duration-300
        `}
        onClick={handleClick}
        disabled={isDisabled}
      >
        Sačuvaj rezultat
      </button>
    </div>
  )
}
