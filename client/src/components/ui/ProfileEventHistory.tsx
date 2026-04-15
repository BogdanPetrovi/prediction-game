import Image from "next/image";

export default function ProfileEventHistory() {
  return (
    <>
      <div className="flex items-center justify-between gap-2 mt">
        <div className="flex gap-2">
          <Image 
            src="https://img-cdn.hltv.org/eventlogo/nYADQoBBHeOXRjBW1kFOra.png?ixlib=java-2.1.0&w=200&s=9951330163ee8e7abf56775d5ee517e3" 
            alt="Logo turnira"
            width={28}
            height={28}
            unoptimized
          />
          <h3 className="text-lg font-semibold tracking-wider">IEM Rio 2026</h3>
        </div>
        <h3 className="font-semibold text-muted ">
          <span className="text-green-400 pr-1.5">4</span>
          -
          <span className="text-red-400 pl-1.5">1</span>
        </h3>
      </div>
      <h4 className="ml-9 -mt-1 text-muted text-xs">13. Apr - 19 Apr</h4>

      <div className="bg-secondary rounded-xl border border-zinc-700 overflow-hidden mt-2">
        <div className="h-13 bg-secondary border-b border-zinc-700 px-2 flex items-center gap-3 hover:brightness-120 duration-200">
          <div className="size-3 rounded-full bg-green-400 shadow-md shadow-green-400/50"></div>
          <div className="flex gap-1">
            <Image
              src="https://img-cdn.hltv.org/teamlogo/yeXBldn9w8LZCgdElAenPs.png?ixlib=java-2.1.0&w=50&s=15eaba0b75250065d20162d2cb05e3e6" 
              alt="Vitality logo" 
              width={22}
              height={20}
              unoptimized
            />
            <h4 className="font-semibold md:tracking-wider">Vitality</h4>
          </div>
          <h4 className="text-muted/60 font-bold text-sm">VS</h4>
          <div className="flex gap-1">
            <Image
              className="opacity-60"
              src="https://img-cdn.hltv.org/teamlogo/Lyr7VJ-litGOwnRBu_8K5q.png?ixlib=java-2.1.0&w=50&s=4beac26b74d83ad2b1753ba2c5cb575d" 
              alt="RED Canids logo" 
              width={22}
              height={20}
              unoptimized
            />
            <h4 className="font-semibold md:tracking-wider text-muted/80">RED Canids</h4>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <h3 className="min-w-max font-bold text-white md:tracking-[2px] text-xs md:text-md">2-0</h3>
            <h3 className="min-w-max text-muted font-semibold text-xs md:text-sm tracking-tighter">13. Apr, 18:00</h3>
          </div>
        </div>
      </div>
    </>
  )
}