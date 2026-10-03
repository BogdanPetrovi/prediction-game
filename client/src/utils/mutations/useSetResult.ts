import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

interface SetResultProps {
  matchId: number,
  team1Score: number,
  team2Score: number
}

const useSetResult = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (result: SetResultProps) => backend.post('/admin/set-result', { result }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['matches-without-result'] })
      showToast('Uspešno ste upisali rezultat!')
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da upišemo rezultat, pogledajte konzolu!`, 'error')
    }
  })
}

export default useSetResult
