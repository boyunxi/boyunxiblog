import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";

export const GET = withLog(async () => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
});

export const POST = withLog(async (request) => {
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
    const { name, slug } = body;

    const category = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
});
