import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

const useSearchEvent = () => {
  const { showToast } = useToast()
  return useMutation({
    mutationFn: (id: number) => backend.get(`/admin/search-event?eventId=${id}`).then(res => res.data),
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

export default useSearchEvent