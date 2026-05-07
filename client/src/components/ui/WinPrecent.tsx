import PredictedTeamEnum from "@/types/PredictedTeamEnum";

interface WinPrecentProps {
  value: number,
  team: 'team1' | 'team2', 
  selected: PredictedTeamEnum,
  isLive: boolean
}

const WinPercent = ({ value, team, selected, isLive }: WinPrecentProps) => {
  return (
    <>
    { (selected !== '' || isLive) &&
      <div className={`${team === 'team1' ?
       'bg-white/20 slide-in-left' :
       `bg-black/25 slide-in ${ selected === 'team1' && 'opacity-50 group-hover:opacity-80' }`} py-1 lg:py-1 px-0 lg:px-1 rounded-lg backdrop-blur-md font-semibold text-xs lg:text-lg duration-300`}
       title="Broj poena koji osvajas ako ova ekipa pobedi">
        {value}pts
      </div>
    }
    </>
  );
};
export default WinPercent