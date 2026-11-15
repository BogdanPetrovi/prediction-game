import Link from "next/link"

const NavbarCard = ({ placeholder, active }: { placeholder: string, active: boolean }) => {
  return (
    <Link 
      href={`/${placeholder}`}
      className={`${active ? "bg-secondary brightness-200 text-white w-48 sg:bg-sg-wine sg:brightness-100" : "bg-secondary/70 w-44 sg:bg-sg-crimson sg:text-white/85 sg:hover:bg-sg-red"} capitalize h-full text-center text-lg lg:text-2xl rounded-2xl flex justify-center items-center font-semibold cursor-pointer hover:text-white hover:w-48 duration-200
        sg:shadow-md sg:shadow-sg-red/25`}>
      <h2>{placeholder}</h2>
    </Link>
  )
}

export default NavbarCard