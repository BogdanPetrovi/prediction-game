import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-[#020617] via-primary to-black pb-2">
      <div className="flex flex-col gap-3">
        <Header />
        <Navbar />
      </div>
      {children}
    </div>
  );
}
