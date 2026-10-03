import Image from "next/image"
import Team from "@/types/Team"

interface ResultTeamProps {
  team: Team,
  isReversed?: boolean
}

export default function ResultTeam({ team, isReversed }: ResultTeamProps) {
  return (
    <div className={`${isReversed ? 'flex-row-reverse text-right' : ''} flex-1 flex items-center gap-3 min-w-0`}>
      {
        team.logo && !team.logo.startsWith('/') ?
        <Image
          src={team.logo}
          alt={`${team.name} logo`}
          width={48}
          height={48}
          className="size-12 shrink-0"
          unoptimized
        />
        :
        <h3 className="size-12 shrink-0 flex items-center justify-center text-3xl font-bold">?</h3>
      }
      <h3 className="text-xl font-semibold truncate">{ team.name }</h3>
    </div>
  )
}
