import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";

export default function NotFound() {
  return (
    <Providers>
      <div
        className="font-sans min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="relative text-center px-6">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute top-[30%] left-[30%] w-[400px] h-[250px] rounded-full blur-[100px] animate-fog-drift"
                style={{ backgroundColor: "rgba(var(--gold-rgb),0.02)" }}
              />
            </div>

            <div className="relative z-10">
              <div className="rift-line mx-auto animate-rift-glow mb-12" />

              <h1 className="font-serif text-7xl text-[var(--gold)] tracking-[0.15em] gold-text-glow mb-6">
                404
              </h1>

              <p className="text-[var(--text-ghost)] font-serif tracking-[0.4em] text-xs mb-2">
                迷途于此
              </p>

              <p className="text-[var(--text-muted)] text-sm mb-12 max-w-md mx-auto leading-relaxed">
                你所寻找的页面，如同云隙间的光影，已消散无踪。
              </p>

              <div
                className="rift-line mx-auto mb-12"
                style={{ maxWidth: "120px" }}
              />

              <Link href="/" className="portal-link inline-flex">
                返回首页
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Providers>
  );
}
