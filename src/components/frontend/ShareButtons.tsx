"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyLink}
      className="portal-link text-xs"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "已复制" : "复制卷宗链接"}
    </button>
  );
}
