import React from "react"

interface AddMatchInputProps {
  title: string,
  placeholder: string,
  type: string,
  value: string,
  setValue: (value: string) => void
}

export default function AddMatchInput({ title, placeholder, type, value, setValue }: AddMatchInputProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <h4 className="text-sm font-medium">{ title }</h4>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-white/5 border rounded-lg px-4 py-3 text-md outline-none"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
    </div>
  )
}
