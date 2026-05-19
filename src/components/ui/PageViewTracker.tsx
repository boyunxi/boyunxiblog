"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sendPageView = () => {
      fetch("/api/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: window.location.pathname + window.location.search,
          referrer: document.referrer || null,
        }),
      }).catch(() => {});
    };

    sendPageView();
  }, [pathname]);

  return null;
}
