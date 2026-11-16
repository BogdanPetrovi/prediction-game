import { useToast } from "@/context/ToastContext"
import backend from "@/services/api/backend"
import type Profile from "@/types/Profile"
import type UsernameStatus from "@/types/UsernameStatus"
import { profileQueryOptions, usernameStatusQueryOptions } from "@/utils/profileQueryOptions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios"

export const changeUsernameErrorMessage = (err: unknown) => {
  if(isAxiosError(err)) {
    if(!err.response) return 'Nema veze sa serverom, pokušaj ponovo.'

    const { status, data } = err.response
    if(status < 500) {
      if(Array.isArray(data) && typeof data[0]?.message === 'string') return data[0].message
      if(typeof data === 'string' && data !== '') return data
    }
  }

  return 'Nismo uspeli da promenimo nadimak, pokušaj ponovo.'
}

const useChangeUsername = () => {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (username: string): Promise<UsernameStatus> => {
      const result = await backend.put('/profile/username', { username })
      return result.data
    },
    onSuccess: (status) => {
      queryClient.setQueryData(usernameStatusQueryOptions().queryKey, status)
      queryClient.setQueryData(profileQueryOptions().queryKey, (profile: Profile | undefined) => profile && { ...profile, username: status.username })
      showToast(`Nadimak je promenjen u ${status.username}!`)

      for(const key of ['profile', 'leaderboard', 'top-three', 'history'])
        queryClient.invalidateQueries({ queryKey: [key] })
    },
    onError: (err) => {
      if(isAxiosError(err) && err.response?.status === 429)
        queryClient.invalidateQueries({ queryKey: usernameStatusQueryOptions().queryKey })
    }
  })
}

export default useChangeUsername
