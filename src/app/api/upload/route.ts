import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMinioClient, getBucket, getPublicUrl, ensureBucket } from "@/lib/minio";
import { withLog } from "@/lib/with-log";
import { fileTypeFromBuffer } from "file-type";

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

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File too large. Max 10MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 二次校验：实际字节数不得超过上限
    if (buffer.length > maxSize) {
      return NextResponse.json({ success: false, error: "File too large. Max 10MB." }, { status: 400 });
    }

    // 魔数校验（不信任客户端声明的 file.type）。SVG 可从文本内容伪造魔数且可携带脚本，故默认拒绝。
    const detected = await fileTypeFromBuffer(buffer);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!detected || !allowedTypes.includes(detected.mime)) {
      return NextResponse.json(
        { success: false, error: "Unsupported or spoofed file type. Use JPEG, PNG, GIF, or WebP." },
        { status: 400 }
      );
    }

    // 随机文件名落盘，避免用户可控路径/名称
    const ext = (detected.ext || "bin").toLowerCase();
    const filename = `${crypto.randomUUID()}.${ext}`;

    const bucket = getBucket();
    const minioClient = getMinioClient();

    await minioClient.putObject(bucket, filename, buffer, buffer.length, {
      "Content-Type": detected.mime,
    });

    const publicUrl = getPublicUrl();
    const url = `${publicUrl}/${filename}`;

    const image = await prisma.image.create({
      data: {
        name: file.name,
        filename,
        mimeType: detected.mime,
        size: buffer.length,
        url,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
});
