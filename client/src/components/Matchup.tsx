"use client"

import { format } from 'date-fns'
import Match from '../types/match'
import React, { useState, memo } from 'react'
import Prediction from '@/types/prediction'

interface MatchupProps {
  match: Match,
  setPredictions: (prediction: Prediction) => void,
}

const Matchup: React.FC<MatchupProps> = ({ match, setPredictions }) => {
  const [active, setActive] = useState('')

  const formatedDate = (): string => {
    const date = match.date && format(new Date(match.date), 'dd.MM HH:mm');
    return date || ''
  }

  const handleChange = (predictedTeam: string) => {
    if(match.live) return

    setActive(predictedTeam)
    setPredictions({ matchId: match.id, predictedTeam })
  }

  return (
    <div 
      className={`${match.live ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} 
                  relative w-full h-20 bg-gradient-to-l from-30% from-[#667EEA] to-[#9333EA] rounded-xl flex items-center`}>
      {/* Team 1 */}
      <div 
        className={
          `${active === match.team2.name && "opacity-50 hover:opacity-80 "} 
          group flex items-center gap-3 relative w-1/2 h-full duration-300`}
        onClick={() => handleChange(match.team1.name)}
      >
        <img src={ match.team1.logo } className={`${active === match.team1.name ? 'size-[4.5rem]' : !match.live && 'size-16 group-hover:size-[4.5rem]'} ml-4 drop-shadow-xl/50 duration-300`} />
        <h2 className="hidden md:block text-3xl lg:text-4xl font-semibold">{ match.team1.name }</h2>
      </div>

      {/* Team 2 */}
      <div 
        className={
          `${active === match.team1.name ? "w-1/2  " 
            : active === match.team2.name ? "w-[63%] " 
            : "w-1/2 "}
           group absolute flex flex-row-reverse items-center justify-start gap-3 bg-gradient-to-l from-[#F39C12] to-[#FFA500] top-0 right-0 rounded-r-xl h-full duration-300`}
        style={{
          clipPath: active === match.team1.name ? `polygon(14% 0, 100% 0, 100% 100%, 10% 100%)` 
                  : active === match.team2.name ? `polygon(10% 0, 100% 0, 100% 100%, 14% 100%)` : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
        }}
        onClick={() => handleChange(match.team2.name)}
      >
        <img 
          src={ match.team2.logo } 
          className={
            `${active === match.team2.name ? 'size-[4.5rem]' 
              : active === match.team1.name ? 'size-16 group-hover:size-[4.5rem] opacity-50 group-hover:opacity-80'
              : !match.live && 'size-16 group-hover:size-[4.5rem]'} mr-4 drop-shadow-xl/50 duration-300`
            } 
          />
        <h2 
          className={`${ active === match.team1.name ? 'opacity-50 group-hover:opacity-80 ' : '' } hidden md:block text-3xl lg:text-4xl text-[#f9fafd] font-semibold ml-4 lg:ml-0 duration-300`}
        >
          { match.team2.name }
        </h2>
      </div>

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