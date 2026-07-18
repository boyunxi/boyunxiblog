import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withLog } from "@/lib/with-log";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
}

export const GET = withLog(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const postId = parseInt(params.id);
  const ip = getIp(request);

  const [likesCount, liked] = await Promise.all([
    prisma.like.count({ where: { postId } }),
    prisma.like.findUnique({
      where: { postId_ip: { postId, ip } },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: { likesCount, liked: !!liked },
  });
});

export const POST = withLog(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const postId = parseInt(params.id);
  const ip = getIp(request);

  if (ip === "unknown") {
    return NextResponse.json(
      { success: false, error: "Cannot identify user" },
      { status: 400 }
    );
  }

  const existing = await prisma.like.findUnique({
    where: { postId_ip: { postId, ip } },
  });

  if (existing) {
    // Unlike
    await Promise.all([
      prisma.like.delete({ where: { postId_ip: { postId, ip } } }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
  } else {
    // Like
    await Promise.all([
      prisma.like.create({ data: { postId, ip } }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);
  }

  const likesCount = await prisma.like.count({ where: { postId } });

  return NextResponse.json({
    success: true,
    data: { liked: !existing, likesCount },
  });
});
