import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

interface AddMatchTeam {
  name: string,
  logo: string
}

interface AddMatchProps {
  id: number,
  team1: AddMatchTeam,
  team2: AddMatchTeam,
  date: number,
  format: string
}

const useAddMatch = () => {
  const { showToast } = useToast()
  return useMutation({
    mutationFn: (match: AddMatchProps) => backend.post('/admin/add-match', { match }),
    onSuccess: async () => {
      showToast('Uspešno ste ubacili meč!')
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da ubacimo meč, pogledajte konzolu!`, 'error')
    }
  })
}

export default useAddMatch
