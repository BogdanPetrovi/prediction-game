import Match from "@/types/UpcomingMatch"
import React from "react"
import WinPercent from "./WinPrecent"
import PredictedTeamEnum from "@/types/PredictedTeamEnum"

interface Team1Props {
  selectedTeam: PredictedTeamEnum,
  match: Match,
  handleChange: (team: PredictedTeamEnum) => void,
  votePrecentage?: number
}

const Team1: React.FC<Team1Props> = ({ selectedTeam, handleChange, match, votePrecentage }) => {
  return (
    <div 
      className={
        `${!match.live && selectedTeam === 'team2' && "opacity-50 hover:opacity-80 "} 
        group flex items-center gap-3 relative w-1/2 h-full duration-300`}
      onClick={() => handleChange('team1')}
    >
      {
        match.team1.logo && !match.team1.logo.startsWith('/') ? 
        <img src={ match.team1.logo } className={`${selectedTeam === 'team1' ? 'size-[4.5rem]' : !match.live && 'group-hover:size-[4.5rem]'} size-16 ml-4 drop-shadow-xl/50 duration-300`} />
        :
        <h2 className={`${selectedTeam === 'team1' ? 'text-[4.5rem]' : !match.live && 'group-hover:text-[4.5rem]'} text-[4rem] font-bold ml-4 drop-shadow-xl/50 duration-300`}>?</h2>
      }
      <h2 className="hidden md:block text-3xl xl:text-4xl font-semibold w-min 2xl:w-fit">{ match.team1.name }</h2>
      <WinPercent value={votePrecentage || 0} team="team1" selected={ selectedTeam } isLive={ match.live } />
    </div>
  )
}

export default Team1