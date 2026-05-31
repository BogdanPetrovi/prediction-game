'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import backend from "@/services/api/backend"
import { redirect } from "next/navigation"

const UserSvg = () => {
  const [isActive, setIsActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogOut = async () => {
    const response = await backend.post('/auth/logout')
    
    if(response.status === 200)
      redirect('/login')
  }

  return(
    <div className="relative select-none opacity-95 z-100" ref={ref}>
      <svg className="size-9 text-slate-400 hover:text-white cursor-pointer duration-300" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" onClick={() => setIsActive(!isActive)}>
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
      {
        isActive && 
          <div className="w-50 h-30 bg-secondary border-2 absolute top-12 -right-4 rounded-2xl shadow-xl shadow-black/70 flex flex-col divide-y-2">
            <Link href={'/profil'} onClick={() => setIsActive(false)} className="h-1/2 flex justify-center items-center text-xl font-semibold cursor-pointer hover:text-2xl duration-300">Profil</Link>
            <div 
              className="h-1/2 flex justify-center items-center text-xl font-semibold text-red-600 cursor-pointer hover:text-2xl duration-300"
              onClick={handleLogOut}>
              Izloguj se
            </div>
          </div>
      }
    </div>
  )
}

export default UserSvg