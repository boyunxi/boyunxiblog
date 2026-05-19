import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";

export const GET = withLog(async () => {
  try {
    let settings = await prisma.siteSetting.findFirst({
      where: { id: 1 },
    });

    if (!settings) {
      const defaultSettings = {
        siteName: "薄云隙",
        siteDescription: "窥见世界裂隙",
        logoText: "隙",
        heroTitle: "薄云隙",
        heroSubtitle: "窥见世界裂隙 · 数字古风档案馆",
        archiveLabel: "云 海 档 案 馆",
        emptyStateText: "档案馆中尚无卷宗",
        authorName: "",
        authorBio: "",
        contactEmail: "",
        githubUrl: "",
        copyrightText: "薄云隙 · 数字古风档案馆",
        icpNumber: "",
        policeNumber: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        aboutContent: "",
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
      return NextResponse.json({ success: true, data: defaultSettings });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
});

export const PUT = withLog(async (request: NextRequest) => {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const settings = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: {
        siteName: body.siteName,
        siteDescription: body.siteDescription,
        logoText: body.logoText,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        archiveLabel: body.archiveLabel,
        emptyStateText: body.emptyStateText,
        authorName: body.authorName,
        authorBio: body.authorBio,
        contactEmail: body.contactEmail,
        githubUrl: body.githubUrl,
        copyrightText: body.copyrightText,
        icpNumber: body.icpNumber,
        policeNumber: body.policeNumber,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        aboutContent: body.aboutContent,
        easterEggLogoEnabled: body.easterEggLogoEnabled ?? true,
        easterEggLogoClicks: body.easterEggLogoClicks ?? 5,
        easterEggLogoText: body.easterEggLogoText,
        easterEggLogoDuration: body.easterEggLogoDuration ?? 3,
        easterEggConsoleEnabled: body.easterEggConsoleEnabled ?? true,
        easterEggConsoleText: body.easterEggConsoleText,
        easterEggKonamiEnabled: body.easterEggKonamiEnabled ?? true,
        easterEggKonamiText: body.easterEggKonamiText,
        easterEggSearchHello: body.easterEggSearchHello,
      },
      create: {
        id: 1,
        siteName: body.siteName ?? "薄云隙",
        siteDescription: body.siteDescription,
        logoText: body.logoText,
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        archiveLabel: body.archiveLabel,
        emptyStateText: body.emptyStateText,
        authorName: body.authorName,
        authorBio: body.authorBio,
        contactEmail: body.contactEmail,
        githubUrl: body.githubUrl,
        copyrightText: body.copyrightText,
        icpNumber: body.icpNumber,
        policeNumber: body.policeNumber,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        aboutContent: body.aboutContent,
        easterEggLogoEnabled: body.easterEggLogoEnabled ?? true,
        easterEggLogoClicks: body.easterEggLogoClicks ?? 5,
        easterEggLogoText: body.easterEggLogoText,
        easterEggLogoDuration: body.easterEggLogoDuration ?? 3,
        easterEggConsoleEnabled: body.easterEggConsoleEnabled ?? true,
        easterEggConsoleText: body.easterEggConsoleText,
        easterEggKonamiEnabled: body.easterEggKonamiEnabled ?? true,
        easterEggKonamiText: body.easterEggKonamiText,
        easterEggSearchHello: body.easterEggSearchHello,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
});
