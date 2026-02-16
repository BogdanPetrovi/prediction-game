import RecentPredictions from "@/types/RecentPredictions"
import React from "react"

const PredictionHistoryCard:React.FC<RecentPredictions> = ({ predictedWinner, result, team1, team2, winnerTeam }) => {
  return (
    <div 
      className={`${
        result ? predictedWinner === winnerTeam ? "border-green-500/30" : "border-red-500/30" : "border-white/20"
      } w-full xl:w-5/12 h-[4.5rem] bg-secondary flex items-center justify-between px-1 rounded-2xl border-2`}>
      {/* team1 */}
      <div className="flex w-1/3 items-center gap-0 md:gap-2 text-xl md:text-2xl font-bold">
        {
          predictedWinner === 'team1' &&
          <div className="size-4 rounded-full bg-white/50" title="Tvoja predikcija"></div>
        }
        {team1.logo && !team1.logo.startsWith('/') ? 
          <img src={team1.logo} className="size-12" />
          :
          <h2 className="text-[3rem]">?</h2>
        }
        <h3 className="w-min md:w-fit ml-1">{team1.name.length > 9 ? `${team1.name.slice(0, 8)}.` : team1.name}</h3>
      </div>

      {/* result for finished or "vs" for upcoming */}
      {
        result ? 
        <div className="w-1/3 flex justify-center text-xl xl:text-4xl font-bold text-white">
          { result }
        </div>
        :
        <div className=" w-1/3 flex justify-center text-xl xl:text-2xl font-bold text-white/30">VS</div>
      }

      {/* team2 */}
      <div className="w-1/3 flex items-center justify-end gap-0 md:gap-2 text-xl md:text-2xl font-bold">
        <h3 className="w-min md:w-fit mr-1">{team2.name.length > 9 ? `${team2.name.slice(0, 8)}.` : team2.name}</h3>
        {team2.logo && !team2.logo.startsWith('/') ? 
          <img src={team2.logo} className="size-12" />
          :
          <h2 className="text-[3rem]">?</h2>
        }
        {
          predictedWinner === 'team2' &&
          <div className="size-4 rounded-full bg-white/50" title="Tvoja predikcija"></div>
        }
      </div>
    </div>
  )
}

export default PredictionHistoryCard