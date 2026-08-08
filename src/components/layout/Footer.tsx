"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const FOOTER_LOGO_CLICKS = 5;
const FOOTER_LOGO_WINDOW = 2000;

export default function Footer() {
  const [siteName, setSiteName] = useState("薄云隙");
  const [siteDescription, setSiteDescription] = useState("窥见世界裂隙");
  const [logoText, setLogoText] = useState("隙");
  const [copyrightText, setCopyrightText] = useState("薄云隙 · 数字古风档案馆");
  const [icpNumber, setIcpNumber] = useState("");
  const [policeNumber, setPoliceNumber] = useState("");
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSiteName(data.data.siteName || "薄云隙");
          setSiteDescription(data.data.siteDescription || "窥见世界裂隙");
          setLogoText(data.data.logoText || "隙");
          setCopyrightText(data.data.copyrightText || "薄云隙 · 数字古风档案馆");
          setIcpNumber(data.data.icpNumber || "");
          setPoliceNumber(data.data.policeNumber || "");
        }
      })
      .catch(() => {});
  }, []);

  // 页脚彩蛋：2 秒内连点 logo 5 次触发
  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, FOOTER_LOGO_WINDOW);

    if (logoClickCount.current >= FOOTER_LOGO_CLICKS) {
      logoClickCount.current = 0;
      window.dispatchEvent(new CustomEvent("footer-logo-click"));
    }
  };

  return (
    <footer style={{backgroundColor: "var(--bg-deep)"}}>
      <div className="rift-horizontal" />
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="站点印章"
          className="w-8 h-8 rounded-full border border-[rgba(var(--gold-rgb),0.15)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-sm font-serif animate-gold-breathe cursor-pointer transition-colors hover:text-[rgba(var(--gold-rgb),0.6)] hover:border-[rgba(var(--gold-rgb),0.35)]"
        >
          {logoText}
        </button>
        <span className="font-serif text-[var(--text-muted)] text-xs tracking-[0.3em]">{siteName}</span>
        <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.4em] font-serif">{siteDescription}</span>
        <div className="w-16 my-4"><div className="rift-horizontal" /></div>
        <p className="text-[var(--text-ghost)] opacity-50 text-[10px] tracking-wider">&copy; {new Date().getFullYear()} {copyrightText}</p>
        {(icpNumber || policeNumber) && (
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {icpNumber && (
              <a
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text-ghost)] opacity-40 text-[10px] tracking-wider hover:opacity-60 transition-opacity"
              >
                {icpNumber}
              </a>
            )}
            {icpNumber && policeNumber && (
              <span className="hidden sm:inline text-[var(--text-ghost)] opacity-20 text-[10px]">|</span>
            )}
            {policeNumber && (
              <a
                href={`https://beian.mps.gov.cn/#/query/webSearch?code=${encodeURIComponent(policeNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--text-ghost)] opacity-40 text-[10px] tracking-wider hover:opacity-60 transition-opacity"
              >
                <Image
                  src="/images/beian-icon.png"
                  alt=""
                  width={14}
                  height={14}
                  className="opacity-60"
                />
                {policeNumber}
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
