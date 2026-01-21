'use client'

import Matchup from "@/components/Matchup"
import { useCallback, useState } from "react";
import Prediction from "@/types/Prediction";
import backend from "@/services/api/backend";
import Match from "@/types/Match";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/shared/Loading";
import dynamic from "next/dynamic";
import Toast from "@/components/ui/Toast";

const Event = dynamic(() => import('@/components/shared/Event'))

export default function Play() {
  const [userPredictions, setUserPredictions] = useState<Array<Prediction>>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const matches = useQuery({
    queryKey: ['matches'],
    queryFn: async (): Promise<Match[]> => {
      const result = await backend.get('/matches')
      return result.data
    }
  })
  const predictions = useQuery({
    queryKey: ['predictions'],
    queryFn: async (): Promise<Prediction[]> => {
      const result = await backend.get('/predictions')
      return result.data.predictions
    }
  })

  const handleUserPredictionChange = useCallback(({ matchId, predictedTeam }: Prediction) => {
    setUserPredictions(prev => {
      const arrayWithoutMatchId = prev.filter(p => p.matchId !== matchId)

      return arrayWithoutMatchId.concat([{ matchId, predictedTeam }])
    })
  }, [])
  
  const handleSubmit = async () => {
    try {
      await backend.post('/predict', {
        predictions: userPredictions
      })
      setToastMessage('Successfully updated your predictions!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      setToastMessage('Failed to update predictions. Please try again.')
      setToastType('error')
      setShowToast(true)
    }
  }

  if(matches.isPending) return <Loading />

  if(matches.error) return <h1>Error</h1>

  if(matches.data && matches.data.length > 0 && predictions.data) return (
    <>
      <div className="w-3/5 -mt-6 mx-auto min-h-[calc(100vh-9.5rem)] flex flex-col items-center relative gap-10 pb-10 select-none">
        <div className="-mb-7">
          <Event />
        </div>
        {
          matches.data.map(match => (
            <Matchup
              match={match}
              setPredictions={handleUserPredictionChange}
              backendPrediction={predictions.data.find(el => el.matchId === match.id)}
              key={match.id}
            />
          ))
        }
        <button className="bg-secondary hover:bg-[#2F333F] active:bg-[#3a3e4a] w-1/3 hover:w-2/5 h-16 rounded-3xl cursor-pointer font-bold text-4xl drop-shadow-2xl/100 duration-300" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {showToast && (
        <Toast 
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={6000}
        />
      )}
    </>
  );

  return (
    <div className="w-full mt-20 flex justify-center text-4xl font-bold">
      <h2>There are currently no active matches, check back again later!</h2>
    </div>
  )
}
