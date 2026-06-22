import Leaderboard from "@/components/predictions-pages/tabela/Leaderboard"
import Event from "@/components/shared/Event"
import TopThree from "@/components/predictions-pages/tabela/TopThree"

const LeaderboardPage = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-16rem)] max-w-3xl mx-3 md:mx-auto">
        <div className="w-full flex justify-center">
          <Event />
        </div>
        <TopThree />
        <Leaderboard />
      </div>
    </>
  )
}

export default LeaderboardPage