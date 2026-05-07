"use client";

import { useEffect, useState } from "react";

const COOKIE_KEY = "points_notice_v1";

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export default function PointsUpdateModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = parseInt(getCookie(COOKIE_KEY) ?? "0");
    if (seen < 2) setOpen(true);
  }, []);

  function close() {
    const seen = parseInt(getCookie(COOKIE_KEY) ?? "0");
    setCookie(COOKIE_KEY, String(seen + 1), 365);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-secondary border border-[#424860] rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={close} className="absolute top-3 right-3 text-muted hover:text-foreground">
          ✕
        </button>

        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-semibold uppercase tracking-widest border border-green-400/30 bg-green-400/10 rounded-full px-3 py-1 mb-3">
          Novo
        </span>

        <h2 className="text-lg font-semibold text-foreground mb-2">
          Promenili smo sistem bodovanja
        </h2>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Bodovi koje osvajate sada zavise od toga koliko igrača je predvidelo isti ishod — ređa predikcija donosi više poena.
        </p>

        <div className="bg-primary border border-[#424860] rounded-lg p-4 mb-4 space-y-2 text-sm">
          <p className="text-xs text-muted uppercase tracking-widest mb-3">Primeri</p>
          {[
            { pct: "1%",   pts: "+199 pts", color: "bg-green-400" },
            { pct: "20%",  pts: "+180 pts", color: "bg-yellow-400" },
            { pct: "100%", pts: "+100 pts", color: "bg-red-400" },
          ].map(({ pct, pts, color }) => (
            <div key={pct} className="flex items-center justify-between py-1 border-b border-[#313749] last:border-0">
              <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${color}`} />
                <span className="text-foreground">{pct} igrača odabralo pobednika</span>
              </div>
              <span className="font-semibold text-green-400 tabular-nums">{pts}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-start bg-green-400/5 border border-green-400/20 rounded-lg px-3 py-2 mb-4 text-xs text-muted leading-relaxed">
          <span className="text-green-400 mt-0.5">ℹ</span>
          Ovo je i dalje test verzija — radimo na daljim unapređenjima sistema bodovanja.
        </div>

        <button
          onClick={close}
          className="w-full py-2.5 border border-[#424860] rounded-lg text-sm text-foreground hover:bg-primary transition-colors cursor-pointer"
        >
          Razumeo sam
        </button>
      </div>
    </div>
  );
}