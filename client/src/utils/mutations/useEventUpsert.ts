import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { FullEvent } from "@/types/Event"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

interface EventUpsertProps {
  event: FullEvent | null, 
  isActive: boolean, 
  parentEventId: number
}

const useEventUpsert = () => {
  const { showToast } = useToast()
  return useMutation({
    mutationFn: ({ event, isActive, parentEventId }: EventUpsertProps) => backend.post('/admin/event-upsert', 
      {
        ...event, 
        isActive, 
        parentEventId
      }
    )
    ,
    onSuccess: async () => {
      showToast('Turnir je uspešno ubačen/promenjen!')
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da sačuvamo turnir. Vise informacija u konzoli.`, 'error')
    }
  })
}

export default useEventUpsert