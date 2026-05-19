import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import ReadingProgress from "@/components/ui/ReadingProgress";
import BackToTop from "@/components/ui/BackToTop";
import EasterEggs from "@/components/EasterEggs";
import PageViewTracker from "@/components/ui/PageViewTracker";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="font-sans min-h-screen flex flex-col" style={{backgroundColor: "var(--bg)"}}>
        <ReadingProgress />
        <Header />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <EasterEggs />
        <PageViewTracker />
      </div>
    </Providers>
  );
}
