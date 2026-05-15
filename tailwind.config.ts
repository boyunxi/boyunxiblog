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
        mist: {
          DEFAULT: "#FAF8F3",
          warm: "#F5F1E8",
          cool: "#F0ECE2",
          deep: "#E8E2D4",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8CC6E",
          dark: "#B8960F",
          muted: "#C4A44E",
          faint: "rgba(212,175,55,0.12)",
        },
        ink: {
          DEFAULT: "#2A2A2A",
          light: "#4A4A4A",
          muted: "#6B6B6B",
          faint: "#9E9E9E",
        },
      },
      fontFamily: {
        serif: ["Noto Serif SC", "serif"],
        sans: ["Noto Sans SC", "sans-serif"],
        display: ["Ma Shan Zheng", "cursive"],
      },
      maxWidth: {
        content: "720px",
      },
      borderRadius: {
        cloud: "14px",
        capsule: "20px",
        pill: "10px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "cloud-drift": "cloudDrift 8s ease-in-out infinite",
        "cloud-drift-slow": "cloudDrift 12s ease-in-out infinite",
        "gold-breathe": "goldBreathe 4s ease-in-out infinite",
        "seal-stamp": "sealStamp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "float-gentle": "floatGentle 6s ease-in-out infinite",
        "brush-stroke": "brushStroke 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        cloudDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(8px, -4px) scale(1.03)" },
          "66%": { transform: "translate(-4px, 6px) scale(0.97)" },
        },
        goldBreathe: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        sealStamp: {
          "0%": { opacity: "0", transform: "scale(1.8)" },
          "60%": { opacity: "1", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        floatGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        brushStroke: {
          "0%": { opacity: "0", clipPath: "inset(0 100% 0 0)", filter: "blur(4px)" },
          "60%": { filter: "blur(1px)" },
          "100%": { opacity: "1", clipPath: "inset(0 0 0 0)", filter: "blur(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
