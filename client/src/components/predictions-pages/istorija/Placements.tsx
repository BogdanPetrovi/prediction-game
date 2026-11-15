import { Placements as PlacementsType } from "@/types/EventHistory"

interface PlacementsProps {
  placements: PlacementsType
}

const placementConfig = [
  {
    key: "firstPlace",
    rank: "1",
    label: "Pobednik",
    textColor: "text-amber-400 sg:text-amber-600",
    rowBg: "bg-amber-400/20 sg:bg-amber-50",
  },
  {
    key: "secondPlace",
    rank: "2",
    label:"",
    textColor: "text-slate-300 sg:text-slate-500",
    rowBg: "bg-slate-300/20 sg:bg-slate-50",
  },
  {
    key: "thirdPlace",
    rank: "3",
    label: "",
    textColor: "text-orange-400 sg:text-amber-700",
    rowBg: "bg-amber-700/20 sg:bg-orange-50/70",
  },
] as const

export default function Placements({ placements }: PlacementsProps) {
  return (
    <>
      {placementConfig.map(({ key, rank, label, textColor, rowBg }) => {
        const name = placements[key]
        if (!name) return null

        return (
          <div
            key={key}
            className={`flex items-center gap-5 px-5 py-4 ${rowBg}`}
          >
            <span className={`text-3xl font-black w-6 leading-none ${textColor}`}>
              {rank}
            </span>

            <span
              className={`font-bold text-lg flex-1 ${
              key === "firstPlace" ? "text-white sg:text-sg-ink" : "text-slate-300 sg:text-stone-700"
              }`}
            >
              {name}
            </span>

            <span className={`text-xs uppercase tracking-widest font-semibold ${textColor} opacity-70`}>
              {label}
            </span>
          </div>
        )
      })}
    </>
  )
}