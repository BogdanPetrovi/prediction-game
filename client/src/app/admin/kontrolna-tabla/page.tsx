'use client'

import DashboardCard from "@/components/admin/DashboardCard"
import LastUpdated from "@/components/predictions-pages/tabela/LastUpdated"
import Error from "@/components/shared/Error"
import Forbidden from "@/components/shared/Forbidden"
import backend from "@/services/api/backend"
import { Event } from "@/types/Event"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function KontrolnaTabla() {
  const { data: parentEvent, isPending: isParentPanding, isError, error } = useQuery({
    queryKey: ['parent-event'],
    queryFn: async ():Promise<Event> => {
      const result = await backend.get('/admin/parent-event')
      return result.data
    }
  })
  const { data: event, isPending: isEventPending } = useQuery({
    queryKey: ['event'],
    queryFn: async ():Promise<Event> => {
      const result = await backend.get('/event')
      return result.data
    }
  })

  const calculatePoints = async () => {
    await backend.get('/admin/manual-calculation')
  }


  if(isEventPending || isParentPanding || !event || !parentEvent) return <></>

  if(isError && axios.isAxiosError(error) && error.status === 403) return <Forbidden />

  if(isError) return <Error err={error} />

  return (
    <div className="w-screen h-[calc(100vh-4.5rem)] pt-12 flex flex-col gap-2 items-center">
      <div className="flex w-full justify-center gap-10 mb-8">
        <DashboardCard
          title={'Aktivni turnir'}
          name={event.name}
          logo={event.logo}
        />
        <DashboardCard
          title={'Aktivni parent turnir'}
          name={parentEvent.name}
          logo={parentEvent.logo}
        />
      </div>
      <button 
        className="w-1/3 h-15 bg-secondary rounded-lg text-xl font-semibold cursor-pointer hover:brightness-130 active:brightness-150 duration-300"
        onClick={calculatePoints}  
      >
        Izračunaj poene manuelno
      </button>
      <div className="w-1/3">
        <LastUpdated 
          text="Poslednji put računato"
        />
      </div>
    </div>
  )
}