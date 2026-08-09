import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const chars = Array.from(params.slug, (c) => c.codePointAt(0)?.toString(16));
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });

  // 完全模拟页面组件的查询
  const tagFull = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { post: { published: true } },
        include: {
          post: {
            include: { category: true, tags: { include: { tag: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json({
    rawSlug: params.slug,
    chars,
    tagFound: tag ? { id: tag.id, name: tag.name } : null,
    tagFullFound: tagFull ? { id: tagFull.id, name: tagFull.name, postCount: tagFull.posts.length } : null,
    tagFullError: tagFull === null ? "tagFull 为 null（页面组件会 notFound）" : "正常",
  });
}
