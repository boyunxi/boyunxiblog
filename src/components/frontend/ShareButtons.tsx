"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Check, Share2, X } from "lucide-react";
import {
  FaXTwitter,
  FaFacebook,
  FaTelegram,
  FaWeixin,
  FaLink,
} from "react-icons/fa6";

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fullUrl = origin ? `${origin}${url}` : url;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      name: "Twitter / X",
      icon: <FaXTwitter size={18} />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <FaFacebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <FaTelegram size={18} />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: "微信",
      icon: <FaWeixin size={18} />,
      href: "#",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-flex items-center gap-3 flex-wrap" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-ghost)] hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-300 font-serif tracking-wide"
      >
        <Share2 size={12} />
        分享
      </button>

      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-56 scroll-vessel incomplete-border p-4 z-50 animate-fade-up"
          style={{
            backgroundColor: "var(--bg)",
            animationDuration: "0.2s",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[var(--text-soft)] text-xs font-serif tracking-[0.2em]">
              分享至
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--text-ghost)] hover:text-[var(--text-muted)] transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target={p.href === "#" ? undefined : "_blank"}
                rel={p.href === "#" ? undefined : "noopener noreferrer"}
                onClick={p.onClick}
                className="flex items-center gap-3 px-3 py-2 rounded-sm text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[rgba(var(--gold-rgb),0.05)] transition-all duration-300 group"
              >
                <span className="text-[var(--text-ghost)] group-hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors">
                  {p.icon}
                </span>
                <span>{p.name}</span>
                {p.name === "微信" && copied && (
                  <span className="ml-auto text-[10px] text-[rgba(var(--gold-rgb),0.6)]">已复制</span>
                )}
              </a>
            ))}
          </div>

          <div className="rift-horizontal my-2" />

          <button
            onClick={copyLink}
            className="flex items-center gap-3 px-3 py-2 rounded-sm text-xs w-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[rgba(var(--gold-rgb),0.05)] transition-all duration-300 group"
          >
            <span className="text-[var(--text-ghost)] group-hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors">
              {copied ? <Check size={18} /> : <FaLink size={18} />}
            </span>
            <span>{copied ? "已复制链接" : "复制链接"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
