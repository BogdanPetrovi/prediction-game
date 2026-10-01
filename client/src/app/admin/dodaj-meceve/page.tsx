'use client'

import AddMatchFormat from "@/components/admin/AddMatchFormat"
import AddMatchInput from "@/components/admin/AddMatchInput"
import AddMatchTeam, { Team } from "@/components/admin/AddMatchTeam"
import useAddMatch from "@/utils/mutations/useAddMatch"
import { useState } from "react"

const emptyTeam: Team = { name: '', logo: '' }

export default function DodajMeceve() {
  const [matchId, setMatchId] = useState('')
  const [team1, setTeam1] = useState<Team>(emptyTeam)
  const [team2, setTeam2] = useState<Team>(emptyTeam)
  const [date, setDate] = useState('')
  const [format, setFormat] = useState('bo3')

  const { mutate, isPending } = useAddMatch()

  const isDisabled = isPending || !matchId || !team1.name || !team2.name || !date

  const reset = () => {
    setMatchId('')
    setTeam1(emptyTeam)
    setTeam2(emptyTeam)
    setDate('')
    setFormat('bo3')
  }

  const handleClick = () => {
    if(isDisabled) return

    mutate({
      id: Number(matchId),
      team1,
      team2,
      date: new Date(date).getTime(),
      format
    }, {
      onSuccess: () => reset()
    })
  }

  return (
    <div className="w-screen min-h-[calc(100vh-4.5rem)] mb-5 pt-12 flex flex-col items-center">
      <div className="w-full max-w-[780px] bg-secondary rounded-xl border p-6 flex flex-col gap-6">
        <h2 className="text-3xl font-bold">Dodaj meč</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <AddMatchInput title="HLTV ID meča" placeholder="npr. 2381234 (iz URL-a na hltv.org)" type="number" value={matchId} setValue={setMatchId} />
          <AddMatchInput title="Datum i vreme" placeholder="" type="datetime-local" value={date} setValue={setDate} />
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <AddMatchTeam title="Tim 1" team={team1} setTeam={setTeam1} />
          <AddMatchTeam title="Tim 2" team={team2} setTeam={setTeam2} />
        </div>
        <AddMatchFormat format={format} setFormat={setFormat} />
      </div>
      <button
        className={`${isDisabled ? 'cursor-not-allowed brightness-75' : 'cursor-pointer hover:brightness-130 active:brightness-150'}
          w-full max-w-[780px] h-15 mt-3 bg-secondary rounded-lg border text-xl font-semibold duration-300
        `}
        onClick={handleClick}
        disabled={isDisabled}
      >
        Dodaj meč
      </button>
    </div>
  )
}
