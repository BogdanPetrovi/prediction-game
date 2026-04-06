import Link from "next/link";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 mt-3 lg:mt-6 w-full -mb-4 lg:-mb-0 lg:h-12 items-center justify-center">
        <Link href={'/admin/mecevi'} className="w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold text-4xl rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300">
          Mečevi
        </Link>
        <Link href={'/admin/turniri'} className="w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold text-4xl rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300">
          Turniri
        </Link>
        <Link href={'/admin/korisnici'} className="w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold text-4xl rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300">
          Korisnici
        </Link>
      </div>
      {children}
    </>
  );
}
