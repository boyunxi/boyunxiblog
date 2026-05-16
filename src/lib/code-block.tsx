"use client";

import { useState, useCallback, useRef } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="px-2 py-1 rounded text-xs transition-all duration-200"
      style={{
        background: copied ? "rgba(var(--gold-rgb),0.15)" : "rgba(255,255,255,0.06)",
        color: copied ? "var(--gold)" : "var(--text-ghost)",
        border: "1px solid " + (copied ? "rgba(var(--gold-rgb),0.2)" : "rgba(255,255,255,0.08)"),
      }}
      title={copied ? "已复制" : "复制代码"}
    >
      {copied ? "✓ 已复制" : "复制"}
    </button>
  );
}

export function CustomPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const getCodeText = () => {
    if (!ref.current) return "";
    const codeEl = ref.current.querySelector("code");
    return codeEl?.textContent || ref.current.textContent || "";
  };
  return (
    <div className="relative group my-8">
      <pre ref={ref} {...props}>{children}</pre>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <CopyButton text={getCodeText()} />
      </div>
    </div>
  );
}
