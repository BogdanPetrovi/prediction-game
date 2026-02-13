'use client'

import DiscordLogo from "@/components/ui/DiscordLogo";
import { redirect } from "next/navigation";

export default function Login() {


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-primary to-black">
      <div className="rounded-2xl shadow-xl bg-[#020617]/10 border border-white/10 p-8 flex flex-col items-center text-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Predikcije
          </h1>
          <p className="text-sm text-white/60">
            Svojke predikcije, igraj i osvoji nagrade
          </p>
        </div>

        <button
          className="w-full p-2 flex items-center justify-center gap-2 text-xl font-bold bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl cursor-pointer shadow-lg duration-300"
          onClick={() => redirect('https://api.countersite.gg/auth/discord')}
        >
          <DiscordLogo />
          Prijavi se putem Discorda
        </button>

        <p className="text-xs text-white/40">
          Nastavkom prihvataš korišćenje aplikacije za esport predikcije
        </p>
      </div>
    </div>
  );
}
