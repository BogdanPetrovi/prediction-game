'use client'

import { useState } from "react"

interface SearchEventProps {
  onCheck: (id: number) => void,
  isSearching: boolean
}

export default function SearchEvent ({ onCheck, isSearching }: SearchEventProps) {
  const [id, setId] = useState("")

  const handleClick = () => {
    if(id === "")
      return

    setId("")
    onCheck(Number(id))
  }

  return(
      <div className="px-9 py-8">
        <p className="text-sm font-bold tracking-[3px] uppercase text-muted mb-3">
          Pretraga turnira
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex flex-col gap-2 flex-1">
            <h4 className="text-xs font-medium text-muted tracking-wide">ID Turnira</h4>
            <input
              type="number"
              value={id}
              onChange={(val) => setId(val.target.value)}
              placeholder="npr. 8042"
              className="w-full bg-admin-input border border-admin-border rounded-lg px-4 py-3 text-[#e8ede8] text-md outline-none transition-all duration-200 focus:border-green-500/60"
            />
          </div>
          {
            isSearching ? 
            <button 
              className="inline-flex items-center gap-2 px-6 py-[13px] rounded-lg bg-white/5 text-white text-sm font-bold tracking-wide cursor-not-allowed"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Pretraživanje...
            </button>
            :
            <button 
              className="inline-flex items-center gap-2 px-6 py-[13px] rounded-lg text-white text-sm font-bold tracking-wide cursor-pointer duration-300 hover:-translate-y-px hover:bg-green-500 active:translate-y-0"
              onClick={handleClick}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              Pretraži
            </button>
          }
        </div>
      </div>
  )
}