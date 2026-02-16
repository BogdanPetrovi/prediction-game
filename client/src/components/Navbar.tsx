'use client'

import NavbarCard from "./ui/NavbarCard"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className="h-10 flex gap-5 px-5 mb-8">
      <NavbarCard placeholder="igraj" active={pathname === '/igraj'} />
      <NavbarCard placeholder="tabela" active={pathname === '/tabela'} />
      <NavbarCard placeholder="istorija" active={pathname === '/istorija'} />
    </div>
  )
}

export default Navbar
