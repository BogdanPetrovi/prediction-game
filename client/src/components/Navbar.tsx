'use client'

import NavbarCard from "./ui/NavbarCard"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    <div className="h-10 flex gap-5 px-5 mb-8">
      <NavbarCard placeholder="play" active={pathname === '/play'} />
      <NavbarCard placeholder="leaderboard" active={pathname === '/leaderboard'} />
      <NavbarCard placeholder="history" active={pathname === '/history'} />
    </div>
  )
}

export default Navbar
