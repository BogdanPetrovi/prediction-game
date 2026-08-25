import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import Prediction from "@/types/Prediction"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

const usePredict = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ predictions }: { predictions: Array<Prediction> }) => backend.post('/predict', { predictions: predictions }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['predictions'] })
      await queryClient.invalidateQueries({ queryKey: ['matches-points'] })
      showToast('Predikcije su uspešno sačuvane!')
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da sačuvamo predikcije, pokušajte ponovo.`, 'error')
    }
  })
}

export default usePredict