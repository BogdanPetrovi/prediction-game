'use client'

import PreviewEvent from "@/components/ui/admin/PreviewEvent";
import SearchEvent from "@/components/ui/admin/SearchEvent";
import Settings from "@/components/ui/admin/Settings";
import { useState } from "react";

export default function Events() {
  const [isPreview, setIsPreview] = useState(false)
  const [isSettings, setIsSettings] = useState(false)
  const [event, setEvent] = useState()

  const checkEvent = (id: number) => {
    setIsPreview(true)
  }

  const onConfirm = () => {
    setIsSettings(true)
  } 

  return (
    <div className="w-screen h-[calc(100vh-4.5rem)] pt-12 flex flex-col items-center">
      <div className="w-full bg-[#2b3040] max-w-[780px] border border-green-500 rounded-[14px] relative z-10 overflow-hidden">
        <SearchEvent onCheck={checkEvent} />

        {/* <div className="px-9 pb-5">Loading...</div> */}

        {
          isPreview && <PreviewEvent onConfirm={onConfirm} />
        }

        {
          isSettings && <Settings />
        }
        
      </div>
    </div>
  )
}