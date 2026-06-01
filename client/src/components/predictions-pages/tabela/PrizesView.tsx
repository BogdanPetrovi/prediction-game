import { Prize } from "@/types/TopThree";
import Image from "next/image";

export default function PrizesView({ prizes }: {prizes: Prize[]}) {
  const firstPlace = prizes.find(val => val.place === 1)
  const secondPlace = prizes.find(val => val.place === 2)
  const thirdPlace = prizes.find(val => val.place === 3)

  if(!firstPlace || !secondPlace || !thirdPlace) return null

  return (
    <div className="w-full flex flex-col md:flex-none md:grid md:grid-cols-3 gap-3 mb-4 md:mb-0 cursor-default">
      <div className="bg-slate-300/20 brightness-90 flex flex-col justify-center items-center h-30 rounded-lg border border-slate-300 hover:-translate-y-2 duration-200">
        <Image
          width={70}
          height={170}
          alt="Skin za drugo mesto"
          src={ secondPlace.skinImage }
        />
        <h3 className="text-sm">{ secondPlace.skinName }</h3>
        <h2 className="uppercase font-bold text-lg">2. mesto</h2>
      </div>
      <div className="bg-amber-400/20 brightness-125 flex flex-col justify-center items-center h-35 rounded-lg border border-amber-500 text-amber-500 md:-translate-y-3 hover:-translate-y-5 duration-200">
        <Image
          width={80}
          height={180}
          alt="Skin za prvo mesto"
          src={ firstPlace.skinImage }
        />
        <h3 className="text-md">{ firstPlace.skinName }</h3>
        <h2 className="uppercase font-bold text-xl">1. mesto</h2>
      </div>
      <div className="bg-amber-700/20 flex flex-col justify-center items-center h-30 rounded-lg border border-amber-600 text-amber-600 hover:-translate-y-2 duration-200">
        <Image
          width={70}
          height={170}
          alt="Skin za prvo mesto"
          src={ thirdPlace.skinImage }
        />
        <h3 className="text-sm">{ thirdPlace.skinName }</h3>
        <h4 className="uppercase font-bold text-lg">3. mesto</h4>
      </div>
    </div>
  )
}