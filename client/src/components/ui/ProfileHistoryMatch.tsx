import { FinishedMatch } from "@/types/PredictionHistory";
import { formatDateTimeWithLetter } from "@/utils/formatDate";
import Image from "next/image";

export default function ProfileHistoryMatch({ data }: { data: FinishedMatch }) {
  const chosenTeam = data.predicted_winner === 'team1' ? data.team1 : data.team2
  const otherTeam = data.predicted_winner !== 'team1' ? data.team1 : data.team2
  const [first, second] = data.result.split(":");
  const formatedResult = data.predicted_winner === 'team1' ? data.result : `${second}:${first}`

  return (
    <div className="h-13 bg-secondary border-b border-zinc-700 px-2 flex items-center gap-3 hover:brightness-120 duration-200">
      {
        data.is_correct === "correct" ? 
        <div className="size-3 rounded-full bg-green-400 shadow-md shadow-green-400/50"></div>
        :
        <div className="size-3 rounded-full bg-red-400 shadow-md shadow-red-400/50"></div>
      }
      <div className={`${ data.is_correct === 'incorrect' && 'opacity-60' } flex gap-1 items-center`}>
        <div className="relative size-5">
          <Image
            src={chosenTeam.logo}
            alt={`${chosenTeam} logo`}
            fill
            unoptimized
          />
        </div>
        <h4 className={`font-semibold md:tracking-wider`}>{ chosenTeam.name }</h4>
      </div>
      <h4 className="text-muted/60 font-bold text-sm">VS</h4>
      <div className={`${ data.is_correct === 'correct' && 'opacity-60' } flex gap-1 items-center`}>
        <div className="relative size-5">
          <Image
            src={otherTeam.logo}
            alt={`${otherTeam.name} logo`} 
            fill
            unoptimized
          />
        </div>
        <h4 className={`font-semibold md:tracking-wider`}>
          { otherTeam.name }
        </h4>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <h3 className="min-w-max font-bold text-white md:tracking-[2px] text-xs md:text-md">{ formatedResult }</h3>
        <h3 className="min-w-max text-muted font-semibold text-xs md:text-sm tracking-tighter">{ formatDateTimeWithLetter(data.date) }</h3>
      </div>
    </div>
  )
}