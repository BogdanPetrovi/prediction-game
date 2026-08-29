import Image from "next/image"
import { type Event } from '../../types/Event'

const DashboardCard = ({ title, name, logo }: Event & { title: string }) => {
  if(!logo) return (
    <div className="w-1/4 h-80 bg-secondary rounded-xl border p-3 gap-10 flex flex-col text-3xl">
      <h2 className="font-bold">{ title }</h2>
      <h3>Nema aktivnog turnira.</h3>
    </div>
  )

  return (
    <div className="w-1/4 h-80 bg-secondary rounded-xl border p-3 flex flex-col text-3xl">
      <h2 className="font-bold">{ title }</h2>
      <Image 
        width={100}
        height={100}
        className="size-40 self-center"
        src={logo}
        alt={`${name} logo`}
        unoptimized
      />
      <h2 className="text-center font-bold">{name}</h2>
    </div>
  )
}

export default DashboardCard