const CREAM = 'var(--color-sg-cream)'

const body = [
  'M93.5 27',
  'C96 26 99 25.5 101 25.6 C106 27 110 29 112.4 31.3',
  'C116 33 119 35.5 121.8 37.9 C124 38.5 126 39 127.4 39.7',
  'C129.5 41 130.5 43.5 129.7 45.4 C129.3 47.5 128.4 49 127.4 50.1',
  'L126.5 53.8 L122.5 54.2 L121.6 58.8 L120.2 54.6 L100.2 58.5',
  'L116.5 65.6 L118.2 61.2 L119.5 66.9 L121.8 67.9',
  'C121.5 69.5 120.5 70.8 119 71.7 C117.5 74.5 116 76.5 114.3 78.3',
  'C113 79.5 112 80.5 110.5 81.1 C111.5 85 112 88 112.4 92 L112 124',
  'C116 140 119 160 119 177 C119 188 117 196 112.4 205',
  'L46.6 205 C45 190 45 178 46.6 171.3 C46 160 44.5 150 43.8 143 L40 131',
  'C42 118 44.5 108 44.7 98 C45.5 88 46 80 46.6 73.6',
  'C47.5 64 48.5 58 49.4 52.9 C51.5 45 53.5 40 56 36',
  'C59.5 30 63 27 67.3 24.7 C71 22.5 76 21.5 82.5 21.2',
  'C84.5 19 86.5 17 88.5 16.8 C90.5 18 92.5 22.5 93.5 27 Z',
].join(' ')

const capeEdge = 'M112 123 L97 119.5 L85 127 L71 117.5 L58 126 L41 131'

const scaleArea = `${capeEdge} L36 212 L126 212 Z`

const scales = Array.from({ length: 15 }, (_, row) =>
  Array.from({ length: 11 }, (_, col) => {
    const x = 34 + col * 9 + (row % 2) * 4.5
    const y = 114 + row * 6.2
    return `M${x} ${y} a4.5 4.5 0 0 0 9 0`
  }).join(' ')
).join(' ')

const maneGrooves = [
  'M62 30 C54 52 50 84 52 124',
  'M71 26 C63 52 61 88 64 120',
  'M80 30 C74 56 73 92 77 122',
  'M88 38 C86 62 87 96 90 121',
  'M104 86 C105 100 106 112 106 121',
].join(' ')

const tail = [
  'M126.5 115',
  'C129 110 132 104 132 96',
  'C128 99 124.5 100 122.7 103.7',
  'C121 100 118.5 97 116 95.8',
  'C113.5 100 111.5 108 110.5 115 L110 121.5',
  'C104 121 94 122 88 125',
  'C85 132 84 146 84.5 160',
  'C92 158 106 157 116 156',
  'C117 145 119.5 133 121.5 126 C123 121 125 118 126.5 115 Z',
].join(' ')

const tailGrooves = [
  'M88.5 157 C88.5 140 99 129 111 122',
  'M95 157 C96 142 105 131 114.5 121',
  'M102.5 156.5 C104 142 111 131 118 120',
  'M110 156 C112 142 116 131 121.5 119',
].join(' ')

const finRibs = 'M118.5 116 L130.5 99 M118.5 116 L126 102 M118 116 L122.7 105 M117.5 116 L117 98.5 M117 116.5 L112.5 106'

const wave = 'M12 228 C26 214 56 206 94 203 C128 200 162 201 182 208 C194 212 200 220 202 228 Z'

const waveStripes = [
  'M20 219 C46 209 70 213 96 207.5 C122 202.5 152 209 188 211.5',
  'M26 223.5 C54 214 78 218 104 212.5 C130 207.5 158 214.5 194 217.5',
  'M34 228 C62 220 86 224 112 218 C138 213 164 221 199 223',
].join(' ')

const Merlion = () => (
  <g>
    <defs>
      <clipPath id="sg-merlion-body">
        <path d={body} />
      </clipPath>
      <clipPath id="sg-merlion-scales">
        <path d={scaleArea} />
      </clipPath>
    </defs>

    <path className="sg-spout" d="M112 61 C150 52 200 66 232 150 C238 170 241 196 242 226" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path className="sg-spout" style={{ animationDelay: '-0.6s' }} d="M113 63 C148 58 192 76 221 152 C227 172 230 200 231 226" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    <path d="M228 230 q7 -12 14 0 q7 -10 14 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    <path d={body} stroke={CREAM} strokeWidth="6" paintOrder="stroke" strokeLinejoin="round" />

    <g clipPath="url(#sg-merlion-body)">
      <path d={scales} clipPath="url(#sg-merlion-scales)" fill="none" stroke={CREAM} strokeWidth="1.4" />
    </g>

    <g fill="none" stroke={CREAM} strokeLinecap="round" strokeLinejoin="round">
      <path d={capeEdge} strokeWidth="2.4" />
      <path d={maneGrooves} strokeWidth="1.8" />
      <path d="M90 29 C93 48 96 68 106 84" strokeWidth="2.2" />
      <path d="M83 21.5 C84.5 25 87.5 28 92 29.5" strokeWidth="1.8" />
      <path d="M88.4 20.5 L90.3 26" strokeWidth="1.3" />
      <path d="M99 32.5 Q105 29 111 33" strokeWidth="2" />
      <path d="M113 41 C110 46 110 52 114 56" strokeWidth="1.6" />
      <path d="M115 46 l-4 -1 M115 49 l-4.5 0.4 M116 52 l-4 1.4" strokeWidth="1.1" />
      <path d="M124.5 44 q2.5 -1 4 1" strokeWidth="1.4" />
      <path d="M107 72 C109 76 111 78 114 78.3" strokeWidth="1.4" />
    </g>
    <path d="M100.5 37 Q105 33 109.5 36.5 Q105 39.5 100.5 37 Z" fill={CREAM} />

    <path d={tail} stroke={CREAM} strokeWidth="5" paintOrder="stroke" strokeLinejoin="round" />
    <g fill="none" stroke={CREAM} strokeLinecap="round">
      <path d={tailGrooves} strokeWidth="1.5" />
      <path d={finRibs} strokeWidth="1.2" />
      <path d="M116 158 C121 166 121 179 110 182.5 C99 186 88 180.5 88 171 C88 166 91 162 95 161" strokeWidth="2.4" />
      <path d="M104.5 170 C104.5 176 98.5 178.5 94 175.5" strokeWidth="1.6" />
    </g>
    <circle cx="96.4" cy="169.5" r="3.8" fill={CREAM} />

    <path d="M10 240 L14 228 H200 L204 240 Z" />
    <path d={wave} stroke={CREAM} strokeWidth="5" paintOrder="stroke" strokeLinejoin="round" />
    <path d={waveStripes} fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
  </g>
)

export default Merlion
