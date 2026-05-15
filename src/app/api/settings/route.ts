import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  aboutContent: "",
};

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findFirst({
      where: { id: 1 },
    });

    if (!settings) {
      return NextResponse.json({ success: true, data: defaultSettings });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        aboutContent: body.aboutContent,
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
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        aboutContent: body.aboutContent,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}