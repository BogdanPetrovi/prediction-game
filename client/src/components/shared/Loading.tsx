"use client"

import { useEffect, useState } from "react"

const Loading = () => {
  const phrases =["Učitavanje", "Plentovanje bombe", "Rotiranje", "Green what is your problem", "Držanje uglova", "Kupovanje AWP-a sa $4750", "Rush B", "Lomnjenje stola"]
  const [activePhrase, setActivePhrase] = useState(phrases[0])

  useEffect(() => {
    const interval = setInterval(() => {
      const newPhraseIndex = Math.floor(Math.random() * phrases.length)
      setActivePhrase(phrases[newPhraseIndex])
    }, 1500)

    return () => clearInterval(interval)
  }, []) 

  return (
    <div className="w-full mt-50 flex flex-col items-center gap-8 text-3xl font-bold">
      <div className="size-40 bg-secondary rounded-full border-b-2 inset-shadow-sm inset-shadow-black animate-spin"></div>
      <h2 className="animate-bounce">{activePhrase}...</h2>
    </div>
  )
}

export default Loading