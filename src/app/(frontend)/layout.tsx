import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import ReadingProgress from "@/components/ui/ReadingProgress";
import BackToTop from "@/components/ui/BackToTop";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="bg-mist font-sans min-h-screen flex flex-col">
        <ReadingProgress />
        <Header />
        <main className="flex-1 min-h-screen max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Providers>
  );
}
