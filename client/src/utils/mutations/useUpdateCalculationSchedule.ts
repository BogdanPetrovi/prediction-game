import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

const useUpdateCalculationSchedule = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (hours: number[]) => backend.post('/admin/calculation-schedule', { hours }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['calculation-schedule'] })
      showToast('Uspešno ste sačuvali satnicu računanja!')
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da sačuvamo satnicu, pogledajte konzolu!`, 'error')
    }
  })
}

export default useUpdateCalculationSchedule
