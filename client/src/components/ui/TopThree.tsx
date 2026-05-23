"use client"

import leaderboardQueryOptions from "@/utils/leaderboardQueryOptions";
import { useQuery } from "@tanstack/react-query";
import Error from "../shared/Error";

export default function TopThree() {
  const { data, isPending, error } = useQuery(leaderboardQueryOptions(1));

  if(isPending) return <></>

  if(error) return <></>

  return (
  <div className="w-full flex flex-col md:flex-none md:grid md:grid-cols-3 gap-3 mb-4 md:mb-0 cursor-default">
    <div className="bg-slate-300/20 brightness-90 flex flex-col justify-center items-center h-30 rounded-lg border border-slate-300 hover:-translate-y-2 duration-200">
      <h3 className="text-2xl">🥈</h3>
      <h3 className="font-bold text-xl text-slate-300">{data.leaderboard[1].username}</h3>
      <h4 className="text-slate-300 text-lg">{data.leaderboard[1].points}pts</h4>
    </div>
    <div className="bg-amber-400/20 brightness-125 flex flex-col justify-center items-center h-35 rounded-lg border border-amber-500 md:-translate-y-3 hover:-translate-y-5 duration-200">
      <h3 className="text-2xl">🏆</h3>
      <h3 className="font-bold text-xl text-amber-500">{data.leaderboard[0].username}</h3>
      <h4 className="text-amber-500 text-lg">{data.leaderboard[0].points}pts</h4>
    </div>
    <div className="bg-amber-700/20 flex flex-col justify-center items-center h-30 rounded-lg border border-amber-600 hover:-translate-y-2 duration-200">
      <h3 className="text-2xl">🥉</h3>
      <h3 className="font-bold text-xl text-amber-700">{data.leaderboard[2].username}</h3>
      <h4 className="text-amber-700 text-lg">{data.leaderboard[2].points}pts</h4>
    </div>
  </div>
  )
}