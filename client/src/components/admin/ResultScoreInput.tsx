import React from "react"

interface ResultScoreInputProps {
  value: string,
  setValue: (value: string) => void
}

export default function ResultScoreInput({ value, setValue }: ResultScoreInputProps) {
  return (
    <input
      type="number"
      min={0}
      placeholder="0"
      className="w-16 bg-white/5 border rounded-lg px-2 py-2 text-center text-xl outline-none"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  )
}
