import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ShareButtons from "@/components/frontend/ShareButtons";
import CloudTag from "@/components/ui/SealTag";
import CloudDivider from "@/components/ui/InkDivider";

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

function estimateReadingTime(content: string): string {
  const text = content.replace(/<[^>]*>/g, "");
  const charCount = text.length;
  const minutes = Math.max(1, Math.ceil(charCount / 500));
  return `${minutes} 分钟`;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!post || !post.published) {
    notFound();
  }

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
    <article className="max-w-content mx-auto">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors mb-10 text-sm font-serif tracking-wider group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        返回
      </a>

      <header className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-ink leading-snug mb-6 text-balance">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted mb-6">
          {post.category && (
            <CloudTag text={post.category.name} href={`/categories/${post.category.slug}`} small />
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {estimateReadingTime(post.content)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={13} />
            {post.views} 次阅读
          </span>
        </div>
      </header>

      {post.coverImage && (
        <div className="mb-12 overflow-hidden rounded-cloud">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      <div
        className="prose-custom mb-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {transformedPost.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {transformedPost.tags.map((tag) => (
            <CloudTag key={tag.id} text={tag.name} href={`/tags/${tag.slug}`} small />
          ))}
        </div>
      )}

      <CloudDivider />

      <div className="flex items-center justify-between py-4">
        <ShareButtons title={post.title} url={`/posts/${post.slug}`} />
      </div>

      <CloudDivider />

      <nav className="py-8">
        <div className="flex justify-between items-start gap-8">
          {prevPost ? (
            <a
              href={`/posts/${prevPost.slug}`}
              className="group flex-1 text-left cloud-card p-4"
            >
              <span className="text-ink-muted text-xs font-serif tracking-wider block mb-2">← 上一篇</span>
              <span className="text-ink group-hover:text-gold transition-colors text-sm font-serif line-clamp-1">
                {prevPost.title}
              </span>
            </a>
          ) : (
            <span className="flex-1" />
          )}
          {nextPost ? (
            <a
              href={`/posts/${nextPost.slug}`}
              className="group flex-1 text-right cloud-card p-4"
            >
              <span className="text-ink-muted text-xs font-serif tracking-wider block mb-2">下一篇 →</span>
              <span className="text-ink group-hover:text-gold transition-colors text-sm font-serif line-clamp-1">
                {nextPost.title}
              </span>
            </a>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      </nav>
    </article>
  );
}
