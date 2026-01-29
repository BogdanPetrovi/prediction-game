import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <Header />
        <Navbar />
      </div>
      {children}
    </>
  );
}
