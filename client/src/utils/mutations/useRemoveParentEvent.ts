import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

const useRemoveParentEvent = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => backend.post('/admin/remove-parent-event'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['parent-event'] })
      showToast(`Uspešno ste obrisali parent event`)
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da obrišemo parent event.`, 'error')
    }
  })
}

export default useRemoveParentEvent