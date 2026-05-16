"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
      className="copy-btn"
      title={copied ? "已复制" : "复制代码"}
    >
      {copied ? "✓" : "复制"}
    </button>
  );
}

export function CustomPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [codeText, setCodeText] = useState("");

  useEffect(() => {
    if (!ref.current) return;
    const codeEl = ref.current.querySelector("code");
    setCodeText(codeEl?.textContent || ref.current.textContent || "");
  }, []);

  return (
    <div className="code-block-wrapper">
      <pre ref={ref} {...props}>{children}</pre>
      <CopyButton text={codeText} />
    </div>
  );
}
