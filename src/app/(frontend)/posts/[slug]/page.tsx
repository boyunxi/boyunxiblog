import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import MdxRenderer from "@/lib/mdx-renderer";
import { logger } from "@/lib/logger";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

function estimateReadingTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, "").replace(/[#*`\[\]()]/g, "");
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

  void logger.info({
    category: "view",
    action: "post_view",
    message: `阅读: ${post.title}`,
    meta: { postId: post.id, slug: post.slug },
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
      <div className="max-w-content mx-auto px-6 pt-8 pb-32 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-ghost)] hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500 mb-16 text-xs font-serif tracking-[0.2em]"
        >
          <ArrowLeft size={12} />
          返回文章列表
        </Link>

        <header className="mb-16 text-center">
          <div className="w-10 h-px bg-[var(--gold)] mx-auto mb-10 opacity-70" />

          <h1 className="font-serif text-2xl md:text-3xl text-[var(--text)] leading-relaxed tracking-wide mb-8 text-balance">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--text-ghost)] text-xs">
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

          <div className="w-16 h-px bg-[var(--border)] mx-auto mt-10" />
        </header>

        {post.coverImage && (
          <div className="mb-16 border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        <div className="prose-dark mb-16">
          {post.content.trim().startsWith("<") ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <MdxRenderer source={post.content} />
          )}
        </div>

        {transformedPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {transformedPost.tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`} className="gold-tag">
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="h-px bg-[var(--border)] my-16" />

        <nav className="flex justify-between items-start gap-8">
          {prevPost ? (
            <Link href={`/posts/${prevPost.slug}`} className="scroll-vessel p-5 flex-1 group">
              <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.12em] font-sans block mb-2">← 上一篇</span>
              <span className="text-[var(--text-muted)] text-sm font-serif line-clamp-1 group-hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {nextPost ? (
            <Link href={`/posts/${nextPost.slug}`} className="scroll-vessel p-5 flex-1 text-right group">
              <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.12em] font-sans block mb-2">下一篇 →</span>
              <span className="text-[var(--text-muted)] text-sm font-serif line-clamp-1 group-hover:text-[rgba(var(--gold-rgb),0.6)] transition-colors duration-500">
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
