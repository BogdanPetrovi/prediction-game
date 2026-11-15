"use client"

import { useId } from "react"

const starPoints = (cx: number, cy: number, outer: number, inner: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? outer : inner
    const angle = -Math.PI / 2 + (i * Math.PI) / 5
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
  }).join(' ')

const stars = Array.from({ length: 5 }, (_, i) => {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5
  return { x: 33 + 8 * Math.cos(angle), y: 28 + 8 * Math.sin(angle) }
})

const CrescentLoader = ({ className = '' }: { className?: string }) => {
  const maskId = useId()

  return (
    <div className={`relative size-16 ${className}`}>
      <div className="absolute inset-0 rounded-full border-[3px] border-sg-red/15" />
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-sg-red animate-spin" />
      <svg viewBox="0 0 56 56" className="absolute inset-2 text-sg-red" fill="currentColor" aria-hidden="true">
        <mask id={maskId}>
          <rect width="56" height="56" fill="white" />
          <circle cx="30" cy="28" r="15" fill="black" />
        </mask>
        <circle cx="24" cy="28" r="17" mask={`url(#${maskId})`} />
        {stars.map((star, i) => (
          <polygon
            key={i}
            className="sg-star"
            style={{ animationDelay: `${i * 0.3}s` }}
            points={starPoints(star.x, star.y, 3.2, 1.3)}
          />
        ))}
      </svg>
    </div>
  )
}

export default CrescentLoader
