import Link from "next/link"
import UserSvg from "./ui/UserSvg"

const Header = () => {
  return(
    <header className="w-full h-16 bg-secondary shadow-md shadow-black/20">
      <div className="w-full h-full flex justify-between items-center px-6">
        <Link href={'/'} className="text-3xl font-bold text-white cursor-pointer">Prediction game</Link>
        <UserSvg />
      </div>
    </header>
  )
}

export default Header