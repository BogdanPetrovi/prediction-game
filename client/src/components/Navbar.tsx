'use client'

import SponsorWidget from "./shared/SponsorWidget"
import NavbarCard from "./ui/NavbarCard"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <>
    <div className="absolute left-0 top-28 w-full flex items-center justify-center">
      <SponsorWidget />
    </div>
    <div className="h-10 flex gap-5 px-4 lg:px-20 mb-30 z-40">
      <NavbarCard placeholder="igraj" active={pathname === '/igraj'} />
      <NavbarCard placeholder="tabela" active={pathname === '/tabela'} />
      <NavbarCard placeholder="istorija" active={pathname === '/istorija'} />
    </div>
    </>
  )
}

export default Navbar
