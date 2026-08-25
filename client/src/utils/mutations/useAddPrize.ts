import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

interface AddPrizeProps {
  eventId: number,
  place: number,
  skinName: string,
  skinImage: string
}

const useAddPrize = () => {
  const { showToast } = useToast()
  return useMutation({
    mutationFn: ({ eventId, place, skinName, skinImage }: AddPrizeProps) => backend.post('/admin/add-prize', 
      {
        prize: {
          eventId,
          place: place,
          skinName: skinName,
          skinImage: skinImage
        }
      }
    )
    ,
    onSuccess: async () => {
      showToast('Uspešno ste ubacili skin!')
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da ubacimo skin, pogledajte konzolu!`, 'error')
    }
  })
}

export default useAddPrize