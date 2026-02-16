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
    <div className="relative select-none" ref={ref}>
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="size-12 cursor-pointer" fill="white" onClick={() => setIsActive(!isActive)}>
        <path d="M8 0a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm0 15a7 7 0 0 1-5.19-2.32 2.71 2.71 0 0 1 1.7-1 13.11 13.11 0 0 0 1.29-.28 2.32 2.32 0 0 0 .94-.34 1.17 1.17 0 0 0-.27-.7 3.61 3.61 0 0 1-1.32-2.87A3.18 3.18 0 0 1 8 4.07a3.18 3.18 0 0 1 2.86 3.42 3.6 3.6 0 0 1-1.32 2.88 1.13 1.13 0 0 0-.27.69 2.68 2.68 0 0 0 .93.31 10.81 10.81 0 0 0 1.28.23 2.63 2.63 0 0 1 1.78 1A7 7 0 0 1 8 15z"/>
      </svg>
      {
        isActive && 
          <div className="w-50 h-30 bg-secondary border-2 absolute top-12 -right-4 rounded-2xl shadow-xl shadow-black/70 flex flex-col divide-y-2 z-50">
            <Link href={'/moje-predikcije'} onClick={() => setIsActive(false)} className="h-1/2 flex justify-center items-center text-xl font-semibold cursor-pointer hover:text-2xl duration-300">Moje predikcije</Link>
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