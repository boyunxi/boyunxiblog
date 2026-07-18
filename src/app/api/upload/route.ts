import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMinioClient, getBucket, getPublicUrl, ensureBucket } from "@/lib/minio";
import { withLog } from "@/lib/with-log";

export const POST = withLog(async (request: NextRequest) => {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ensureBucket();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type. Use JPEG, PNG, GIF, WebP, or SVG." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File too large. Max 10MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const timestamp = Date.now();
    const filename = `${baseName}-${timestamp}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getBucket();
    const minioClient = getMinioClient();

    await minioClient.putObject(bucket, filename, buffer, file.size, {
      "Content-Type": file.type,
    });

    const publicUrl = getPublicUrl();
    const url = `${publicUrl}/${filename}`;

    const image = await prisma.image.create({
      data: {
        name: file.name,
        filename,
        mimeType: file.type,
        size: file.size,
        url,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
});
