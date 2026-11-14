"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Error from "@/components/shared/Error"
import Loading from "@/components/shared/Loading"
import { isNotFound, profileQueryOptions } from "@/utils/profileQueryOptions"
import BackToLeaderboard from "./BackToLeaderboard"
import CurrentPlacement from "./CurrentPlacement"
import Profile from "./Profile"
import ProfileComparison from "./ProfileComparison"
import ProfileHistory from "./ProfileHistory"

export default function UserProfile({ username }: { username: string }) {
  const router = useRouter()
  const { data, isPending, error } = useQuery(profileQueryOptions(username))
  const me = useQuery(profileQueryOptions())

  const isMe = !!data && !!me.data && data.username === me.data.username

  useEffect(() => {
    if(isMe) router.replace('/profil')
  }, [isMe, router])

  if(isPending || me.isPending || isMe) return <Loading />

  if(error) {
    if(!isNotFound(error)) return <Error err={error} />

    return (
      <>
        <BackToLeaderboard />
        <div className="mt-16 flex flex-col items-center text-center slide-down">
          <div className="mb-6 flex items-center gap-3.5" aria-hidden="true">
            <div className="w-4 h-14 rounded-full bg-gradient-to-b from-[#667EEA] to-[#9333EA]" />
            <div className="w-4 h-14 rounded-full bg-gradient-to-b from-[#F39C12] to-[#FFA500]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">Korisnik ne postoji</h2>
          <p className="text-slate-300 text-base leading-relaxed max-w-[300px]">
            Proveri da li je ime tačno napisano ili pronađi korisnika na tabeli.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <BackToLeaderboard />
      <Profile username={username} belowName={<CurrentPlacement username={username} />} />
      <ProfileComparison them={data} />
      <ProfileHistory username={username} />
    </>
  )
}
