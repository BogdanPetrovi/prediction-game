import { TopUser } from "@/types/TopThree";

export default function UsersView({ topUsers }: { topUsers: TopUser[] }) {
  const [first, second, third] = topUsers.sort((a, b) => b.points - a.points);

  return (
    <div className="w-full flex flex-col md:flex-none md:grid md:grid-cols-3 gap-3 mb-4 md:mb-0 cursor-default">
      <div className="bg-slate-300/20 brightness-90 flex flex-col justify-center items-center h-30 rounded-lg border border-slate-300 hover:-translate-y-2 duration-200">
        <h3 className="text-2xl">🥈</h3>
        <h2 className="font-bold text-2xl">{ second.username }</h2>
        <h3 className="font-semibold tracking-wide">{ second.points }pts</h3>
      </div>
      <div className="bg-amber-400/20 brightness-125 flex flex-col justify-center items-center h-35 rounded-lg border border-amber-500 text-amber-500 md:-translate-y-3 hover:-translate-y-5 duration-200">
        <h3 className="text-2xl">🏆</h3>
        <h2 className="font-bold text-2xl">{ first.username }</h2>
        <h3 className="font-semibold tracking-wide">{ first.points }pts</h3>
      </div>
      <div className="bg-amber-700/20 flex flex-col justify-center items-center h-30 rounded-lg border border-amber-600 text-amber-600 hover:-translate-y-2 duration-200">
        <h3 className="text-2xl">🥉</h3>
        <h2 className="font-bold text-2xl">{ third.username }</h2>
        <h3 className="font-semibold tracking-wide">{ third.points }pts</h3>
      </div>
    </div>
  )
}