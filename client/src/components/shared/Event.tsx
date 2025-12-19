"use client"

import backend from "@/services/api/backend"
import { useQuery } from "@tanstack/react-query"

const Event = () => {
  const { data, isPending } = useQuery({
    queryKey: ['event'],
    queryFn: async ():Promise<Event> => {
      const result = await backend.get('/event')
      
      return result.data
    }
  })

  if(!isPending && data)
    return(
      <div className="flex items-center text-2xl font-semibold gap-2">
        <img src={data.logo} className="size-10" />
        <h2>{data.name}</h2>
      </div>
    )

  return null
}

export default Event