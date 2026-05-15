import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [
      totalPosts,
      totalCategories,
      totalTags,
      viewsResult,
      publishedPosts,
      draftPosts,
      recentPosts,
      categories,
      topPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
        select: { createdAt: true, views: true },
      }),
      prisma.category.findMany({
        include: { _count: { select: { posts: true } } },
      }),
      prisma.post.findMany({
        orderBy: { views: "desc" },
        take: 5,
        select: { title: true, views: true },
      }),
    ]);

    const totalViews = viewsResult._sum.views || 0;

    const monthMap: Record<string, { count: number; views: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = { count: 0, views: 0 };
    }

    for (const post of recentPosts) {
      const month = `${post.createdAt.getFullYear()}-${String(post.createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (month in monthMap) {
        monthMap[month].count++;
        monthMap[month].views += post.views;
      }
    }

    const postsByMonth = Object.entries(monthMap).map(([month, data]) => ({
      month,
      count: data.count,
    }));

    const viewsByMonth = Object.entries(monthMap).map(([month, data]) => ({
      month,
      views: data.views,
    }));

    const categoryDistribution = categories.map((cat) => ({
      name: cat.name,
      count: cat._count.posts,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalPosts,
        totalCategories,
        totalTags,
        totalViews,
        publishedPosts,
        draftPosts,
        postsByMonth,
        viewsByMonth,
        categoryDistribution,
        topPosts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
