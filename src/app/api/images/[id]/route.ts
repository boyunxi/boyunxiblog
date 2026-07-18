import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMinioClient, getBucket } from "@/lib/minio";
import { withLog } from "@/lib/with-log";

export const GET = withLog(async (
  request,
  { params }: { params: { id: string } }
) => {
  try {
    const image = await prisma.image.findUnique({ where: { id: parseInt(params.id) } });
    if (!image) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch image" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const image = await prisma.image.update({
      where: { id: parseInt(params.id) },
      data: { name: name.trim() },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update image" }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const image = await prisma.image.findUnique({ where: { id: parseInt(params.id) } });
    if (!image) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    const minioClient = getMinioClient();
    const bucket = getBucket();
    try {
      await minioClient.removeObject(bucket, image.filename);
    } catch {
      // ignore if file doesn't exist in minio
    }

    await prisma.image.delete({ where: { id: parseInt(params.id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete image" }, { status: 500 });
  }
});
