import "@/styles/globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import { prisma } from "@/lib/prisma";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

async function getSettings() {
  try {
    return await prisma.siteSetting.findFirst({ where: { id: 1 } });
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings?.siteName || "薄云隙";
  const description = settings?.seoDescription || settings?.siteDescription || "窥见世界裂隙";
  const title = settings?.seoTitle || siteName;
  const keywords = settings?.seoKeywords || "";

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      locale: "zh_CN",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${jetbrainsMono.variable} ${notoSerifSC.variable} ${notoSansSC.variable}`}>
      <body className="bg-void min-h-screen" style={{ fontFamily: 'var(--font-sans), "Noto Sans SC", sans-serif' }}>{children}</body>
    </html>
  );
}
