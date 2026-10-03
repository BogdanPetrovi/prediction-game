'use client'

import ResultMatchCard from "@/components/admin/ResultMatchCard"
import Error from "@/components/shared/Error"
import Forbidden from "@/components/shared/Forbidden"
import Loading from "@/components/shared/Loading"
import NoResult from "@/components/shared/NoResult"
import backend from "@/services/api/backend"
import MatchWithoutResult from "@/types/MatchWithoutResult"
import useSetResult from "@/utils/mutations/useSetResult"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function Rezultati() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['matches-without-result'],
    queryFn: async (): Promise<MatchWithoutResult[]> => {
      const result = await backend.get('/admin/matches-without-result')
      return result.data
    },
    retry: false
  })

  const { mutate, isPending: isSetResultPending } = useSetResult()

  if(isPending) return <Loading />

  if(isError && axios.isAxiosError(error) && error.status === 403) return <Forbidden />

  if(isError) return <Error err={error} />

  if(data.length === 0) return (
    <div className="relative w-screen min-h-[calc(100vh-4.5rem)]">
      <NoResult
        title="Nema mečeva bez rezultata"
        subtitle="Ovde se prikazuju započeti mečevi aktivnog turnira kojima nedostaje rezultat."
      />
    </div>
  )

  return (
    <div className="w-screen min-h-[calc(100vh-4.5rem)] mb-5 pt-12 flex flex-col items-center gap-3">
      {
        data.map(match => (
          <ResultMatchCard
            key={match.id}
            match={match}
            isPending={isSetResultPending}
            onSave={(team1Score, team2Score) => mutate({ matchId: match.id, team1Score, team2Score })}
          />
        ))
      }
    </div>
  )
}
