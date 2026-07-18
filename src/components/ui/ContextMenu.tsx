"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUp, BookOpen, ChevronLeft, FolderTree } from "lucide-react";
import { useRouter } from "next/navigation";

interface MenuPosition {
  x: number;
  y: number;
}

function isNativeContextTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "input, textarea, select, pre, code, [contenteditable='true'], [data-native-context]"
    )
  );
}

function announceNavigation(href: string) {
  window.dispatchEvent(new CustomEvent("app:navigation-start", { detail: { href } }));
}

export default function ContextMenu() {
  const router = useRouter();
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  const close = useCallback(() => setPosition(null), []);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      if (isNativeContextTarget(event.target)) return;

      event.preventDefault();
      const menuWidth = 224;
      const menuHeight = 220;
      const x = Math.min(event.clientX, window.innerWidth - menuWidth - 12);
      const y = Math.min(event.clientY, window.innerHeight - menuHeight - 12);
      setPosition({ x: Math.max(12, x), y: Math.max(12, y) });
    };

    const handlePointerDown = () => close();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const handleScroll = () => close();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [close]);

  if (!position) return null;

  const navigate = (href: string) => {
    close();
    announceNavigation(href);
    router.push(href);
  };

  return (
    <div
      className="context-menu"
      style={{ left: position.x, top: position.y }}
      role="menu"
      aria-label="页面导航菜单"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="context-menu-label">页面导航</div>
      <button
        type="button"
        role="menuitem"
        disabled={!canGoBack}
        onClick={() => {
          close();
          window.history.back();
        }}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        <span>返回上一层</span>
      </button>
      <button type="button" role="menuitem" onClick={() => navigate("/categories")}>
        <FolderTree size={16} aria-hidden="true" />
        <span>返回目录</span>
      </button>
      <button type="button" role="menuitem" onClick={() => navigate("/")}>
        <ArrowUp size={16} aria-hidden="true" />
        <span>返回最顶层</span>
      </button>
      <button type="button" role="menuitem" onClick={() => navigate("/")}>
        <BookOpen size={16} aria-hidden="true" />
        <span>返回文章列表</span>
      </button>
    </div>
  );
}
