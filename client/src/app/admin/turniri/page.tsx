'use client'

import PreviewEvent from "@/components/ui/admin/PreviewEvent";
import SearchEvent from "@/components/ui/admin/SearchEvent";
import Settings from "@/components/ui/admin/Settings";
import backend from "@/services/api/backend";
import Error from "@/components/shared/Error";
import { useState } from "react";
import { useMutation, DefaultError } from "@tanstack/react-query";
import Toast from "@/components/ui/Toast";
import SaveEventButton from "@/components/ui/admin/SaveEventButton";

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
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [error, setError] = useState<DefaultError | null>(null)

  const mutation = useMutation({
    mutationFn: (id: number) => backend.get(`/admin/search-event?eventId=${id}`).then(res => res.data),
    onSuccess: (data) => {
      setEvent(data)
      setStep('preview')
    },
    onError: (err) => {
      setError(err)
    }
  })

  const checkEvent = async (id: number) => {
    setStep('search')

    mutation.mutate(id)
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

  const saveEvent = async () => {
    try {
      console.log({...event, isActive: isActive})
      await backend.post('/admin/event-upsert', {...event, isActive: isActive, parentEventId: parentEvent.value})
      reset()
      setToastMessage('Turnir je uspešno ubačen/promenjen!')
      setToastType('success')
      setShowToast(true)
    } catch (error) {
      console.error(error)
      setToastMessage('Nismo uspeli da sačuvamo turnir. Vise informacija u konzoli.')
      setToastType('error')
      setShowToast(true)
    }
  }

  if(error) <Error err={error} />

  return (
    <>
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
            <SaveEventButton saveEvent={saveEvent} isDisabled={parentEvent.isParent && !parentEvent.isVerified} />
          </div>
        }
      </div>
      {
        showToast && 
        <Toast 
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      }
    </>
  )
}