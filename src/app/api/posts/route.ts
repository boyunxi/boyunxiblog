import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";

export const GET = withLog(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const published = searchParams.get("published");

    const where: Record<string, unknown> = {};
    if (category) where.categoryId = parseInt(category);
    if (tag) where.tags = { some: { tagId: parseInt(tag) } };
    if (published !== null) where.published = published === "true";

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { category: true, tags: { include: { tag: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { posts, total, page, pageSize },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
});

export const POST = withLog(async (request: NextRequest) => {
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
    const { title, slug, content, excerpt, coverImage, published, categoryId, tagIds } = body;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published ?? false,
        categoryId: categoryId || null,
        tags: {
          create: (tagIds || []).map((tagId: number) => ({ tagId })),
        },
      },
      include: { category: true, tags: { include: { tag: true } } },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
});
