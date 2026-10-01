'use client'

import SponsorWidget from "@/components/shared/SponsorWidget"
import NavbarCard from "./NavbarCard"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className="grid grid-cols-1 gap-3 px-4 lg:px-20">
      <div className="row-start-1 col-start-1 self-start h-10 flex gap-5 z-40">
        <NavbarCard placeholder="igraj" active={pathname === '/igraj'} />
        <NavbarCard placeholder="tabela" active={pathname === '/tabela'} />
        <NavbarCard placeholder="istorija" active={pathname === '/istorija'} />
      </div>
      <div className="row-start-2 min-[1180px]:row-start-1 col-start-1 self-start justify-self-center min-[1180px]:justify-self-end min-[1700px]:justify-self-center w-[400px] max-w-full aspect-[10/3]">
        <SponsorWidget />
      </div>
    </div>
  )
}

export default Navbar
