import Link from "next/link";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const linkDesign = "w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300 "
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 mt-3 lg:mt-6 w-full -mb-4 lg:-mb-0 lg:h-12 items-center justify-center">
        <Link href={'/admin/kontrolna-tabla'} className={linkDesign + 'text-2xl'}>
          Kontrolna tabla
        </Link>
        <Link href={'/admin/mecevi'} className={linkDesign + 'text-4xl'}>
          Mečevi
        </Link>
        <Link href={'/admin/turniri'} className={linkDesign + 'text-4xl'}>
          Turniri
        </Link>
        <Link href={'/admin/nagrade'} className={linkDesign + 'text-4xl'}>
          Nagrade
        </Link>
      </div>
      {children}
    </>
  );
}
