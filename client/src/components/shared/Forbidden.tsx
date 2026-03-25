import Link from "next/link"

const Forbidden = () => {
  return(
    <div className="w-screen h-96 mt-30 flex flex-col items-center gap-4">
      <h2 className="text-3xl font-bold">Nemate dozvolu za pristup ovoj stranici (403)</h2>
      <Link href={'/igraj'} className="text-3xl bg-secondary w-100 text-center rounded-2xl p-3 cursor-pointer">
        Vratite se na sigurno
      </Link>
    </div>
  )
}

export default Forbidden