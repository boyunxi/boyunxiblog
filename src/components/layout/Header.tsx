"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "首页", href: "/" },
  { label: "分类", href: "/categories" },
  { label: "标签", href: "/tags" },
  { label: "关于", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteName, setSiteName] = useState("薄云隙");
  const [logoText, setLogoText] = useState("隙");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSiteName(data.data.siteName || "薄云隙");
          setLogoText(data.data.logoText || "隙");
        }
      })
      .catch(() => {});
  }, []);

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
    <header className={`w-full sticky top-0 z-50 transition-all duration-700 ${scrolled ? "bg-[var(--bg)]/80 backdrop-blur-md" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-7 h-7 rounded-full border border-[rgba(var(--gold-rgb),0.2)] flex items-center justify-center text-[var(--gold)] text-xs font-serif group-hover:border-[rgba(var(--gold-rgb),0.4)] transition-all duration-500">{logoText}</span>
          <span className="font-serif text-[var(--text-soft)] text-sm tracking-[0.2em] group-hover:text-[var(--text)] transition-colors duration-500">{siteName}</span>
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
          <span className="ml-3">
            <ThemeToggle />
          </span>
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <Link href="/search" className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
            <Search size={16} />
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div className="rift-horizontal" />

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-[var(--bg)]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8">
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
