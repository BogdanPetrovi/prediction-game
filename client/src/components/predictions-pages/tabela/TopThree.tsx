"use client"

import backend from "@/services/api/backend";
import { Prize, TopUser } from "@/types/TopThree";
import { isPrize } from "@/utils/isPrize";
import { useQuery } from "@tanstack/react-query";
import PrizesView from "./PrizesView";
import UsersView from "./UsersView";

export default function TopThree() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['top-three'],
    queryFn: async (): Promise<Prize[] | TopUser[]>  => {
      const result = await backend.get("/prizes")
      return result.data
    }
  })
  
  if(isPending || isError || !data) return <></>

  return isPrize(data) ? <PrizesView prizes={data} /> : <UsersView topUsers={data} />
}