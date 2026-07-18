"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    const start = () => setLoading(true);
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin === window.location.origin && nextUrl.pathname !== window.location.pathname) {
        start();
      }
    };
    const handlePopState = () => start();

    window.addEventListener("app:navigation-start", start);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("app:navigation-start", start);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="route-loading" role="status" aria-live="polite" aria-label="页面加载中">
      <span className="route-loading-cloud" />
      <span className="sr-only">页面加载中</span>
    </div>
  );
}
