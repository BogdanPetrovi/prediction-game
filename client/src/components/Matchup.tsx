"use client"

import Match from '../types/Match'
import React, { useState, memo } from 'react'
import Prediction from '@/types/Prediction'
import Team1 from './ui/Team1'
import Team2 from './ui/Team2'
import VotesPrecentages from '@/types/VotesPrecentages'
import PredictedTeamEnum from '@/types/PredictedTeamEnum'

interface MatchupProps {
  match: Match,
  setPredictions: (prediction: Prediction) => void,
  backendPrediction: Prediction | undefined,
  votesPrecentages?: VotesPrecentages
}

const Matchup: React.FC<MatchupProps> = ({ match, setPredictions, backendPrediction, votesPrecentages }) => {
  const [selectedTeam, setSelectedTeam] = useState<PredictedTeamEnum>(backendPrediction?.predictedTeam || '')

  const formatedDate = (): string => {
    const date = match.date && new Intl.DateTimeFormat('sr-RS', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: false
                                    }).format(match.date);
    return date || ''
  }

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
        votePrecentage={votesPrecentages?.team1 === 0 && votesPrecentages?.team2 === 0 ? selectedTeam === 'team1' ? 100 : 0 : votesPrecentages?.team1}
      />

      <Team2
        selectedTeam={selectedTeam}
        handleChange={handleChange}
        match={match}
        votePrecentage={votesPrecentages?.team1 === 0 && votesPrecentages?.team2 === 0 ? selectedTeam === 'team2' ? 100 : 0 : votesPrecentages?.team2}
      />
      
      
      {/* grid grid-cols-3 */}
      <div className='absolute left-2 -bottom-7  w-full pr-4 flex justify-between'>
        {/* Displays date or live */}
        <div className='justify-self-start'>
          {
            match.live ? 
              <h3 className='font-semibold text-xl text-red-600 animate-pulse'>Live</h3>
            :
              <h3 className='font-semibold text-xl'>{ formatedDate() }</h3>
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