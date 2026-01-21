import Match from "@/types/Match"
import React from "react"

interface Team1Props {
  selectedTeam: string,
  match: Match,
  handleChange: (team: string) => void
}

const Team1: React.FC<Team1Props> = ({ selectedTeam, handleChange, match }) => {
  return (
    <div 
      className={
        `${selectedTeam === 'team2' && "opacity-50 hover:opacity-80 "} 
        group flex items-center gap-3 relative w-1/2 h-full duration-300`}
      onClick={() => handleChange('team1')}
    >
      {
        match.team1.logo && !match.team1.logo.startsWith('/') ? 
        <img src={ match.team1.logo } className={`${selectedTeam === 'team1' ? 'size-[4.5rem]' : !match.live && 'group-hover:size-[4.5rem]'} size-16 ml-4 drop-shadow-xl/50 duration-300`} />
        :
        <h2 className={`${selectedTeam === 'team1' ? 'text-[4.5rem]' : !match.live && 'group-hover:text-[4.5rem]'} text-[4rem] font-bold ml-4 drop-shadow-xl/50 duration-300`}>?</h2>
      }
      <h2 className="hidden md:block text-3xl xl:text-4xl font-semibold">{ match.team1.name }</h2>
    </div>
  )
}

export default Team1