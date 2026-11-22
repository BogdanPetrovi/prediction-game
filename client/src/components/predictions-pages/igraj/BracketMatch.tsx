"use client"

import { memo, useState } from 'react'
import Image from 'next/image'
import { UpcomingMatch } from '@/types/UpcomingMatches'
import Prediction from '@/types/Prediction'
import MatchesPoints from '@/types/MatchesPoints'
import PredictedTeamEnum from '@/types/PredictedTeamEnum'
import { formatDateTime } from '@/utils/formatDate'
import { isOptimizedImage } from '@/utils/isOptimizedImage'

interface BracketMatchProps {
  match: UpcomingMatch,
  setPredictions: (prediction: Prediction) => void,
  backendPrediction: Prediction | undefined,
  matchesPoints?: MatchesPoints
}

interface TeamRowProps {
  team: 'team1' | 'team2',
  match: UpcomingMatch,
  selectedTeam: PredictedTeamEnum,
  points: number,
  onSelect: (team: PredictedTeamEnum) => void
}

const TeamRow = ({ team, match, selectedTeam, points, onSelect }: TeamRowProps) => {
  const { name, logo } = match[team]
  const isSelected = selectedTeam === team
  const isDimmed = !match.live && selectedTeam !== '' && !isSelected
  const showPoints = selectedTeam !== '' || match.live

  return (
    <button
      type="button"
      disabled={match.live}
      aria-pressed={isSelected}
      onClick={() => onSelect(team)}
      className={`${isSelected
          ? 'bg-gradient-to-r from-[#9333EA] to-[#667EEA] text-white sg:from-sg-red sg:to-sg-wine'
          : 'bg-white/[0.04] text-white enabled:hover:bg-white/10 sg:bg-white sg:text-sg-ink sg:enabled:hover:bg-sg-red/5'}
        ${isDimmed ? 'opacity-50 hover:opacity-80' : ''}
        w-full h-12 2xl:h-16 px-3 2xl:px-4 flex items-center gap-2.5 2xl:gap-3 text-left
        cursor-pointer disabled:cursor-not-allowed duration-300
        focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sg:focus-visible:outline-sg-ink`}
    >
      <span className={`${isSelected ? 'scale-110 shadow-md shadow-black/25' : isDimmed ? 'scale-80' : ''}
        size-9 2xl:size-12 shrink-0 p-1 rounded-lg bg-white flex items-center justify-center duration-300`}>
        {
          logo && !logo.startsWith('/') ?
            <Image
              src={logo}
              alt=""
              width={40}
              height={40}
              className="size-full object-contain"
              unoptimized={!isOptimizedImage(logo)}
            />
          :
            <span aria-hidden="true" className="text-xl 2xl:text-3xl leading-none font-bold text-secondary sg:text-sg-ink">?</span>
        }
      </span>
      <span title={name} className={`${isSelected ? 'font-bold' : 'font-semibold'} min-w-0 flex-1 truncate text-sm 2xl:text-lg`}>
        { name }
      </span>
      {
        showPoints &&
          <span
            className={`${isSelected ? 'bg-white/20' : 'bg-white/10 sg:bg-sg-red/10 sg:text-sg-crimson'}
              shrink-0 rounded-md px-1.5 py-0.5 text-xs 2xl:text-sm font-semibold`}
            title="Broj poena koji osvajas ako ova ekipa pobedi"
          >
            {points}pts
          </span>
      }
    </button>
  )
}

const BracketMatch = ({ match, setPredictions, backendPrediction, matchesPoints }: BracketMatchProps) => {
  const [selectedTeam, setSelectedTeam] = useState<PredictedTeamEnum>(backendPrediction?.predictedTeam || '')

  const handleSelect = (predictedTeam: PredictedTeamEnum) => {
    if(match.live) return

    setSelectedTeam(predictedTeam)
    setPredictions({ matchId: match.id, predictedTeam })
  }

  return (
    <div
      className={`${match.live ? 'opacity-60' : ''}
        w-[calc((100%-3*1.25rem)/4)] rounded-xl overflow-hidden bg-secondary ring-1 ring-white/10 shadow-lg shadow-black/40
        sg:bg-white sg:ring-2 sg:ring-sg-red sg:shadow-sg-red/15`}
    >
      <div className="h-7 2xl:h-8 px-3 2xl:px-4 flex items-center justify-between text-xs 2xl:text-sm font-semibold text-white/75 sg:bg-sg-sand sg:text-sg-ink/80">
        {
          match.live ?
            <span className="text-red-400 sg:text-sg-red animate-pulse">Live</span>
          :
            <span>{ formatDateTime(match.date) }</span>
        }
        <span className="capitalize">{ match.format }</span>
      </div>
      <TeamRow team="team1" match={match} selectedTeam={selectedTeam} points={matchesPoints?.team1 || 100} onSelect={handleSelect} />
      <div aria-hidden="true" className="h-px bg-[#9333EA]/60 sg:bg-sg-red" />
      <TeamRow team="team2" match={match} selectedTeam={selectedTeam} points={matchesPoints?.team2 || 100} onSelect={handleSelect} />
    </div>
  )
}

export default memo(BracketMatch)
