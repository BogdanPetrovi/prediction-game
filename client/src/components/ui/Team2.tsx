import Match from "@/types/Match"
import React from "react"

interface Team2Props {
  selectedTeam: string,
  match: Match,
  handleChange: (teamName: string) => void
}

const Team2: React.FC<Team2Props> = ({ selectedTeam, handleChange, match }) => {
  return (
    <div 
      className={
        `${selectedTeam === match.team1.name ? "w-1/2  " 
          : selectedTeam === match.team2.name ? "w-[63%] " 
          : "w-1/2 "}
          group absolute flex flex-row-reverse items-center justify-start gap-3 bg-gradient-to-l from-[#F39C12] to-[#FFA500] top-0 right-0 rounded-r-xl h-full duration-300`}
      style={{
        clipPath: selectedTeam === match.team1.name ? `polygon(14% 0, 100% 0, 100% 100%, 10% 100%)` 
                : selectedTeam === match.team2.name ? `polygon(10% 0, 100% 0, 100% 100%, 14% 100%)` : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      }}
      onClick={() => handleChange(match.team2.name)}
    >
      {
        !match.team2.logo.startsWith('/') ?
        <img 
          src={ match.team2.logo } 
          className={
            `${selectedTeam === match.team2.name ? 'size-[4.5rem]' 
              : selectedTeam === match.team1.name ? 'group-hover:size-[4.5rem] opacity-50 group-hover:opacity-80'
              : !match.live && 'group-hover:size-[4.5rem]'} size-16 mr-4 drop-shadow-xl/50 duration-300`
            } 
          />
        :
        <h2 className={
            `${selectedTeam === match.team2.name ? 'text-[4.5rem]' 
              : selectedTeam === match.team1.name ? 'group-hover:text-[4.5rem] opacity-50 group-hover:opacity-80'
              : !match.live && 'group-hover:text-[4.5rem]'} text-[4rem] font-bold mr-4 drop-shadow-xl/50 duration-300`
            }>?</h2>
      }
      <h2 
        className={`${ selectedTeam === match.team1.name ? 'opacity-50 group-hover:opacity-80 ' : '' } hidden md:block text-3xl lg:text-4xl text-[#f9fafd] font-semibold ml-4 lg:ml-0 duration-300`}
      >
        { match.team2.name }
      </h2>
    </div>
  )
}

export default Team2