import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";
import { cleanOldLogs } from "@/lib/logger";

export const GET = withLog(async (request: NextRequest) => {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const level = searchParams.get("level");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (level) where.level = level;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { message: { contains: search } },
        { action: { contains: search } },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.log.count({ where }),
    ]);

    const stats = await prisma.log.groupBy({
      by: ["level"],
      _count: { level: true },
    });

    const categoryStats = await prisma.log.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    return NextResponse.json({
      success: true,
      data: {
        logs,
        total,
        page,
        pageSize,
        stats: stats.map((s) => ({ level: s.level, count: s._count.level })),
        categoryStats: categoryStats.map((s) => ({ category: s.category, count: s._count.category })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
});

export const DELETE = withLog(async (request: NextRequest) => {
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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const deleted = await cleanOldLogs(days);

    return NextResponse.json({
      success: true,
      data: { deleted, message: `已清理 ${deleted} 条 ${days} 天前的日志` },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to clean logs" },
      { status: 500 }
    );
  }
});
