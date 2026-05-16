"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(var(--gold-rgb),0.3)] transition-all duration-500 group"
      aria-label={theme === "night" ? "切换至白昼" : "切换至夜昼"}
    >
      <span className="relative w-4 h-4 flex items-center justify-center">
        <Moon
          size={13}
          className={`absolute transition-all duration-500 ${
            theme === "night"
              ? "opacity-100 rotate-0 scale-100 text-[var(--gold)]"
              : "opacity-0 rotate-90 scale-50 text-[var(--text-muted)]"
          }`}
        />
        <Sun
          size={13}
          className={`absolute transition-all duration-500 ${
            theme === "day"
              ? "opacity-100 rotate-0 scale-100 text-[var(--gold)]"
              : "opacity-0 -rotate-90 scale-50 text-[var(--text-muted)]"
          }`}
        />
      </span>
      <span className="sr-only">{theme === "night" ? "白昼" : "夜昼"}</span>
    </button>
  );
}
