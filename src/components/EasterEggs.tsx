"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface EasterEggSettings {
  easterEggLogoEnabled: boolean;
  easterEggLogoClicks: number;
  easterEggLogoText: string;
  easterEggLogoDuration: number;
  easterEggConsoleEnabled: boolean;
  easterEggConsoleText: string;
  easterEggKonamiEnabled: boolean;
  easterEggKonamiText: string;
  easterEggSearchHello: string;
}

const defaults: EasterEggSettings = {
  easterEggLogoEnabled: true,
  easterEggLogoClicks: 5,
  easterEggLogoText: "云深不知处,只在此山中,欲穷千里目,更上一层楼,海内存知己,天涯若比邻",
  easterEggLogoDuration: 3,
  easterEggConsoleEnabled: true,
  easterEggConsoleText: "欢迎来到薄云隙 · 窥见世界裂隙",
  easterEggKonamiEnabled: true,
  easterEggKonamiText: "道可道，非常道。名可名，非常名。",
  easterEggSearchHello: "你好，有缘人！既然寻到了此处，便留下吧。",
};

function FallingText({ texts, duration }: { texts: string[]; duration: number }) {
  const [items, setItems] = useState<{ id: number; text: string; x: number; delay: number; dur: number }[]>([]);

  useEffect(() => {
    const generated = texts.map((text, i) => ({
      id: i,
      text,
      x: Math.random() * 80 + 10,
      delay: Math.random() * (duration * 0.6),
      dur: duration + Math.random() * 1.5,
    }));
    setItems(generated);
    const timer = setTimeout(() => setItems([]), (duration + 2) * 1000);
    return () => clearTimeout(timer);
  }, [texts, duration]);

  if (items.length === 0) return null;

  return (
    <div className="easter-egg-falling" style={{ animationDuration: `${duration + 2}s` }}>
      {items.map((item) => (
        <span
          key={item.id}
          className="easter-egg-fall-item"
          style={{
            left: `${item.x}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.dur}s`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}

function KonamiOverlay({ text, onClose }: { text: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="easter-egg-konami" onClick={onClose}>
      <div className="easter-egg-ripple" />
      <div className="easter-egg-ripple easter-egg-ripple-2" />
      <div className="easter-egg-ripple easter-egg-ripple-3" />
      <p className="easter-egg-konami-text">{text}</p>
    </div>
  );
}

function SearchEasterEgg({ text, onClose }: { text: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="easter-egg-search" onClick={onClose}>
      <div className="easter-egg-search-inner">
        <span className="easter-egg-search-icon">✦</span>
        <p className="easter-egg-search-text">{text}</p>
      </div>
    </div>
  );
}

export default function EasterEggs() {
  const [settings, setSettings] = useState<EasterEggSettings>(defaults);
  const settingsRef = useRef<EasterEggSettings>(defaults);
  const [fallingTexts, setFallingTexts] = useState<string[]>([]);
  const [konamiText, setKonamiText] = useState<string | null>(null);
  const [searchHello, setSearchHello] = useState<string | null>(null);
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const konamiIndex = useRef(0);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings({ ...defaults, ...data.data });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (settings.easterEggConsoleEnabled && settings.easterEggConsoleText) {
      const text = settings.easterEggConsoleText;
      console.log(
        `%c${text}`,
        "color: #c9a227; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); padding: 8px 0;"
      );
      console.log(
        "%c窥见世界裂隙 · 数字古风档案馆",
        "color: #888; font-size: 12px; padding: 4px 0;"
      );
    }
  }, [settings.easterEggConsoleEnabled, settings.easterEggConsoleText]);

  useEffect(() => {
    const handleLogoClick = () => {
      const s = settingsRef.current;
      console.log("[EE] logo-click received, enabled:", s.easterEggLogoEnabled, "count:", logoClickCount.current + 1, "target:", s.easterEggLogoClicks);
      if (!s.easterEggLogoEnabled) return;

      logoClickCount.current += 1;

      if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 2000);

      if (logoClickCount.current >= s.easterEggLogoClicks) {
        logoClickCount.current = 0;
        const texts = s.easterEggLogoText
          ? s.easterEggLogoText.split(",").map((t) => t.trim()).filter(Boolean)
          : ["云深不知处"];
        console.log("[EE] TRIGGERED! texts:", texts);
        setFallingTexts(texts);
        setTimeout(() => setFallingTexts([]), (s.easterEggLogoDuration + 2) * 1000);
      }
    };

    console.log("[EE] Registering logo-click listener");
    window.addEventListener("logo-click", handleLogoClick);
    return () => {
      console.log("[EE] Unregistering logo-click listener");
      window.removeEventListener("logo-click", handleLogoClick);
    };
  }, []);

  useEffect(() => {
    const konamiCode = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "KeyB", "KeyA",
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const s = settingsRef.current;
      if (!s.easterEggKonamiEnabled) return;

      if (e.code === konamiCode[konamiIndex.current]) {
        konamiIndex.current += 1;
        if (konamiIndex.current === konamiCode.length) {
          konamiIndex.current = 0;
          setKonamiText(s.easterEggKonamiText || "道可道，非常道。");
        }
      } else {
        konamiIndex.current = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleSearchEasterEgg = () => {
      const s = settingsRef.current;
      if (!s.easterEggSearchHello) return;
      setSearchHello(s.easterEggSearchHello);
    };

    window.addEventListener("search-easter-egg", handleSearchEasterEgg);
    return () => window.removeEventListener("search-easter-egg", handleSearchEasterEgg);
  }, []);

  const closeKonami = useCallback(() => setKonamiText(null), []);
  const closeSearch = useCallback(() => setSearchHello(null), []);

  return (
    <>
      <span data-easter-eggs-mounted style={{display:'none'}} />
      {fallingTexts.length > 0 && (
        <FallingText texts={fallingTexts} duration={settingsRef.current.easterEggLogoDuration} />
      )}
      {konamiText && <KonamiOverlay text={konamiText} onClose={closeKonami} />}
      {searchHello && <SearchEasterEgg text={searchHello} onClose={closeSearch} />}
    </>
  );
}
