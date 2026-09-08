import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

const useCalculatePoints = () => {
  const { showToast } = useToast()
  return useMutation({
    mutationFn: () => backend.post('/admin/manual-calculation'),
    onSuccess: () => {
      showToast(`Uspešno ste izračunali poene manuelno`)
    },
    onError: (err) => {
      console.error(err)
      if(err instanceof AxiosError){
        showToast(err.response?.data.message || err.message + ' Pokušajte ponovo.', 'error')
        return
      }

      showToast(`Nismo uspeli da izračunamo poene manuelno.`, 'error')
    }
  })
}

export default useCalculatePoints