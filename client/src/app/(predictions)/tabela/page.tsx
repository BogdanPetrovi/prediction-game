import Leaderboard from "@/components/predictions-pages/tabela/Leaderboard"
import Event from "@/components/shared/Event"
import TopThree from "@/components/predictions-pages/tabela/TopThree"

const LeaderboardPage = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-9.5rem)] max-w-3xl mx-3 md:mx-auto mt-2">
        <div className="w-full flex justify-center mb-7">
          <Event />
        </div>
        <TopThree />
        <Leaderboard />
      </div>
    </>
  )
}

export default LeaderboardPage