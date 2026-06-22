"use client"

import { useEffect, useState } from "react"

const Loading = () => {
  const phrases = ["Učitavanje", "Plentovanje bombe", "Rotiranje", "Green what is your problem", "Držanje uglova", "Kupovanje AWP-a sa $4750", "Rush B", "Lomljenje stola"]
  const [activePhrase, setActivePhrase] = useState(phrases[0])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActivePhrase(phrases[Math.floor(Math.random() * phrases.length)])
        setVisible(true)
      }, 250)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="relative size-14 mb-8">
        <div className="absolute inset-0 rounded-full border-[3px] border-white/8" />
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#9333EA] animate-spin"
        />
        <div
          className="absolute inset-[5px] rounded-full border-[3px] border-transparent border-b-[#F39C12] animate-spin"
          style={{ animationDuration: "1.2s", animationTimingFunction: "linear", animationDirection: "reverse" }}
        />
      </div>
      <h4
        className={`
          text-slate-300 text-lg font-medium tracking-wide transition-opacity duration-250
          ${visible ? "opacity-100" : "opacity-0"}
        `}
      >
        {activePhrase}...
      </h4>
    </div>
  )
}

export default Loading