import "@/styles/globals.css";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

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
    <html lang="zh-CN">
      <body className="bg-void font-sans min-h-screen">{children}</body>
    </html>
  );
}
