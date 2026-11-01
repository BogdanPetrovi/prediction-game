import Image from "next/image"
import { isOptimizedImage } from "@/utils/isOptimizedImage"
import { type Event } from '../../types/Event'

const DashboardCard = ({ title, name, logo, id }: Event & { title: string }) => {
  if(!name && !logo) return (
    <div className="w-1/4 h-80 bg-secondary rounded-xl border p-3 gap-10 flex flex-col text-3xl">
      <h2 className="font-bold">{ title }</h2>
      <h3>Nema aktivnog turnira.</h3>
    </div>
  )

  return (
    <div className="w-1/4 h-80 bg-secondary rounded-xl border p-3 flex flex-col text-3xl">
      <h2 className="font-bold">{ title }</h2>
      <Image 
        width={160}
        height={160}
        className="size-40 self-center object-contain"
        src={logo}
        alt={`${name} logo`}
        unoptimized={!isOptimizedImage(logo)}
      />
      <h2 className="text-center font-bold">{name}</h2>
      <h4 className="text-center">ID: { id }</h4>
    </div>
  )
}

export default DashboardCard