import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { MatchWithGuesses } from "@/types/AdminMatches"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

const useUpdateMatches = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ updatedList }: { updatedList: Array<MatchWithGuesses> }) => backend.post('/admin/matches', { updatedList }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-matches'] })
      showToast('Uspešno ste prolmenili meč!')
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da promenimo meč, pokušajte ponovo!`, 'error')
    }
  })
}

export default useUpdateMatches