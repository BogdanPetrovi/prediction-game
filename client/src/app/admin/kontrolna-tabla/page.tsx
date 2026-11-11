'use client'

import CalculationSchedule from "@/components/admin/CalculationSchedule"
import DashboardButton from "@/components/admin/DashboardButton"
import DashboardCard from "@/components/admin/DashboardCard"
import LastUpdated from "@/components/predictions-pages/tabela/LastUpdated"
import Error from "@/components/shared/Error"
import Forbidden from "@/components/shared/Forbidden"
import backend from "@/services/api/backend"
import type CalculationScheduleType from "@/types/CalculationSchedule"
import { Event } from "@/types/Event"
import useCalculatePoints from "@/utils/mutations/useCalculatePoints"
import useRemoveParentEvent from "@/utils/mutations/useRemoveParentEvent"
import useUpdateCalculationSchedule from "@/utils/mutations/useUpdateCalculationSchedule"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function KontrolnaTabla() {
  const { data: parentEvent, isPending: isParentPanding } = useQuery({
    queryKey: ['parent-event'],
    queryFn: async ():Promise<Event> => {
      const result = await backend.get('/event')
      return result.data
    }
  })
  const { data: event, isPending: isEventPending, isError, error } = useQuery({
    queryKey: ['child-event'],
    queryFn: async ():Promise<Event> => {
      const result = await backend.get('/admin/child-event')
      return result.data
    },
    retry: false
  })
  const { data: schedule } = useQuery({
    queryKey: ['calculation-schedule'],
    queryFn: async (): Promise<CalculationScheduleType> => {
      const result = await backend.get('/admin/calculation-schedule')
      return result.data
    },
    retry: false
  })

  const { mutate: mutateCalculatePoints, isPending: isCalculatePointsPending } = useCalculatePoints()
  const { mutate: mutateRemoveParentEvent, isPending: isRemoveParentEventPending } = useRemoveParentEvent()
  const { mutate: mutateCalculationSchedule, isPending: isCalculationSchedulePending } = useUpdateCalculationSchedule()

  if(isError && axios.isAxiosError(error) && error.status === 403) return <Forbidden />

  if(isError) return <Error err={error} />

  if(isEventPending || isParentPanding || !event || !parentEvent) return <></>

  return (
    <div className="w-screen min-h-[calc(100vh-4.5rem)] mb-5 pt-12 flex flex-col gap-2 items-center">
      <div className="flex flex-col lg:flex-row w-full items-center justify-center gap-4 lg:gap-10 mb-8">
        <DashboardCard
          title={'Aktivni turnir'}
          id={event.id}
          name={event.name}
          logo={event.logo}
        />
        <DashboardCard
          title={'Aktivni parent turnir'}
          id={parentEvent.id}
          name={parentEvent.name}
          logo={parentEvent.logo}
        />
      </div>
      {
        (!event.name && !event.logo) && (parentEvent.name && parentEvent.logo) &&
          <DashboardButton 
            handleClick={() => {if(!isRemoveParentEventPending)mutateRemoveParentEvent()}}
            title="Izbriši parent event (dupli klik)"
            isDisabled={isRemoveParentEventPending}
          />
      }
      {
        event.name && event.logo &&
          <>
            <DashboardButton 
              handleClick={() => {if(!isCalculatePointsPending)mutateCalculatePoints()}}
              title="Izračunaj poene manuelno (dupli klik)"
              isDisabled={isCalculatePointsPending}
            />
            <div className="w-11/12 md:w-1/2 lg:w-1/3">
              <LastUpdated 
                text="Poslednji put računato"
              />
            </div>
          </>
      }
      {
        schedule &&
          <CalculationSchedule
            schedule={schedule}
            isPending={isCalculationSchedulePending}
            onSave={(hours) => mutateCalculationSchedule(hours)}
          />
      }
    </div>
  )
}