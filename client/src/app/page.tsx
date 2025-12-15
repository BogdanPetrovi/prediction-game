'use client'

import matchesExampleArray from "@/utils/matchesExampleArray";
import Matchup from "../components/Matchup"
import { useCallback, useEffect, useState } from "react";
import Prediction from "@/types/prediction";
import backend from "@/services/api/backend";
import Match from "@/types/match";

export default function Home() {
  const [userPredictions, setUserPredictions] = useState<Array<Prediction>>([])
  const [matches, setMatches]= useState<Match[]>([])

  const handleUserPredictionChange = useCallback(({ matchId, predictedTeam }: Prediction) => {
    setUserPredictions(prev => {
      const arrayWithoutMatchId = prev.filter(p => p.matchId !== matchId)

      return arrayWithoutMatchId.concat([{ matchId, predictedTeam }])
    })
  }, [])
  
  const handleSubmit = async () => {
    return console.log(userPredictions)
  }

  useEffect(() => {
    const fetchMatches = async () => {
      const result = await backend.get('/matches')

      setMatches(result.data)
    }

    fetchMatches()
  }, [setMatches])

  return (
    <div className="w-3/5 mx-auto min-h-[calc(100vh-9.5rem)] flex flex-col items-center gap-10 pb-10 select-none">
      {
        matches.map(match => (
          <Matchup
            match={match}
            setPredictions={handleUserPredictionChange}
            key={match.id}
          />
        ))
      }
      <button className="bg-secondary hover:bg-[#2F333F] active:bg-[#3a3e4a] w-1/3 hover:w-2/5 h-16 rounded-3xl cursor-pointer font-bold text-4xl drop-shadow-2xl/100 duration-300" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
