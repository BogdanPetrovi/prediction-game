import DiscordLogo from "@/components/auth/DiscordLogo";
import Image from "next/image";

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-br from-[#0e0b24] via-[#17113d] to-[#060412]">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-[#9333EA]/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 size-[28rem] rounded-full bg-[#F39C12]/15 blur-3xl" />

      <div className="slide-down relative w-full max-w-md bg-secondary/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/40 p-6 sm:p-8 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative size-20">
            <Image
              src={'/logo.webp'}
              fill
              alt="Logo"
            />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Counter <span className="text-orange-500">Site</span>
            </h1>
            <p className="text-lg font-semibold text-white/60">Counter-Strike predikcije</p>
          </div>
        </div>

        <div aria-hidden className="w-full flex flex-col gap-2 select-none">
          <div className="relative w-full h-16 bg-gradient-to-l from-30% from-[#667EEA] to-[#9333EA] rounded-xl flex items-center">
            <div className="w-1/2 h-full flex items-center gap-3 pl-4">
              <span className="text-5xl font-bold text-white drop-shadow-xl/50">?</span>
              <span className="bg-white/20 px-1 py-1 rounded-lg backdrop-blur-md font-semibold text-sm text-white">142pts</span>
            </div>
            <div
              className="absolute top-0 right-0 w-1/2 h-full flex flex-row-reverse items-center gap-3 pr-4 rounded-r-xl bg-gradient-to-l from-[#F39C12] to-[#FFA500]"
              style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 10% 100%)' }}
            >
              <span className="text-5xl font-bold text-white opacity-50 drop-shadow-xl/50">?</span>
              <span className="bg-black/25 px-1 py-1 rounded-lg backdrop-blur-md font-semibold text-sm text-white opacity-50">158pts</span>
            </div>
          </div>
          <p className="text-sm text-white/60">
            Pogodi pobednika i osvoji poene. Iznenađenja nose više.
          </p>
        </div>

        <a
          href="https://api.countersite.gg/auth/discord"
          className="w-full h-14 flex items-center justify-center gap-3 rounded-3xl
                    bg-gradient-to-r from-[#9333EA] to-[#667EEA] text-white text-base sm:text-xl font-bold
                    shadow-lg shadow-black/40 hover:brightness-110 active:brightness-125
                    hover:scale-[1.02] active:scale-[0.97] duration-300"
        >
          <span className="flex shrink-0 size-7 sm:size-9 [&>svg]:size-full">
            <DiscordLogo />
          </span>
          Prijavi se putem Discorda
        </a>

        <p className="text-xs text-white/40">
          Nastavkom prihvataš korišćenje aplikacije za esport predikcije
        </p>
      </div>
    </div>
  );
}
