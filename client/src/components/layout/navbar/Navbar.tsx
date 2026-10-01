'use client'

import SponsorWidget from "@/components/shared/SponsorWidget"
import NavbarCard from "./NavbarCard"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()

  return (
    // Tabs and widget share one grid cell from 1180px up, so the tabs stay put while the widget sits beside them.
    // Tabs take up to 680px including padding (600px while hovered). The widget is 400px wide.
    // 1180px = room for the widget on the right. 1700px = switch to the page center (the tabs overlap it slightly until ~1760px). Below 1180px it drops under the tabs.
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
