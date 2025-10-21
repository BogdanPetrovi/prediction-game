import LeaderboardItem from "@/types/leaderboardItem"

const LeaderboardEntry = ({ ranking, item }: { ranking: number, item: LeaderboardItem }) => {
  return( 
    <div className="w-full h-14 border-b-2 border-b-white flex justify-between items-center font-semibold text-3xl px-3">
      <div>
        { ranking }. { item.username }
      </div>
      { item.points }
    </div>
  )
}

export default LeaderboardEntry