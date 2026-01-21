import React from "react";
import { Placements } from "@/types/EventHistory"

interface HistoryCardProps {
  eventName: string;
  placements: Placements;
  logo: string;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ eventName, logo, placements }) => { 
  return (
    <div className="w-full h-32 bg-secondary rounded-3xl flex">
      <div className="w-1/3 h-full rounded-l-3xl flex items-center justify-start pl-3 gap-5">
        <img src={logo} alt={eventName} className="size-24" />
        <h3 className="font-bold text-3xl">{eventName}</h3>
      </div>
      <div className="w-2/3 h-full rounded-r-3xl bg-black/80 flex">
        <div className="w-1/3 h-full text-4xl font-bold flex flex-col justify-center items-center bg-gradient-to-r from-yellow-400 to-yellow-500 animate-gradient-bg text-white">
          <h3>🏆</h3>
          <h2 className="drop-shadow-xl/70 drop-shadow-black">{placements.firstPlace}</h2>
        </div>
        <div className="w-1/3 h-full text-4xl font-bold flex flex-col justify-center items-center bg-[#C0C0C0]">
          <h3>🥈</h3>
          <h2 className="drop-shadow-xl/70 drop-shadow-black">{placements.secondPlace}</h2>
        </div>
        <div className="w-1/3 h-full text-4xl font-bold flex flex-col justify-center items-center bg-[#b08d57] rounded-r-3xl">
          <h3>🥉</h3>
          <h2 className="drop-shadow-xl/70 drop-shadow-black">{placements.thirdPlace}</h2>
        </div>
      </div>
    </div>
  )
}

export default HistoryCard