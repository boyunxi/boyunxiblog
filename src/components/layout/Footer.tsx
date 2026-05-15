import Link from "next/link";
import { Github, Mail, Rss } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="bg-ink text-mist/70">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gold-faint text-gold font-serif text-xl flex items-center justify-center animate-seal-stamp">
                印
              </div>
            </div>

            <span className="font-display text-2xl text-mist/40 tracking-[0.3em]">
              博云隙
            </span>

            <span className="text-xs text-mist/25 tracking-[0.4em] font-serif">
              以云为伴 · 以笔为友
            </span>

            <div className="w-24 my-2">
              <div className="cloud-divider" />
            </div>

            <nav className="flex items-center gap-8 text-xs font-serif tracking-widest">
              <Link href="/" className="text-mist/30 hover:text-gold transition-colors duration-300">
                首页
              </Link>
              <Link href="/categories" className="text-mist/30 hover:text-gold transition-colors duration-300">
                分类
              </Link>
              <Link href="/tags" className="text-mist/30 hover:text-gold transition-colors duration-300">
                标签
              </Link>
              <Link href="/about" className="text-mist/30 hover:text-gold transition-colors duration-300">
                关于
              </Link>
            </nav>

            <div className="flex items-center gap-5 mt-2">
              <Link
                href="https://github.com"
                target="_blank"
                className="w-8 h-8 rounded-full flex items-center justify-center text-mist/25 hover:text-gold transition-colors duration-300 border border-mist/10 hover:border-gold/30"
              >
                <Github size={14} />
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="w-8 h-8 rounded-full flex items-center justify-center text-mist/25 hover:text-gold transition-colors duration-300 border border-mist/10 hover:border-gold/30"
              >
                <Mail size={14} />
              </Link>
              <Link
                href="/rss.xml"
                className="w-8 h-8 rounded-full flex items-center justify-center text-mist/25 hover:text-gold transition-colors duration-300 border border-mist/10 hover:border-gold/30"
              >
                <Rss size={14} />
              </Link>
            </div>

            <p className="text-[10px] text-mist/15 mt-4 tracking-wider">
              © {new Date().getFullYear()} 博云隙 · 云隙留痕
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
