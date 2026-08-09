import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const chars = Array.from(params.slug, (c) => c.codePointAt(0)?.toString(16));
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });
  const tag2 = await prisma.tag.findUnique({ where: { slug: decodeURIComponent(params.slug) } });
  return NextResponse.json({
    rawSlug: params.slug,
    url: request.url,
    pathname: new URL(request.url).pathname,
    chars,
    tagFound: tag ? { id: tag.id, name: tag.name } : null,
    tagFoundAfterDecode: tag2 ? { id: tag2.id, name: tag2.name } : null,
  });
}
