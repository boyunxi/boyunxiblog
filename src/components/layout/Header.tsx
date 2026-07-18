"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

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

  const handleLogoClick = () => {
    window.dispatchEvent(new CustomEvent("logo-click"));
  };

  return (
    <header className={`w-full sticky top-0 z-50 border-b transition-colors duration-200 ${scrolled ? "bg-[var(--bg)]/95 backdrop-blur-md border-[var(--border)]" : "bg-[var(--bg)]/80 border-transparent"}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" data-logo onClick={handleLogoClick} className="flex items-center gap-3 group">
          <span className="w-8 h-8 rounded-full border border-[rgba(var(--gold-rgb),0.35)] flex items-center justify-center text-[var(--gold)] text-xs font-serif group-hover:border-[var(--gold)] transition-colors">{logoText}</span>
          <span className="font-serif text-[var(--text-soft)] text-sm tracking-[0.14em] group-hover:text-[var(--text)] transition-colors">{siteName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`portal-link ${active ? "text-[var(--text)] border-[rgba(var(--gold-rgb),0.28)]" : ""}`} aria-current={active ? "page" : undefined}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/search" className="portal-link ml-2">
            <Search size={15} aria-hidden="true" />
            <span className="sr-only">搜索</span>
          </Link>
          <span className="ml-3">
            <ThemeToggle />
          </span>
        </nav>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <Link href="/search" aria-label="搜索" className="min-w-10 min-h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
            <Search size={16} aria-hidden="true" />
          </Link>
          <button aria-label={mobileOpen ? "关闭菜单" : "打开菜单"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)} className="min-w-10 min-h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            {mobileOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-navigation" className="md:hidden fixed inset-0 top-[73px] bg-[var(--bg)] z-40 flex flex-col items-center justify-center gap-4 border-t border-[var(--border)]">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="portal-link text-base min-w-40 justify-center" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
