import HistoryCard from "@/components/ui/HistoryCard"
import tournamentHistoryExample from "@/utils/tournamentHistoryExample"

const HistoryPage = () => {
  return (
    <div className="h-[calc(98vh-9.5rem)] w-full flex justify-around select-none">
      <HistoryCard historyCardProps={tournamentHistoryExample[0]} />
      <HistoryCard historyCardProps={tournamentHistoryExample[1]} />
      <HistoryCard historyCardProps={tournamentHistoryExample[2]} />
      <HistoryCard historyCardProps={tournamentHistoryExample[0]} />
      <HistoryCard historyCardProps={tournamentHistoryExample[1]} />
    </div>
  )
}

export default HistoryPage