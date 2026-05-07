import LeaderboardItem from "@/types/LeaderboardItem"

const LeaderboardEntry = ({ ranking, item }: { ranking: number, item: LeaderboardItem }) => {

  if(ranking === 1){
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 animate-gradient-bg w-full h-[4.6rem] flex justify-between items-center font-bold text-3xl xl:text-4xl px-3 text-secondary rounded-t-2xl">
        <div className="drop-shadow-2xl/100">
          🏆 {item.username}
        </div>
        {item.points}pts
      </div>
    )
  }

  if(ranking === 2){
    return (
      <div className="bg-[#C0C0C0] w-full h-[4.6rem] flex justify-between items-center font-bold text-3xl xl:text-4xl px-3 text-secondary">
        <div>
          🥈 {item.username}
        </div>
        {item.points}pts
      </div>
    )
  }

  if(ranking === 3){
    return (
      <div className="bg-[#b08d57] w-full h-[4.6rem] flex justify-between items-center font-bold text-3xl xl:text-4xl px-3 text-secondary">
        <div>
          🥉 {item.username}
        </div>
        {item.points}pts
      </div>
    )
  }

  return( 
    <div className={`w-full h-[4.6rem] ${ranking % 10 === 0 ? '' : 'border-b-2' } border-b-white flex justify-between items-center font-semibold text-2xl xl:text-3xl px-3`}>
      <div>
        { ranking }. { item.username }
      </div>
      { item.points }pts
    </div>
  )
}

export default LeaderboardEntry