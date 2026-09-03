import "@/styles/globals.css";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

const localFontStack = {
  "--font-serif": '"Songti SC", "STSong", "Noto Serif CJK SC", "Source Han Serif SC", SimSun, serif',
  "--font-sans": '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif',
  "--font-mono": '"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
} as React.CSSProperties;

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

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
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-scroll-behavior: Next 16 起不再在客户端路由切换时临时抑制 smooth，
    // 该属性把它显式打开，避免每次导航从旧滚动位置一路平滑滑到新页顶部。
    <html lang="zh-CN" data-scroll-behavior="smooth" style={localFontStack}>
      <body className="bg-void min-h-screen">{children}</body>
    </html>
  );
}
