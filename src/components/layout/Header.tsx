"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { label: "首页", href: "/" },
  { label: "分类", href: "/categories" },
  { label: "标签", href: "/tags" },
  { label: "关于", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-mist/80 backdrop-blur-md shadow-[0_1px_12px_rgba(212,175,55,0.04)]"
          : "bg-mist"
      }`}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-3xl text-ink tracking-[0.2em]">
              博云隙
            </span>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-faint text-gold font-serif text-[10px] opacity-80 group-hover:opacity-100 transition-all duration-300">
              印
            </span>
          </Link>

          <div className="w-48 mt-3">
            <div className="cloud-divider" />
          </div>

          <nav className="hidden md:flex items-center gap-3 mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-serif text-ink-muted tracking-widest transition-colors hover:text-ink hover:bg-gold-faint px-3 py-1 rounded-capsule"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
            <Link
              href="/search"
              className="p-2 text-ink-faint/50 hover:text-gold transition-colors"
            >
              <Search size={18} />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2 mt-4">
            <Link
              href="/search"
              className="p-2 text-ink-faint/50 hover:text-gold transition-colors"
            >
              <Search size={18} />
            </Link>
            <button
              className="p-2 text-ink-faint hover:text-ink transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-mist/95 backdrop-blur-sm px-4 pb-6 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-center font-serif text-ink-faint tracking-widest border-b border-ink/5 hover:text-ink transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </header>
  );
}
