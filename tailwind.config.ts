import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#0a0e17",
          deep: "#060911",
          mid: "#111827",
          light: "#1a2332",
        },
        fog: {
          DEFAULT: "rgba(255,255,255,0.04)",
          light: "rgba(255,255,255,0.07)",
          medium: "rgba(255,255,255,0.10)",
          heavy: "rgba(255,255,255,0.15)",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8CC6E",
          dark: "#B8960F",
          glow: "rgba(212,175,55,0.15)",
          faint: "rgba(212,175,55,0.06)",
          dim: "rgba(212,175,55,0.03)",
        },
        pale: {
          DEFAULT: "rgba(255,255,255,0.85)",
          soft: "rgba(255,255,255,0.6)",
          muted: "rgba(255,255,255,0.35)",
          ghost: "rgba(255,255,255,0.15)",
        },
        ink: {
          DEFAULT: "#1a1a1a",
        },
        inkGray: "#6b7280",
        ricepaper: "#FAF8F3",
        cloudWhite: "#ffffff",
        ochre: "#a0752a",
      },
      fontFamily: {
        serif: ["Noto Serif SC", "serif"],
        sans: ["Noto Sans SC", "sans-serif"],
        display: ["Ma Shan Zheng", "cursive"],
      },
      maxWidth: {
        content: "640px",
        page: "48rem",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "rift-glow": "riftGlow 4s ease-in-out infinite",
        "rift-pulse": "riftPulse 6s ease-in-out infinite",
        "fog-drift": "fogDrift 20s linear infinite",
        "fog-drift-slow": "fogDrift 35s linear infinite",
        "gold-breathe": "goldBreathe 4s ease-in-out infinite",
        "float-idle": "floatIdle 8s ease-in-out infinite",
        "particle-fall": "particleFall 12s linear infinite",
        "seal-stamp": "sealStamp 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        riftGlow: {
          "0%, 100%": { opacity: "0.4", filter: "blur(1px)" },
          "50%": { opacity: "1", filter: "blur(0px)" },
        },
        riftPulse: {
          "0%, 100%": { transform: "scaleX(1)", opacity: "0.6" },
          "50%": { transform: "scaleX(1.3)", opacity: "1" },
        },
        fogDrift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" },
        },
        goldBreathe: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.8" },
        },
        floatIdle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        particleFall: {
          "0%": { transform: "translateY(-10vh)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(110vh)", opacity: "0" },
        },
        sealStamp: {
          "0%": { opacity: "0", transform: "scale(2)" },
          "60%": { opacity: "1", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
