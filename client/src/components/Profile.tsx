export default function Profile() {
  return (
    <>
    <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-0">
      <div>
        <h2 className="font-bold text-4xl text-white">Gibo</h2>
        <div className="flex items-center gap-2">
          <h4 className="uppercase tracking-[1.5px] text-lg text-muted">Trenutna forma:</h4>
          <div className="w-4 h-4 rounded-sm bg-green-400 shadow-md shadow-green-400/50"></div>
          <div className="w-4 h-4 rounded-sm bg-green-400 shadow-md shadow-green-400/50"></div>
          <div className="w-4 h-4 rounded-sm bg-red-400 shadow-md shadow-red-400/50"></div>
          <div className="w-4 h-4 rounded-sm bg-green-400 shadow-md shadow-green-400/50"></div>
          <div className="w-4 h-4 rounded-sm bg-red-400 shadow-md shadow-red-400/50"></div>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col items-start md:items-end">
          <h4 className="uppercase tracking-wide text-sm text-muted">Trenutni niz</h4>
          <h4 className="text-3xl text-green-300 font-bold">5</h4>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <h4 className="uppercase tracking-wide text-sm text-muted">Uspešnost</h4>
          <h4 className="text-3xl text-white font-bold">69.5%</h4>
        </div>
      </div>
    </div>

    {/* Profile bar */}
    <div className="mt-4 flex justify-between items-end">
      <div className="flex gap-4">
        <div>
          <h3 className="uppercase text-muted text-xs tracking-tighter">Ukupno</h3>
          <h3 className="text-white text-md font-bold">23</h3>
        </div>
        <div>
          <h3 className="uppercase text-muted text-xs tracking-tighter">Tačnih</h3>
          <h3 className="text-green-300 text-md font-bold">16</h3>
        </div>
        <div>
          <h3 className="uppercase text-muted text-xs tracking-tighter">Netačnih</h3>
          <h3 className="text-red-400 text-md font-bold">7</h3>
        </div>
      </div>
      <h4 className="uppercase text-muted text-xs tracking-tight">Ukupni učinak</h4>
    </div>
    <div className="h-2 w-full rounded-lg bg-secondary relative">
      <div className="absolute h-2 w-[69.5%] bg-green-400 rounded-lg"></div>
    </div>
    </>
  )
}