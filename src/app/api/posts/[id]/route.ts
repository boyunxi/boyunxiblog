import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";

export const GET = withLog(async (
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
      include: { category: true, tags: { include: { tag: true } } },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
});

export const PUT = withLog(async (
  request,
  { params }: { params: { id: string } }
) => {
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

    const post = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published,
        categoryId: categoryId || null,
        tags: {
          deleteMany: {},
          create: (tagIds || []).map((tagId: number) => ({ tagId })),
        },
      },
      include: { category: true, tags: { include: { tag: true } } },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
});

export const DELETE = withLog(async (
  request,
  { params }: { params: { id: string } }
) => {
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

    await prisma.post.delete({ where: { id: parseInt(params.id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
});
