import { FinishedMatch } from "@/types/PredictionHistory"

export type Outcome = 'all' | 'correct' | 'incorrect'

interface OutcomeFilterProps {
  matches: FinishedMatch[],
  value: Outcome,
  onChange: (outcome: Outcome) => void
}

const options: { outcome: Outcome, label: string }[] = [
  { outcome: 'all', label: 'Sve' },
  { outcome: 'correct', label: 'Pogođene' },
  { outcome: 'incorrect', label: 'Promašene' }
]

export const matchesOutcome = (match: FinishedMatch, outcome: Outcome) =>
  outcome === 'all' || match.isCorrect === (outcome === 'correct')

export default function OutcomeFilter({ matches, value, onChange }: OutcomeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter mečeva"
      className="mt-3 p-1 flex gap-1 rounded-xl border border-white/10 bg-white/[0.04] sg:bg-white sg:border-sg-sand"
    >
      {
        options.map(({ outcome, label }) => {
          const isActive = outcome === value

          return (
            <button
              key={outcome}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(outcome)}
              className={`${isActive
                ? 'bg-gradient-to-br from-[#667EEA] to-[#9333EA] text-white sg:from-sg-red sg:to-sg-wine'
                : 'text-slate-300 cursor-pointer hover:bg-white/10 hover:text-white sg:text-stone-700 sg:hover:bg-sg-red/5 sg:hover:text-sg-crimson'}
                min-h-11 px-1 flex-auto sm:flex-1 flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9333EA] sg:focus-visible:outline-sg-red`}
            >
              {label}
              <span className="tabular-nums font-normal">
                {matches.filter(match => matchesOutcome(match, outcome)).length}
              </span>
            </button>
          )
        })
      }
    </div>
  )
}
