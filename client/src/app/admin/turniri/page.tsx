'use client'

import PreviewEvent from "@/components/admin/PreviewEvent";
import SearchEvent from "@/components/admin/SearchEvent";
import Settings from "@/components/admin/Settings";
import backend from "@/services/api/backend";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import SaveEventButton from "@/components/admin/SaveEventButton";
import { FullEvent } from "@/types/Event";
import useEventUpsert from "@/utils/mutations/useEventUpsert";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

type Step = 'search' | 'preview' | 'settings'

export default function Events() {
  const [step, setStep] = useState<Step>('search')
  const [event, setEvent] = useState<FullEvent | null>(null)
  const [isActive, setIsActive] = useState<boolean>(true)
  const [isSearching, setIsSearching] = useState(false)
  const [logoUrl, setLogoUrl] = useState("")
  const [parentEvent, setParentEvent] = useState({
    isParent: false,
    value: "",
    isVerified: false
  })

  const queryClient = useQueryClient();
  const { showToast } = useToast()
  const { mutate: mutateEventUpsert, isPending: isEventUpsertPending } = useEventUpsert();

  const eventWithLogo = event && { ...event, logo: logoUrl.trim() || event.logo }

  const checkEvent = async (query: string) => {
    setStep('search')
    setIsSearching(true)
    setLogoUrl("")
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['searchEvent', query],
        queryFn: () => backend.get('/admin/search-event', { params: { query } }).then(res => res.data)
      })
      setEvent(data)
      setStep('preview')
    } catch (err) {
      console.error(err)
      showToast(err instanceof AxiosError && err.response?.status === 404
        ? 'Turnir nije pronađen, pokušajte precizniji naziv.'
        : 'Pretraga nije uspela. Više informacija u konzoli.', 'error')
    } finally {
      setIsSearching(false)
    }
  }

  const onConfirm = () => {
    setStep('settings')
  }

  const reset = () => {
    setStep('search')
    setEvent(null)
    setLogoUrl("")
    setParentEvent({
      isParent: false,
      value: "",
      isVerified: false
    })
  }

  return (
    <div className="w-screen min-h-[calc(100vh-4.5rem)] mb-5 pt-12 flex flex-col items-center">
      <div className="w-full bg-secondary max-w-[780px] border rounded-xl relative z-10 overflow-hidden">
        <SearchEvent
          onCheck={checkEvent}
          isSearching={isSearching}
        />

        {
          (step === 'preview' || step === 'settings') && <PreviewEvent onConfirm={onConfirm} event={eventWithLogo} reset={reset} />
        }

        {
          step === 'settings' &&
          <Settings
            isActive={isActive}
            setIsActive={setIsActive}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
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
            className="inline-flex text-center gap-2 px-5 py-3 rounded-lg border text-muted text-md font-bold cursor-pointer hover:border-red-500/40 hover:text-red-500/80 duration-300"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            Resetuj
          </button>
          <SaveEventButton
            saveEvent={() => mutateEventUpsert({
                event: eventWithLogo,
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
