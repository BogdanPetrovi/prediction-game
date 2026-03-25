export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 mt-3 lg:mt-6 w-full -mb-4 lg:-mb-0 lg:h-12 items-center justify-center">
        <div className="w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold text-4xl rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300">
          Mečevi
        </div>
        <div className="w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold text-4xl rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300">
          Turniri
        </div>
        <div className="w-60 h-full flex justify-center items-center cursor-pointer bg-secondary/80 font-bold text-4xl rounded-2xl border-green-600 border-2 shadow-green-600/30 hover:shadow-xl duration-300">
          Korisnici
        </div>
      </div>
      {children}
    </>
  );
}
