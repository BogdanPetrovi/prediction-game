import { MatchesSource } from "@/types/AdminMatches"

interface MatchesSourceInfoProps {
  source: MatchesSource,
  expire: number | null
}

export default function MatchesSourceInfo({ source, expire }: MatchesSourceInfoProps) {
  return (
    <div className="w-4/5 mb-3 px-4 py-2 bg-secondary rounded-lg border text-xl font-semibold">
      {
        source === 'redis'
        ? `Izvor: HLTV (Redis keš${expire !== null ? `, ističe za ${Math.ceil(expire / 60)} min` : ''})`
        : 'Izvor: Baza (nema Redis keša, HLTV nije osvežio mečeve)'
      }
    </div>
  )
}
