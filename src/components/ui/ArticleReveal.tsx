"use client";

import { useEffect } from "react";

/**
 * 文章正文滚入动画：观察正文容器直接子元素（标题/段落/引用/代码块/图片），
 * 逐个进入视口时淡入上移，带轻微 stagger。
 * 不渲染任何 DOM，仅作副作用挂载于文章页。
 */
export default function ArticleReveal({
  containerSelector = ".prose-dark",
  stagger = 60,
}: {
  containerSelector?: string;
  stagger?: number;
}) {
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    if (typeof IntersectionObserver === "undefined") return;

    const elements = Array.from(container.children) as HTMLElement[];
    elements.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min(i, 12) * stagger}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerSelector, stagger]);

  return null;
}
