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
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-700 ${scrolled ? "bg-void/80 backdrop-blur-md" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-7 h-7 rounded-full border border-gold/20 flex items-center justify-center text-gold/50 text-xs font-serif group-hover:border-gold/40 group-hover:text-gold/70 transition-all duration-500">隙</span>
          <span className="font-serif text-pale-soft text-sm tracking-[0.2em] group-hover:text-pale transition-colors duration-500">薄云隙</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="portal-link">
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="portal-link ml-2">
            <Search size={14} />
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <Link href="/search" className="text-pale-muted hover:text-gold/60 transition-colors">
            <Search size={16} />
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-pale-muted hover:text-pale transition-colors">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className="rift-horizontal" />

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-void/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="portal-link text-base" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
