import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-5xl font-bold">
        Ooops... Looks like this page doesn&apos;t exist
      </h2>
      <h3 className="text-4xl font-semibold text-white/50">
        Go back to&nbsp;
        <Link
          href="/login"
          className="text-blue-400 italic underline cursor-pointer"
        >
          login page
        </Link>
      </h3>
    </div>
  );
}
