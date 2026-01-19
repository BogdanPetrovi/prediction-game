"use client"

import { format } from 'date-fns'
import Match from '../types/Match'
import React, { useState, memo } from 'react'
import Prediction from '@/types/Prediction'
import Team1 from './ui/Team1'
import Team2 from './ui/Team2'

interface MatchupProps {
  match: Match,
  setPredictions: (prediction: Prediction) => void,
  backendPrediction: Prediction | undefined
}

const Matchup: React.FC<MatchupProps> = ({ match, setPredictions, backendPrediction }) => {
  const [selectedTeam, setSelectedTeam] = useState(backendPrediction?.predictedTeam || '')

  const formatedDate = (): string => {
    const date = match.date && format(new Date(match.date), 'dd.MM HH:mm');
    return date || ''
  }

  const handleChange = (predictedTeam: string) => {
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
      />

      <Team2
        selectedTeam={selectedTeam}
        handleChange={handleChange}
        match={match}
      />

      {/* Displays date or live */}
      <div className='absolute left-2 -bottom-7'>
        {
          match.live ? 
            <h3 className='font-semibold text-xl text-red-600 animate-pulse'>Live</h3>
          :
            <h3 className='font-semibold text-xl'>{ formatedDate() }</h3>
        }
      </div>

      {/* Displays match format */}
      <div className='absolute right-2 -bottom-7'>
        <h3 className='font-semibold text-xl capitalize'>{ match.format }</h3>
      </div>
    </div>
  )
}

export default memo(Matchup)