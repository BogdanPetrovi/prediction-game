import Link from "next/link"
import UserSvg from "./ui/UserSvg"
import Image from "next/image"

const Header = () => {
  return(
    <header className="w-full h-16 bg-secondary/60 border-b border-slate-700 shadow-md shadow-slate-800">
      <div className="w-full h-full flex justify-between items-center px-4 lg:px-15">
        <Link href={'/'} className="flex items-center gap-2 relative">
          <div className="relative size-9">
            <Image
              src={'/logo.png'}
              fill
              alt="Logo"
            />
          </div>
          <h3 className="text-xl font-extrabold text-white cursor-pointer tracking-wide">Counter <span className="text-orange-500">Site</span></h3>
        </Link>
        <UserSvg />
      </div>
    </header>
  )
}

export default Header