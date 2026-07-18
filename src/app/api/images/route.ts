import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMinioClient, getBucket } from "@/lib/minio";
import { withLog } from "@/lib/with-log";

export const GET = withLog(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const keyword = searchParams.get("keyword") || "";

    const where: Record<string, unknown> = {};
    if (keyword) {
      where.name = { contains: keyword };
    }

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.image.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { images, total, page, pageSize },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch images" }, { status: 500 });
  }
});

export const DELETE = withLog(async (request: NextRequest) => {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const ids: number[] = body.ids;
    if (!ids || ids.length === 0) {
      return NextResponse.json({ success: false, error: "No IDs provided" }, { status: 400 });
    }

    const images = await prisma.image.findMany({ where: { id: { in: ids } } });

    const minioClient = getMinioClient();
    const bucket = getBucket();
    for (const img of images) {
      try {
        await minioClient.removeObject(bucket, img.filename);
      } catch {
        // ignore if file doesn't exist in minio
      }
    }

    await prisma.image.deleteMany({ where: { id: { in: ids } } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete images" }, { status: 500 });
  }
});
