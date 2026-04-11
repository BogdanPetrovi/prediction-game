'use client'

import backend from "@/services/api/backend"
import { Dispatch, SetStateAction } from "react"

interface ParentEventProps {
  parentEventValue: string,
  setParentEventValue: (value: string) => void,
  setIsParentVerified: (isVerified: boolean) => void
}

export default function ParentEvent({ parentEventValue, setIsParentVerified, setParentEventValue }: ParentEventProps) {
  const checkParent = async () => {
    try {
      const result = await backend.get(`/admin/search-parent-event?eventId=${parentEventValue}`)
      if(result.status === 200)
        setIsParentVerified(true)
    } catch (err) {
      console.log(err)
      setIsParentVerified(false)
      setParentEventValue("")
    }
  }

  return (
    <div className="flex flex-col gap-3 slide-down">
      <h3 className="text-xs font-medium text-muted tracking-wide">ID Parent Turnira</h3>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="npr. 100023"
          value={parentEventValue}
          onChange={(e) => setParentEventValue(e.target.value)}
          className="w-full bg-surface2 border border-admin-border rounded-lg px-4 py-4 text-white/95 text-md outline-none duration-200 appearance-none"
        />
        <button
          onClick={checkParent}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-admin-border text-muted text-sm font-bold cursor-pointer duration-300 hover:border-white/80 hover:text-white/80 whitespace-nowrap">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Pretraži
        </button>
      </div>
    </div>
  )
}