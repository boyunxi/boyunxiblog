import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

function estimateReadingTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, "");
  const minutes = Math.max(1, Math.ceil(text.length / 500));
  return `${minutes} 分钟`;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!post || !post.published) notFound();

  const transformedPost = transformPost(post);

  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: post.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: post.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return (
    <article className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[15%] w-[400px] h-[250px] rounded-full bg-gold/[0.015] blur-[80px] animate-fog-drift-slow" />
      </div>

      <div className="max-w-content mx-auto px-6 pt-8 pb-32 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-pale-ghost hover:text-gold/60 transition-colors duration-500 mb-16 text-xs font-serif tracking-[0.2em]"
        >
          <ArrowLeft size={12} />
          返回档案馆
        </Link>

        <header className="mb-16 text-center">
          <div className="rift-line animate-rift-glow mb-10" />

          <h1 className="font-serif text-2xl md:text-3xl text-pale leading-relaxed tracking-wider mb-8 text-balance gold-text-glow">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-pale-ghost text-xs">
            {post.category && (
              <span className="gold-tag">{post.category.name}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={11} />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {estimateReadingTime(post.content)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={11} />
              {post.views}
            </span>
          </div>

          <div className="rift-line animate-rift-glow mt-10" style={{ animationDelay: "-2s" }} />
        </header>

        {post.coverImage && (
          <div className="mb-16 scroll-vessel overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        <div
          className="prose-dark mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {transformedPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {transformedPost.tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className="gold-tag">
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="rift-horizontal my-16" />

        <nav className="flex justify-between items-start gap-8">
          {prevPost ? (
            <Link href={`/posts/${prevPost.slug}`} className="scroll-vessel incomplete-border p-5 flex-1 group">
              <span className="text-pale-ghost text-[10px] tracking-[0.2em] font-serif block mb-2">← 上一卷宗</span>
              <span className="text-pale-muted text-sm font-serif line-clamp-1 group-hover:text-gold/60 transition-colors duration-500">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {nextPost ? (
            <Link href={`/posts/${nextPost.slug}`} className="scroll-vessel incomplete-border p-5 flex-1 text-right group">
              <span className="text-pale-ghost text-[10px] tracking-[0.2em] font-serif block mb-2">下一卷宗 →</span>
              <span className="text-pale-muted text-sm font-serif line-clamp-1 group-hover:text-gold/60 transition-colors duration-500">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>
    </article>
  );
}
