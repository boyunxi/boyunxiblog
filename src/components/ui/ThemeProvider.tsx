"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "night" | "day";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "night",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("night");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("boyunxi-theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored === "day" ? "day" : "");
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    const next: Theme = theme === "night" ? "day" : "night";

    if (document.startViewTransition) {
      const x = window.innerWidth / 2;
      const y = window.innerHeight / 2;
      const maxRadius = Math.hypot(x, y);

      const transition = document.startViewTransition(() => {
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next === "day" ? "day" : "");
        localStorage.setItem("boyunxi-theme", next);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: next === "day" ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 800,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: next === "day"
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        );
      });
    } else {
      setTheme(next);
      document.documentElement.setAttribute("data-theme", next === "day" ? "day" : "");
      localStorage.setItem("boyunxi-theme", next);
    }
  }, [theme]);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
