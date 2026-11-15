import Header from "@/components/layout/header/Header";
import Navbar from "@/components/layout/navbar/Navbar";
import { ACTIVE_THEME } from "@/config/theme";
import SingaporeBackdrop from "@/themes/singapore/SingaporeBackdrop";

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen h-full pb-2 bg-gradient-to-br from-[#0e0b24] via-[#17113d] to-[#060412]
                    sg:isolate sg:text-sg-ink sg:bg-sg-cream sg:bg-[radial-gradient(ellipse_at_top_right,rgba(239,51,64,0.09),transparent_45%)]">
      {ACTIVE_THEME === 'singapore' && <SingaporeBackdrop />}
      <div className="flex flex-col gap-3 mb-4">
        <Header />
        <Navbar />
      </div>
      {children}
    </div>
  );
}
