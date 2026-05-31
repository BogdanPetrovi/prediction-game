import backend from "@/services/api/backend"
import ApiLeaderboardType from "@/types/ApiLeaderboardType"
import LeaderboardPlace from "@/types/LeaderboardPlace"
import { useQuery } from "@tanstack/react-query"

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
        <tr className="bg-secondary text-slate-300 text-xs uppercase tracking-wider border-b border-slate-700">
          <th className="py-4 px-4 w-16 text-center font-bold">#</th>
          <th className="py-4 px-4 font-bold">Korisnik</th>
          <th className="py-4 px-4 text-right font-bold">Poeni</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800 slide-down">
        {data.leaderboard.map((user, index) => {
          const currentPlace = (index + 1) + ((page - 1) * 10)
          const isCurrentUser = currentPlace === Number(myPosition.data?.place)

          return (
            <tr 
              key={user.username} 
              className={`transition-colors ${
                isCurrentUser
                  ? "bg-light-secondary border-l-4 border-l-orange-500" 
                  : "hover:bg-light-secondary/40"
              }`}
            >
              <td className={`py-3 px-4 text-center font-bold ${isCurrentUser ? "text-orange-500" : "text-slate-400"}`}>
                {currentPlace}
              </td>
              <td className={`py-3 px-4 font-semibold ${isCurrentUser ? "text-orange-500" : "text-slate-200"}`}>
                {user.username}
              </td>
              <td className="py-3 px-4 text-right">
                <span className={`font-bold ${isCurrentUser ? "text-orange-500" : "text-slate-300"}`}>
                  {user.points}
                </span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">pts</span>
              </td>
            </tr>
          );
        })}

        {Array.from({ length: Math.max(0, 10 - (data.leaderboard?.length ?? 0)) }).map((_, index) => (
          <tr key={`ghost-${index}`} className="pointer-events-none select-none">
            <td className="py-3 px-4">&nbsp;</td>
            <td className="py-3 px-4">&nbsp;</td>
            <td className="py-3 px-4">&nbsp;</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}