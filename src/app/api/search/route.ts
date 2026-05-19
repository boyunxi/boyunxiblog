import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";
import { logger } from "@/lib/logger";

export const GET = withLog(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q) {
      return NextResponse.json(
        { success: false, error: "Search query is required" },
        { status: 400 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      },
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });

    void logger.info({
      category: "view",
      action: "search",
      message: `搜索: "${q}" 找到 ${posts.length} 篇`,
      meta: { query: q, results: posts.length },
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to search posts" },
      { status: 500 }
    );
  }
});
