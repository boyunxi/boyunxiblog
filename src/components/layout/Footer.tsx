"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [siteName, setSiteName] = useState("薄云隙");
  const [siteDescription, setSiteDescription] = useState("窥见世界裂隙");
  const [logoText, setLogoText] = useState("隙");
  const [copyrightText, setCopyrightText] = useState("薄云隙 · 数字古风档案馆");
  const [icpNumber, setIcpNumber] = useState("");

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
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer style={{backgroundColor: "var(--bg-deep)"}}>
      <div className="rift-horizontal" />
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border border-[rgba(var(--gold-rgb),0.15)] flex items-center justify-center text-[rgba(var(--gold-rgb),0.3)] text-sm font-serif animate-gold-breathe">{logoText}</div>
        <span className="font-serif text-[var(--text-muted)] text-xs tracking-[0.3em]">{siteName}</span>
        <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.4em] font-serif">{siteDescription}</span>
        <div className="w-16 my-4"><div className="rift-horizontal" /></div>
        <p className="text-[var(--text-ghost)] opacity-50 text-[10px] tracking-wider">&copy; {new Date().getFullYear()} {copyrightText}</p>
        {icpNumber && (
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-ghost)] opacity-40 text-[10px] tracking-wider hover:opacity-60 transition-opacity"
          >
            {icpNumber}
          </a>
        )}
      </div>
    </footer>
  );
}
