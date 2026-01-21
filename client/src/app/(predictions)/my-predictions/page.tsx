"use client"

import Loading from "@/components/shared/Loading"
import PredictionHistoryCard from "@/components/ui/PredictionHistoryCard"
import backend from "@/services/api/backend"
import { useQuery } from "@tanstack/react-query"
import RecentPredictions from "@/types/RecentPredictions"

const MyPredictionsPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ['recent-predictions'],
    queryFn: async (): Promise<RecentPredictions[]> => {
      const result = await backend.get("/recent-predictions")

      return result.data
    }
  })

  if (isPending) return <Loading />

  if (!data || data.length === 0) {
    return (
      <div className="px-6 py-4 text-gray-300 text-3xl">
        There is no recent predictions.
      </div>
    )
  }

  return (
    <div className="w-11/12 min-h-[calc(100vh-9.5rem)] mx-auto flex flex-col items-center select-none pb-10">
      <h2 className="text-4xl font-bold">Your recent predictions</h2>
      <div className="w-full mt-5 flex justify-center gap-10 flex-wrap">
        {
          data.map(prediction => (
            <PredictionHistoryCard 
              id={prediction.id}
              team1={prediction.team1}
              team2={prediction.team2}
              predictedWinner={prediction.predictedWinner}
              winnerTeam={prediction.winnerTeam}
              result={prediction.result}
              key={prediction.id} />
          ))
        }
      </div>
    </div>
  )
}

export default MyPredictionsPage