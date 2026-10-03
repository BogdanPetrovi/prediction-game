import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

const useSendNotifications = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => backend.post('/admin/send-notifications'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['pending-notifications'] })
      showToast('Uspešno ste poslali notifikaciju!')
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da pošaljemo notifikaciju, pogledajte konzolu!`, 'error')
    }
  })
}

export default useSendNotifications
