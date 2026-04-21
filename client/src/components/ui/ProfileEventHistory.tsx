"use client"

import Image from "next/image";
import ProfileHistoryMatch from "./ProfileHistoryMatch";
import PredictionHistory from "@/types/PredictionHistory";
import { formatDateWithoutYear } from "@/utils/formatDate";
import { useState } from "react";

export default function ProfileEventHistory({ data }: {data: PredictionHistory}) {
  const [showAll, setShowAll] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between gap-2 mt">
        <div className="flex gap-2">
          <div className="relative size-7">
            <Image 
              src={data.logo}
              alt="Logo turnira"
              fill
              unoptimized
            />
          </div>
          <h3 className="text-lg font-semibold tracking-wider">{ data.name }</h3>
        </div>
        <h3 className="font-semibold text-muted ">
          <span className="text-green-400 pr-1.5">{ data.score.correct }</span>
          -
          <span className="text-red-400 pl-1.5">{ data.score.incorrect }</span>
        </h3>
      </div>
      <h4 className="ml-9 -mt-1 text-muted text-xs">{ formatDateWithoutYear(Number(data.start_date)) } - { formatDateWithoutYear(Number(data.end_date)) }</h4>

      <div className="bg-secondary rounded-xl border border-zinc-700 overflow-hidden mt-2 slide-down">
        {
          showAll ?
          data.allMatches.map(match => (
            <ProfileHistoryMatch data={match} key={match.id} />
          ))
          :
          data.recentMatches.map(match => (
            <ProfileHistoryMatch data={match} key={match.id} />
          ))
        }
        {
          (data.recentMatches.length > 9 && !showAll) 
          ?
          <div 
            className="h-8 w-full bg-secondary flex justify-center items-center font-semibold hover:brightness-120 active:brightness-150 duration-300 cursor-pointer"
            onClick={() => setShowAll(true)}
          >
            Prikaži sve
          </div>
          :
          (data.recentMatches.length > 9 && showAll) && 
          <div 
            className="h-8 w-full bg-secondary flex justify-center items-center font-semibold hover:brightness-120 active:brightness-150 duration-300 cursor-pointer"
            onClick={() => setShowAll(false)}
          >
            Prikaži manje
          </div>
        }
      </div>
    </>
  )
}