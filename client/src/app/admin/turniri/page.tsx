'use client'

import PreviewEvent from "@/components/admin/PreviewEvent";
import SearchEvent from "@/components/admin/SearchEvent";
import Settings from "@/components/admin/Settings";
import backend from "@/services/api/backend";
import ErrorComponent from "@/components/shared/Error";
import { useState } from "react";
import { DefaultError, useQueryClient } from "@tanstack/react-query";
import SaveEventButton from "@/components/admin/SaveEventButton";
import { FullEvent } from "@/types/Event";
import useEventUpsert from "@/utils/mutations/useEventUpsert";

type Step = 'search' | 'preview' | 'settings'

export default function Events() {
  const [step, setStep] = useState<Step>('search')
  const [event, setEvent] = useState<FullEvent | null>(null)
  const [isActive, setIsActive] = useState<boolean>(true)
  const [parentEvent, setParentEvent] = useState({
    isParent: false,
    value: "",
    isVerified: false
  })
  const [error, setError] = useState<DefaultError | null>(null)
  
  const queryClient = useQueryClient();
  const { mutate: mutateEventUpsert, isPending: isEventUpsertPending } = useEventUpsert();

  const checkEvent = async (id: number) => {
    setStep('search')
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['searchEvent', id],
        queryFn: () => backend.get(`/admin/search-event?eventId=${id}`).then(res => res.data)
      })
      setEvent(data)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  const onConfirm = () => {
    setStep('settings')
  } 

  const reset = () => {
    setStep('search')
    setEvent(null)
    setParentEvent({
      isParent: false,
      value: "",
      isVerified: false
    })
  }

  if(error) <ErrorComponent err={error} />

  return (
    <div className="w-screen min-h-[calc(100vh-4.5rem)] mb-5 pt-12 flex flex-col items-center">
      <div className="w-full bg-[#2b3040] max-w-[780px] border border-green-500 rounded-[14px] relative z-10 overflow-hidden">
        <SearchEvent onCheck={checkEvent} />

        {
          (step === 'preview' || step === 'settings') && <PreviewEvent onConfirm={onConfirm} event={event} reset={reset} />
        }

        {
          step === 'settings' && 
          <Settings 
            isActive={isActive} 
            setIsActive={setIsActive}
            parentEvent={parentEvent}
            setParentEvent={setParentEvent}
          />
        }
        
      </div>
      {
      step === 'settings' && 
        <div className="mt-3 w-[780px] flex justify-end gap-3">
          <button 
            onClick={reset} 
            className="inline-flex text-center gap-2 px-5 py-3 rounded-lg border border-admin-border text-muted text-md font-bold cursor-pointer hover:border-red-500/40 hover:text-red-500/80 duration-300"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            Resetuj
          </button>
          <SaveEventButton 
            saveEvent={() => mutateEventUpsert({
                event,
                isActive,
                parentEventId: Number(parentEvent.value)
              }, {
                onSuccess: () => reset()
              })
            }
            isDisabled={(parentEvent.isParent && !parentEvent.isVerified) || isEventUpsertPending}
          />
        </div>
      }
    </div>
  )
}