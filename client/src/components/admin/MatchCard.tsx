import { MatchWithGuesses } from "@/types/AdminMatches"
import React, { Dispatch, SetStateAction } from "react"

interface MatchCardProps {
  match: MatchWithGuesses,
  setChosenMatch: Dispatch<SetStateAction<MatchWithGuesses | null>>
}

const MatchCard: React.FC<MatchCardProps> = ({ match, setChosenMatch }) => {
  return (
    <div className="h-[calc(100%-1rem)] min-w-40 p-3 bg-sky-900/30 text-2xl font-semibold flex flex-col justify-center items-center cursor-pointer shrink-0" 
      onClick={() => setChosenMatch(match)}>
      <h3>{match.team1.name}</h3>
      <h3>VS</h3>
      <h3>{match.team2.name}</h3>
    </div>
  )
}

export default MatchCard