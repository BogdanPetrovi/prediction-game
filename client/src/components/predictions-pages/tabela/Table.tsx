import backend from "@/services/api/backend"
import ApiLeaderboardType from "@/types/ApiLeaderboardType"
import LeaderboardPlace from "@/types/LeaderboardPlace"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

interface TableProps {
  data: ApiLeaderboardType,
  page: number
}

export default function Table({ data, page }: TableProps) {
  const myPosition = useQuery({
    queryKey: ['users-leaderboard-page'],
    queryFn: async (): Promise<LeaderboardPlace> => {
      const result = await backend.get("/users-ledaerboard-page")
      return result.data
    }
  })

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-secondary text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700 sg:bg-sg-red sg:text-white sg:border-sg-red">
          <th className="py-4 px-4 w-16 text-center font-bold">#</th>
          <th className="py-4 px-4 font-bold">Korisnik</th>
          <th className="py-4 px-4 text-right font-bold">Poeni</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800 slide-down sg:divide-sg-sand">
        {
          data.leaderboard.length === 0 ? (
            <tr>
              <td
                colSpan={100}
                className="text-center text-slate-200 py-58 sg:text-stone-600"
              >
                Tabela će biti prikazana nakon završetka prvih mečeva!
              </td>
            </tr>
          ) : (
          data.leaderboard.map((user, index) => {
          const currentPlace = (index + 1) + ((page - 1) * 10)
          const isCurrentUser = currentPlace === Number(myPosition.data?.place)

          return (
            <tr 
              key={user.username} 
              className={`transition-colors ${
                isCurrentUser
                  ? "bg-indigo-900/35 border-l-4 border-l-orange-500 sg:bg-sg-red/8 sg:border-l-sg-red"
                  : "hover:bg-secondary hover:brightness-120 sg:hover:bg-sg-red/5 sg:hover:brightness-100"
              }`}
            >
              <td className={`py-3 px-4 text-center font-bold ${isCurrentUser ? "text-orange-500 sg:text-sg-crimson" : "text-slate-400 sg:text-stone-500"}`}>
                {currentPlace}
              </td>
              <td className={`py-3 px-4 font-semibold ${isCurrentUser ? "text-orange-500 sg:text-sg-crimson" : "text-slate-200 sg:text-sg-ink"}`}>
                <Link
                  href={isCurrentUser ? '/profil' : `/profil/${encodeURIComponent(user.username)}`}
                  prefetch={false}
                  className={`${isCurrentUser ? "hover:text-orange-400 sg:hover:text-sg-wine" : "hover:text-white sg:hover:text-sg-crimson"} rounded-sm underline-offset-4 decoration-2 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary duration-200 sg:focus-visible:ring-sg-red sg:focus-visible:ring-offset-white`}
                >
                  {user.username}
                </Link>
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`font-bold ${isCurrentUser ? "text-orange-500 sg:text-sg-crimson" : "text-slate-300 sg:text-stone-700"}`}>
                  {user.points}
                </span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium sg:text-stone-500">pts</span>
              </td>
            </tr>
          );
        }))}

        {
          data.leaderboard.length > 0 && Array.from({ length: Math.max(0, 10 - (data.leaderboard?.length ?? 0)) }).map((_, index) => (
          <tr key={`ghost-${index}`} className="pointer-events-none select-none">
            <td className="py-3 px-4">&nbsp;</td>
            <td className="py-3 px-4">&nbsp;</td>
            <td className="py-3 px-4">&nbsp;</td>
          </tr>
          ))
        }
      </tbody>
    </table>
  )
}