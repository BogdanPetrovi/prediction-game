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
        `${selectedTeam === 'team1' ? "w-1/2  " 
          : selectedTeam === 'team2' ? "w-[63%] " 
          : "w-1/2 "}
          group absolute flex flex-row-reverse items-center justify-start gap-3 bg-gradient-to-l from-[#F39C12] to-[#FFA500] top-0 right-0 rounded-r-xl h-full duration-300`}
      style={{
        clipPath: selectedTeam === 'team1' ? `polygon(14% 0, 100% 0, 100% 100%, 10% 100%)` 
                : selectedTeam === 'team2' ? `polygon(10% 0, 100% 0, 100% 100%, 14% 100%)` : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      }}
      onClick={() => handleChange('team2')}
    >
      {
        match.team1.logo && !match.team2.logo.startsWith('/') ?
        <img 
          src={ match.team2.logo } 
          className={
            `${selectedTeam === 'team2' ? 'size-[4.5rem]' 
              : selectedTeam === 'team1' ? 'group-hover:size-[4.5rem] opacity-50 group-hover:opacity-80'
              : !match.live && 'group-hover:size-[4.5rem]'} size-16 mr-4 drop-shadow-xl/50 duration-300`
            } 
          />
        :
        <h2 className={
            `${selectedTeam === 'team2' ? 'text-[4.5rem]' 
              : selectedTeam === 'team1' ? 'group-hover:text-[4.5rem] opacity-50 group-hover:opacity-80'
              : !match.live && 'group-hover:text-[4.5rem]'} text-[4rem] font-bold mr-4 drop-shadow-xl/50 duration-300`
            }>?</h2>
      }
      <h2 
        className={`${ selectedTeam === 'team1' ? 'opacity-50 group-hover:opacity-80 ' : '' } hidden md:block text-end text-3xl xl:text-4xl text-[#f9fafd] font-semibold ml-4 lg:ml-0 duration-300`}
      >
        { match.team2.name }
      </h2>
    </div>
  )
}

export default Team2