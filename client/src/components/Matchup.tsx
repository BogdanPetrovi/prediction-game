import { format } from 'date-fns'
import Match from '../types/match'

const Matchup = ({ match }: { match: Match }) => { 
  const formatedDate = (): string => {
    const date = match.date && format(new Date(match.date), 'dd.MM HH:mm');
    return date || ''
  }

  return (
    <div className="relative w-full h-20 bg-gradient-to-l from-30% from-[#667EEA] to-[#9333EA] rounded-xl flex items-center">
      <div className='absolute left-2 -bottom-7'>
        {
          match.live ? 
            <h3 className='font-semibold text-xl text-red-600 animate-pulse'>Live</h3>
          :
            <h3 className='font-semibold text-xl'>{ formatedDate() }</h3>
        }
      </div>
      <div className="group flex items-center gap-3 relative w-1/2 h-full cursor-pointer duration-300">
        <img src={ match.team1.logo } className="size-16 group-hover:size-[4.5rem] ml-4 drop-shadow-xl/70 duration-300" />
        <h2 className="hidden md:block text-3xl lg:text-4xl font-semibold">{ match.team1.name }</h2>
      </div>
      <div 
        className="group absolute flex flex-row-reverse items-center justify-start gap-3 bg-gradient-to-l from-[#F39C12] to-[#FFA500] top-0 right-0 rounded-r-xl h-full w-1/2 cursor-pointer duration-300"
      >
        <img src={ match.team2.logo } className="size-16 group-hover:size-[4.5rem] mr-4 drop-shadow-xl/70 duration-300" />
        <h2 className="hidden md:block text-3xl lg:text-4xl text-[#f9fafd] font-semibold ml-4 lg:ml-0">{ match.team2.name }</h2>
      </div>
      <div className='absolute right-2 -bottom-7'>
        <h3 className='font-semibold text-xl capitalize'>{ match.format }</h3>
      </div>
    </div>
  )
}

export default Matchup