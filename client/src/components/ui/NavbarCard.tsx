import Link from "next/link"

const NavbarCard = ({ placeholder, active }: { placeholder: string, active: boolean }) => {
  return (
    <Link 
      href={`/${placeholder}`}
      className={`${active ? "bg-[#3a3e4a] text-white w-48" : "bg-secondary w-44"} capitalize h-full text-center text-lg lg:text-2xl rounded-2xl flex justify-center items-center font-semibold cursor-pointer hover:text-white hover:w-48 duration-200`}>
      <h2>{placeholder}</h2>
    </Link>
  )
}

export default NavbarCard