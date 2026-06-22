import Header from "@/components/layout/header/Header";
import Navbar from "@/components/layout/navbar/Navbar";
import PointsUpdateModal from "@/components/PointsUpdateModal";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full pb-2 bg-gradient-to-br from-[#0e0b24] via-[#17113d] to-[#060412]">
      <div className="flex flex-col gap-3">
        <Header />
        <Navbar />
      </div>
      <PointsUpdateModal />
      {children}
    </div>
  );
}
