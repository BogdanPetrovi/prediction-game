'use client'

import Matchup from "@/components/predictions-pages/igraj/Matchup"
import { useCallback, useEffect, useState } from "react";
import type Prediction from "@/types/Prediction";
import backend from "@/services/api/backend";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/shared/Loading";
import dynamic from "next/dynamic";
import Error from "@/components/shared/Error";
import MatchesPoints from "@/types/MatchesPoints";
import UpcomingMatchesApiResponse, { NoMatches, UpcomingMatch } from "@/types/UpcomingMatches";
import NoResult from "@/components/shared/NoResult";
import Submit from "@/components/predictions-pages/igraj/Submit";
import { useToast } from "@/context/ToastContext";

const Event = dynamic(() => import('@/components/shared/Event'),
  {
    ssr: false,
    loading: () => <></>
  }
)

export default function Play() {
  const [userPredictions, setUserPredictions] = useState<Array<Prediction>>([])
  const [showEvent, setShowEvent] = useState(false)
  const queryClient = useQueryClient();
  const { showToast } = useToast()

  useEffect(() => {
    setShowEvent(true)
  }, [])

  const matches = useQuery({
    queryKey: ['matches'],
    queryFn: async (): Promise<UpcomingMatch[] | NoMatches> => {
      const { data }: { data: UpcomingMatchesApiResponse } = await backend.get('/matches')
    
      if(!data.matches?.length)
        return { message: data.message, description: data.description }

      return data.matches.map((match: UpcomingMatch) => ({
        ...match,
        id: Number(match.id)
      }))
    },
    staleTime: 1000 * 60 * 5
  })
  const predictions = useQuery({
    queryKey: ['predictions'],
    queryFn: async (): Promise<Prediction[]> => {
      const result = await backend.get('/predictions')
      return result.data.predictions
    }
  })
  const matchesPoints = useQuery({
    queryKey: ['matches-points'],
    queryFn: async (): Promise<MatchesPoints[]> => {
      const result = await backend.get('/matches-points')
      return result.data
    }
  })

  const handleUserPredictionChange = useCallback(({ matchId, predictedTeam }: Prediction) => {
    setUserPredictions(prev => {
      const arrayWithoutMatchId = prev.filter(p => p.matchId !== matchId)

      return arrayWithoutMatchId.concat([{ matchId, predictedTeam }])
    })
  }, [])
  
  const handleSubmit = async () => {
    if(userPredictions.length === 0) return

    try {
      await backend.post('/predict', {
        predictions: userPredictions
      })
      await queryClient.invalidateQueries({ queryKey: ['predictions'] })
      await queryClient.invalidateQueries({ queryKey: ['matches-points'] })
      setUserPredictions([])
      showToast('Predikcije su uspešno sačuvane!')
    } catch (error) {
      showToast('Nismo uspeli da sačuvamo predikcije, pokušajte ponovo.', 'error')
    }
  }

  if(matches.isPending) return <Loading />

  if(matches.error) return <Error err={matches.error} />

  if(predictions.error) return <Error err={predictions.error} />

  if(matches.data && !Array.isArray(matches.data))
    return <NoResult title={ matches.data.message } subtitle={ matches.data.description } />

  if(!predictions.data || !matchesPoints.data)
    return

  return (
    <div className="w-4/5 lg:w-3/5 mx-auto mb-8 min-h-[calc(100vh-16rem)] flex flex-col items-center relative gap-10 select-none">
      <div className="-mb-7">
        {showEvent && <Event />}
      </div>
      {
        matches.data.map(match => (
          <Matchup
            match={match}
            setPredictions={handleUserPredictionChange}
            backendPrediction={predictions.data.find(el => el.matchId === match.id)}
            matchesPoints={matchesPoints.data.find(el => el.id === match.id)}
            key={match.id}
          />
        ))
      }
      <Submit 
        handleSubmit={handleSubmit} 
        isDisabled={userPredictions.length === 0}
      />
    </div>
  );
}
