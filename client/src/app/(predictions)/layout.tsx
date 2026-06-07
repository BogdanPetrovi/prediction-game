import Header from "@/components/layout/header/Header";
import Navbar from "@/components/layout/navbar/Navbar";
import PointsUpdateModal from "@/components/PointsUpdateModal";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full pb-2 bg-[url('/background.webp')] bg-fixed bg-center bg-cover bg-no-repeat">
      <div className="flex flex-col gap-3">
        <Header />
        <Navbar />
      </div>
      <PointsUpdateModal />
      {children}
    </div>
  );
}
