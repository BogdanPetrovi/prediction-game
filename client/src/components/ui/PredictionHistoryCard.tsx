import RecentPredictions from "@/types/RecentPredictions"
import React from "react"

const PredictionHistoryCard:React.FC<RecentPredictions> = ({ predictedWinner, result, team1, team2, winnerTeam }) => {
  return (
    <div 
      className={`${
        result ? predictedWinner === winnerTeam ? "border-green-500/30" : "border-red-500/30" : "border-white/20"
      } w-5/12 h-[4.5rem] bg-secondary flex items-center justify-between px-3 rounded-2xl border-2`}>
      {/* team1 */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        {
          predictedWinner === 'team1' &&
          <div className="size-4 rounded-full bg-white/50" title="Your guess"></div>
        }
        {team1.logo && !team1.logo.startsWith('/') ? 
          <img src={team1.logo} className="size-12" />
          :
          <h2 className="text-[3rem]">?</h2>
        }
        <h3>{team1.name}</h3>
      </div>

      {/* result for finished or "vs" for upcoming */}
      {
        result ? 
        <h3 className="text-4xl font-bold text-white">{result}</h3>
        :
        <h4 className="text-2xl font-bold text-white/30">VS</h4>
      }

      {/* team2 */}
      <div className="flex items-center gap-2 text-2xl font-bold">
        <h3>{team2.name}</h3>
        {team2.logo && !team2.logo.startsWith('/') ? 
          <img src={team2.logo} className="size-12" />
          :
          <h2 className="text-[3rem]">?</h2>
        }
        {
          predictedWinner === 'team2' &&
          <div className="size-4 rounded-full bg-white/50" title="Your guess"></div>
        }
      </div>
    </div>
  )
}

export default PredictionHistoryCard