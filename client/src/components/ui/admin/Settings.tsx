'use client'

interface SettingsProps {
  isActive: boolean,
  setIsActive: Dispatch<SetStateAction<boolean>>,
  isParent: boolean,
  setIsParent: Dispatch<SetStateAction<boolean>>
}

import { Dispatch, SetStateAction } from "react"
import ParentEvent from "./ParentEvent"

export default function Settings({ isActive, isParent, setIsActive, setIsParent }: SettingsProps) { 
  return (
    <>
      <div className="px-9 py-8 border-green-500/60 border-t-1 slide-down">
        <p className="flex items-center text-sm font-bold tracking-[3px] uppercase text-muted mb-3">
          Status turnira
        </p>
        <div className="flex gap-2">
          <div 
            className={`${isActive ? 'border-green-500' : ''} flex-1 text-center px-4 py-3 rounded-lg border bg-admin-input text-muted text-sm cursor-pointer select-none duration-200`}
            onClick={() => setIsActive(true)}>
            ✅&nbsp; Aktivan
          </div>
          <div 
            className={`${!isActive ? 'border-red-500/50' : ''} flex-1 text-center px-4 py-3 rounded-lg border bg-admin-input text-muted text-sm cursor-pointer select-none duration-300`}
            onClick={() => setIsActive(false)}>
              ⏸&nbsp; Neaktivan
          </div>
        </div>
      </div>

      <div className="px-9 py-8">
        <p className="flex items-center text-sm font-bold tracking-[3px] uppercase text-muted mb-3">
          Parent turnir
        </p>
        <div className="flex gap-2 mb-5">
          <div 
            className={`${isParent ? 'border-green-500' : ''} flex-1 text-center px-4 py-3 rounded-lg border bg-admin-input text-muted text-sm cursor-pointer select-none duration-200`}
            onClick={() => setIsParent(true)}>
            Da, postoji parent turnir
          </div>
          <div 
            className={`${!isParent ? 'border-red-500/50' : ''} flex-1 text-center px-4 py-3 rounded-lg border bg-admin-input text-muted text-sm cursor-pointer select-none duration-200`}
            onClick={() => setIsParent(false)}>
            Ne, nema parent turnira
          </div>
        </div>

        {
          isParent && <ParentEvent />
        }

      </div>
    </>
  )
}