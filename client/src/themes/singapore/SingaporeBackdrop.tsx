import Orchid from "./Orchid"
import Merlion from "./Merlion"

const MERLION_SCALE = 1.5
const CITY_OFFSET = 140
const WIDTH = 1600 + CITY_OFFSET
const GROUND = 240

const spikyDome = (cx: number, rx: number, ry: number, spikes: number) => {
  const points = Array.from({ length: spikes * 2 + 1 }, (_, i) => {
    const angle = Math.PI - (Math.PI * i) / (spikes * 2)
    const grow = i % 2 === 0 ? 0 : 5
    const x = cx + (rx + grow) * Math.cos(angle)
    const y = GROUND - (ry + grow) * Math.sin(angle)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return `M${points.join(' L')} Z`
}

const supertree = (cx: number, top: number, width: number) =>
  `M${cx - 6} ${GROUND} L${cx - 3} ${top + 46} L${cx - width / 2} ${top + 6} Q${cx} ${top - 6} ${cx + width / 2} ${top + 6} L${cx + 3} ${top + 46} L${cx + 6} ${GROUND} Z`

const mbsTower = (x: number) =>
  `M${x} ${GROUND} L${x + 11} 84 L${x + 67} 84 L${x + 78} ${GROUND} Z M${x + 37} 100 L${x + 41} 100 L${x + 47} ${GROUND} L${x + 31} ${GROUND} Z`

const waves = `M0 ${GROUND - 6}` + ' q10 -4 20 0 t20 0'.repeat(WIDTH / 40)

const backBuildings: [number, number, number][] = [[300, 95, 30], [380, 40, 26], [450, 75, 24], [540, 52, 30], [610, 120, 28]]
const frontBuildings: [number, number, number][] = [[270, 150, 40], [312, 112, 34], [348, 72, 42], [392, 128, 30], [424, 92, 40], [514, 102, 36], [552, 138, 40], [594, 165, 44]]

const FLYER = { cx: 880, cy: 118, r: 68 }
const spokes = Array.from({ length: 16 }, (_, i) => (i * Math.PI * 2) / 16)
const capsules = Array.from({ length: 28 }, (_, i) => (i * Math.PI * 2) / 28)

const Skyline = () => (
  <svg
    viewBox={`0 0 ${WIDTH} ${GROUND}`}
    preserveAspectRatio="xMinYMax slice"
    className="absolute bottom-0 inset-x-0 w-full h-[clamp(150px,14vw,420px)] opacity-[0.14]"
    fill="currentColor"
    overflow="visible"
  >
    <g transform={`translate(0 ${GROUND * (1 - MERLION_SCALE)}) scale(${MERLION_SCALE})`}>
      <Merlion />
    </g>
    <g transform={`translate(${CITY_OFFSET} 0)`}>
      <g fillOpacity="0.45">
        {backBuildings.map(([x, top, w]) => <rect key={x} x={x} y={top} width={w} height={GROUND - top} />)}
        <path d={supertree(1478, 150, 44)} />
      </g>
      {frontBuildings.map(([x, top, w]) => <rect key={x} x={x} y={top} width={w} height={GROUND - top} />)}
      <rect x="368" y="46" width="2" height="26" />
      <path d={`M466 ${GROUND} V70 L512 58 V${GROUND} Z`} />

      <path d={spikyDome(690, 40, 44, 11)} />
      <path d={spikyDome(752, 30, 34, 9)} />

      <g className="sg-wheel">
        <circle cx={FLYER.cx} cy={FLYER.cy} r={FLYER.r} fill="none" stroke="currentColor" strokeWidth="4" />
        {spokes.map(a => (
          <line
            key={a}
            x1={FLYER.cx}
            y1={FLYER.cy}
            x2={FLYER.cx + FLYER.r * Math.cos(a)}
            y2={FLYER.cy + FLYER.r * Math.sin(a)}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
        {capsules.map(a => (
          <circle key={a} cx={FLYER.cx + FLYER.r * Math.cos(a)} cy={FLYER.cy + FLYER.r * Math.sin(a)} r="3.5" />
        ))}
      </g>
      <path d={`M${FLYER.cx} ${FLYER.cy} L850 ${GROUND} M${FLYER.cx} ${FLYER.cy} L910 ${GROUND}`} stroke="currentColor" strokeWidth="5" />
      <rect x="826" y="222" width="108" height="18" rx="4" />

      {[1000, 1110, 1220].map(x => <path key={x} fillRule="evenodd" d={mbsTower(x)} />)}
      <path d="M988 74 Q1170 64 1352 68 L1360 74 L1350 82 Q1170 78 996 84 Z" />

      {[[1392, 140, 52], [1446, 96, 72], [1510, 60, 88], [1566, 108, 64]].map(([cx, top, w]) => (
        <path key={cx} d={supertree(cx, top, w)} />
      ))}
      <path d="M1446 150 Q1478 162 1510 146" fill="none" stroke="currentColor" strokeWidth="3" />
    </g>

    <rect x="0" y={GROUND - 4} width={WIDTH} height="4" />
    <path d={waves} fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const SingaporeBackdrop = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden text-sg-red">
    <div className="sg-float absolute right-[6%] top-[22%] md:top-[30%] opacity-[0.12] md:opacity-[0.16]">
      <Orchid className="size-14 md:size-20 rotate-[18deg]" />
    </div>
    <div className="sg-float hidden md:block absolute left-[4%] top-[40%] opacity-[0.16]" style={{ animationDelay: '-2.5s' }}>
      <Orchid className="size-24 -rotate-12" />
    </div>
    <div className="sg-float hidden lg:block absolute right-[14%] bottom-[clamp(180px,17vw,470px)] opacity-[0.14]" style={{ animationDelay: '-5s' }}>
      <Orchid className="size-12 rotate-[40deg]" />
    </div>
    <div className="sg-float hidden lg:block absolute left-[12%] top-[18%] opacity-[0.12]" style={{ animationDelay: '-4s' }}>
      <Orchid className="size-10 rotate-[-30deg]" />
    </div>
    <Skyline />
  </div>
)

export default SingaporeBackdrop
