'use client'

import Error from "@/components/shared/Error"
import Forbidden from "@/components/shared/Forbidden"
import Loading from "@/components/shared/Loading"
import MatchCard from "@/components/ui/admin/MatchCard"
import Toast from "@/components/ui/Toast"
import backend from "@/services/api/backend"
import AdminMatches, { MatchWithGuesses } from "@/types/AdminMatches"
import { formatDateTime } from "@/utils/formatDate"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

export default function Matches() {
  const { data, isError, error, isPending, refetch } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: async (): Promise<AdminMatches> => {
      const result = await backend.get('/admin/matches')
      return result.data
    },
    retry: false
  })
  const [chosenMatch, setChosenMatch] = useState<MatchWithGuesses | null>(null)
  const buttonOptions = ['Promeni da li je live', 'Potvrdi']
  const [currentButtonOption, setCurrentButtonOption] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  const handleChange = async () => {
    if(currentButtonOption === 1){
      const newArr = data?.matches.map(match => {
        return match.id === chosenMatch?.id 
        ? {...match, live: !chosenMatch.live} 
        : match
      })
      try {
        const result = await backend.post('/admin/matches', { updatedList: newArr })
        setToastMessage('Uspešno ste prolmenili meč!')
        setToastType("success")
        setShowToast(true)
        setChosenMatch(null)
        refetch()
      } catch (err) {
        setToastMessage("Nismo uspeli da promenimo meč, pokušajte ponovo!")
        setToastType("error")
        setShowToast(true)
      }
    }
    setCurrentButtonOption(currentButtonOption === 0 ? 1 : 0)
  }

  if(isPending) return <Loading />

  if(isError && axios.isAxiosError(error) && error.status === 403) return <Forbidden />

  if(isError) return <Error err={error} />

  if(!data || data.expire === null) return <h2>No matches</h2>

  return(
    <>
    
      <div className="w-screen h-[calc(100vh-4.5rem)] pt-12 flex flex-col items-center">
        <div className="w-4/5 h-40 bg-secondary border-2 border-green-600 rounded-md flex items-center gap-6 px-2 overflow-x-auto">  
        {
          data.matches.map(match => (
            <MatchCard key={match.id} match={match} setChosenMatch={setChosenMatch} />
          ))
        }
        </div>

        <div className="w-3/4 h-2/3 bg-secondary rounded-md border-2 border-green-600 mt-10 flex flex-col">
          <h1 className="text-4xl font-bold self-center mt-3">Pregled meča</h1>
          {
            chosenMatch &&
            <>
              <div className="text-3xl font-semibold mt-5 ml-5">
                <h3>Meč id: {chosenMatch.id}</h3>
                <h3>Datum i vreme: {formatDateTime(chosenMatch.date)}</h3>
                <h3>Format: {chosenMatch.format}</h3>
                <h3>Tim 1: {chosenMatch.team1.name}</h3>
                <h3>Tim 2: {chosenMatch.team2.name}</h3>
                <h3>Live: {chosenMatch.live ? 'Da' : 'Ne'}</h3>
                <h3>Broj predikcija: { chosenMatch.guesses }</h3>
              </div>
              <button className="w-2/3 lg:w-1/3 rounded-2xl bg-cyan-900/30 p-2 font-semibold self-center mt-auto mb-2 text-2xl cursor-pointer" onClick={handleChange}>
                { buttonOptions[currentButtonOption] }
              </button>
            </>
          }
        </div>
      </div>
      
       {showToast && (
        <Toast 
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    
    </>
  )
}