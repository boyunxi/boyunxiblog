import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function yesterdayRange() {
  const start = new Date();
  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export const GET = withLog(async () => {
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

    const today = todayRange();
    const yesterday = yesterdayRange();

    const [
      totalPosts,
      totalCategories,
      totalTags,
      viewsResult,
      recentPosts,
      categories,
      topPosts,
      // Visitor stats
      todayLogs,
      yesterdayLogs,
      totalVisitorsResult,
      topVisitorLogs,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
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
        select: { id: true, title: true, views: true },
      }),
      // Today's view logs
      prisma.log.findMany({
        where: { category: "view", createdAt: { gte: today.start, lt: today.end } },
        select: { ip: true },
      }),
      // Yesterday's view logs
      prisma.log.findMany({
        where: { category: "view", createdAt: { gte: yesterday.start, lt: yesterday.end } },
        select: { ip: true },
      }),
      // Total distinct IPs
      prisma.log.groupBy({
        by: ["ip"],
        where: { category: "view" },
      }),
      // Top visitors (raw query for SQLite compatibility)
      prisma.$queryRawUnsafe<Array<{ ip: string; geo: string | null; count: number; lastSeen: string }>>(
        `SELECT ip, geo, COUNT(*) as count, MAX(createdAt) as lastSeen
         FROM Log
         WHERE category = 'view' AND ip IS NOT NULL AND ip != 'unknown'
         GROUP BY ip
         ORDER BY count DESC
         LIMIT 15`
      ),
    ]);

    const recentPostsList = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, published: true, createdAt: true, views: true },
    });

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

    // Compute visitor stats
    const todayIps = new Set(todayLogs.map((l) => l.ip).filter((ip) => ip && ip !== "unknown"));
    const yesterdayIps = new Set(yesterdayLogs.map((l) => l.ip).filter((ip) => ip && ip !== "unknown"));

    const topVisitors = topVisitorLogs.map((v) => {
      let geo: { country: string; region: string; city: string } | null = null;
      if (v.geo) {
        try { geo = JSON.parse(v.geo); } catch {}
      }
      return {
        ip: v.ip,
        country: geo?.country || null,
        region: geo?.region || null,
        city: geo?.city || null,
        count: Number(v.count),
        lastSeen: Number(v.lastSeen),
      };
    });

    // Ensure all numbers are plain Number (not BigInt from SQLite)
    const toNumber = (v: unknown): number => Number(v) || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalPosts: toNumber(totalPosts),
        totalCategories: toNumber(totalCategories),
        totalTags: toNumber(totalTags),
        totalViews: toNumber(totalViews),
        publishedPosts: toNumber(await prisma.post.count({ where: { published: true } })),
        draftPosts: toNumber(await prisma.post.count({ where: { published: false } })),
        postsByMonth: postsByMonth.map((d) => ({ month: d.month, count: toNumber(d.count) })),
        viewsByMonth: viewsByMonth.map((d) => ({ month: d.month, views: toNumber(d.views) })),
        categoryDistribution: categoryDistribution.map((d) => ({ name: d.name, count: toNumber(d.count) })),
        topPosts: topPosts.map((p) => ({ id: p.id, title: p.title, views: toNumber(p.views) })),
        recentPosts: recentPostsList.map((p) => ({ id: p.id, title: p.title, published: p.published, createdAt: p.createdAt, views: toNumber(p.views) })),
        todayVisitors: todayIps.size,
        yesterdayVisitors: yesterdayIps.size,
        todayPageViews: todayLogs.length,
        yesterdayPageViews: yesterdayLogs.length,
        totalVisitors: totalVisitorsResult.length,
        topVisitors,
      },
    });
  } catch (error) {
    console.error("[Stats] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
});
