import React from "react";
import { Placements } from "@/types/EventHistory"

interface HistoryCardProps {
  eventName: string;
  placements: Placements;
  logo: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ eventName, logo, placements }) => { 
  return (
    <div 
      className="shaow-xl/60d shadow-black h-full w-1/6 rounded-lg flex flex-col items-center"
    >
      <div className="bg-white/30 rounded-t-lg px-1">
        <img src={ logo } className="size-28 mt-4 mx-auto" />
        <h2 className="text-4xl font-bold text-center mt-2 mb-5">{ eventName }</h2>
      </div>
      <div className="flex flex-col w-full h-full text-primary">
        <h3 className="bg-gradient-to-r from-yellow-400 to-yellow-500 animate-gradient-bg text-white text-5xl font-bold text-center py-7">🏆 <br /> { placements.firstPlace }</h3>
        <h3 className="bg-[#C0C0C0] text-4xl font-bold text-center py-7">🥈 { placements.secondPlace }</h3>
        <h3 className="bg-[#b08d57] text-4xl font-bold text-center py-7 rounded-b-lg">🥉 { placements.thirdPlace } </h3>
      </div>
    </div>
  )
}

export default HistoryCard