import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-5xl font-bold">
        Upssss, deluje kao da ova stranica ne postoji
      </h2>
      <h3 className="text-4xl font-semibold text-white/50">
        Vratite se nazad na&nbsp;
        <Link
          href="/login"
          className="text-blue-400 italic underline cursor-pointer"
        >
          stranicu za prijavljivanje
        </Link>
      </h3>
    </div>
  );
}
