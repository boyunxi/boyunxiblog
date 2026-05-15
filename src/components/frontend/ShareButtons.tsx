"use client";

import { useState } from "react";
import { Twitter, Link2, Share2 } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-1">
      <span className="text-ink-muted text-xs mr-3 flex items-center gap-1">
        <Share2 size={12} />
        分享
      </span>
      <a
        href={weiboUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-gold hover:bg-gold/5 transition-all duration-300"
        title="分享到微博"
      >
        <span className="text-[11px] font-bold font-serif">微</span>
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-gold hover:bg-gold/5 transition-all duration-300"
        title="分享到 Twitter"
      >
        <Twitter size={14} />
      </a>
      <button
        onClick={handleCopy}
        className="w-8 h-8 flex items-center justify-center text-ink-muted hover:text-gold hover:bg-gold/5 transition-all duration-300"
        title="复制链接"
      >
        {copied ? (
          <span className="text-[10px] text-gold font-serif">✓</span>
        ) : (
          <Link2 size={14} />
        )}
      </button>
    </div>
  );
}
