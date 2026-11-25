import Image from "next/image";
import { FinishedMatch, FinishedMatchTeam } from "@/types/PredictionHistory";
import { formatDateTimeWithLetter } from "@/utils/formatDate";
import { isOptimizedImage } from "@/utils/isOptimizedImage";
import PendingIcon from "./PendingIcon";

const Team = ({ team, isLoser }: { team: FinishedMatchTeam, isLoser: boolean }) => (
  <div className={`${isLoser ? 'opacity-60' : ''} min-w-0 flex gap-1.5 items-center`}>
    <span className="relative size-5 shrink-0 flex items-center justify-center">
      {
        team.logo && !team.logo.startsWith('/') ?
          <Image
            src={team.logo}
            alt=""
            fill
            sizes="20px"
            className="object-contain"
            unoptimized={!isOptimizedImage(team.logo)}
          />
        :
          <span aria-hidden="true" className="font-bold leading-none">?</span>
      }
    </span>
    <span title={team.name} className="truncate text-sm md:text-base font-semibold md:tracking-wider">{team.name}</span>
  </div>
)

const Points = ({ data, points }: { data: FinishedMatch, points: number | null }) => {
  if(points === null) {
    const label = `Čeka obračun poena, odigran ${formatDateTimeWithLetter(data.playedAt)}`

    return (
      <span title={label} className="justify-self-end text-slate-400 sg:text-stone-500">
        <PendingIcon />
        <span className="sr-only">{label}</span>
      </span>
    )
  }

  if(data.isCorrect)
    return <span className="text-green-400 font-semibold text-xs md:text-sm text-right tabular-nums sg:text-green-700">{points}pts</span>

  return (
    <span
      title={`Da ste pogodili osvojili biste ${points} poena`}
      className="text-slate-400 font-semibold text-xs md:text-sm text-right tabular-nums sg:text-stone-500"
    >
      0pts
    </span>
  )
}

export default function ProfileHistoryMatch({ data }: { data: FinishedMatch }) {
  const chosenTeam = data.predictedWinner === 'team1' ? data.team1 : data.team2
  const otherTeam = data.predictedWinner === 'team1' ? data.team2 : data.team1
  const [first, second] = data.result.split(":")
  const formatedResult = data.predictedWinner === 'team1' ? data.result : `${second}:${first}`

  return (
    <li className="min-h-13 px-3 grid grid-cols-[1rem_minmax(0,1fr)_auto_minmax(0,1fr)_3.25rem] items-center gap-2 md:gap-3 hover:bg-white/5 duration-200 sg:hover:bg-sg-red/5">
      <span className={data.isCorrect ? 'text-green-400 sg:text-green-700' : 'text-red-400 sg:text-red-600'}>
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true">
          {
            data.isCorrect
              ? <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          }
        </svg>
        <span className="sr-only">{data.isCorrect ? 'Pogođeno' : 'Promašeno'}</span>
      </span>
      <Team team={chosenTeam} isLoser={!data.isCorrect} />
      <span className="px-1 font-bold text-white text-sm md:tracking-[2px] tabular-nums sg:text-sg-ink">{formatedResult}</span>
      <Team team={otherTeam} isLoser={data.isCorrect} />
      <Points data={data} points={chosenTeam.points} />
    </li>
  )
}
