import LeaderboardEntry from "@/components/ui/LeaderboardEntry"
import leaderboardExampleArray from "@/utils/leaderboardExapmleArray"

const LeaderboardPage = () => {
  return (
    <div className="w-3/5 min-h-[calc(100vh-9.5rem)] rounded-2xl mx-auto bg-secondary flex flex-col items-center select-none overflow-y-hidden mb-8">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 animate-gradient-bg w-full h-24 flex justify-between items-center font-bold text-5xl px-3 text-secondary rounded-t-2xl">
        <div className="drop-shadow-2xl/100">
          {/* trophy svg, for now number 1 */}
          1 {leaderboardExampleArray[0].username}
        </div>
        {leaderboardExampleArray[0].points}
      </div>
      <div className="bg-[#C0C0C0] w-full h-20 flex justify-between items-center font-bold text-5xl px-3 text-secondary">
        <div>
          {/* silver medal svg, for now number 2 */}
          2 {leaderboardExampleArray[1].username}
        </div>
        {leaderboardExampleArray[1].points}
      </div>
      <div className="bg-[#b08d57] w-full h-20 flex justify-between items-center font-bold text-5xl px-3 text-secondary">
        <div>
          {/* bronze medal svg, for now number 3 */}
          3 {leaderboardExampleArray[2].username}
        </div>
        {leaderboardExampleArray[2].points}
      </div>
      {
        leaderboardExampleArray.slice(3).map((user, index) => (
          <LeaderboardEntry
            item={user}
            ranking={index+4}
            key={user.username}
          />
        ))
      }
    </div>
  )
}

export default LeaderboardPage