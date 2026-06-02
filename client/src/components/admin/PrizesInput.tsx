import React, { Dispatch, SetStateAction } from "react"

interface PrizesInputProps {
  title: string,
  placeholder: string,
  type: string,
  value: string,
  setValue: Dispatch<SetStateAction<string>>
}

export default function PrizesInput({ title, placeholder, type, value, setValue }: PrizesInputProps) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <h4 className="text-xs font-medium text-muted tracking-wide">{ title }</h4>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-admin-input border border-admin-border rounded-lg px-4 py-3 text-[#e8ede8] text-md outline-none transition-all duration-200 focus:border-green-500/60"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
    </div>
  )
}