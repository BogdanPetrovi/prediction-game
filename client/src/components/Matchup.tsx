"use client"

import UpcomingMatch from '../types/UpcomingMatch'
import React, { useState, memo } from 'react'
import Prediction from '@/types/Prediction'
import Team1 from './ui/Team1'
import Team2 from './ui/Team2'
import MatchesPoints from '@/types/MatchesPoints'
import PredictedTeamEnum from '@/types/PredictedTeamEnum'
import { formatDateTime } from '@/utils/formatDate'

interface MatchupProps {
  match: UpcomingMatch,
  setPredictions: (prediction: Prediction) => void,
  backendPrediction: Prediction | undefined,
  matchesPoints?: MatchesPoints
}

const Matchup: React.FC<MatchupProps> = ({ match, setPredictions, backendPrediction, matchesPoints }) => {
  const [selectedTeam, setSelectedTeam] = useState<PredictedTeamEnum>(backendPrediction?.predictedTeam || '')

  const formatedDate = formatDateTime(match.date)

  const handleChange = (predictedTeam: PredictedTeamEnum) => {
    if(match.live) return

    setSelectedTeam(predictedTeam)
    setPredictions({ matchId: match.id, predictedTeam })
  }

  return (
    <div 
      className={`${match.live ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} 
                  relative w-full h-20 bg-gradient-to-l from-30% from-[#667EEA] to-[#9333EA] rounded-xl flex items-center`}>
      <Team1
        selectedTeam={selectedTeam}
        handleChange={handleChange}
        match={match}
        matchPoints={matchesPoints?.team1 || 100}
      />

      <Team2
        selectedTeam={selectedTeam}
        handleChange={handleChange}
        match={match}
        matchPoints={matchesPoints?.team2 || 100}
      />
      
      
      {/* grid grid-cols-3 */}
      <div className='absolute left-2 -bottom-7  w-full pr-4 flex justify-between'>
        {/* Displays date or live */}
        <div className='justify-self-start'>
          {
            match.live ? 
              <h3 className='font-semibold text-xl text-red-600 animate-pulse'>Live</h3>
            :
              <h3 className='font-semibold text-xl'>{ formatedDate }</h3>
          }
        </div>

        {/* Displays match format */}
        <div className='justify-self-end'>
          <h3 className='font-semibold text-xl capitalize'>{ match.format }</h3>
        </div>

      </div>
    </div>
  )
}

export default memo(Matchup)