import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import Link from "next/link";
import PostCard from "@/components/frontend/PostCard";
import EmptyState from "@/components/ui/EmptyState";

export default async function HomePage() {
  const [posts, categories, settings] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
    }),
    prisma.siteSetting.findFirst({ where: { id: 1 } }),
  ]);

  const heroTitle = settings?.heroTitle || "薄云隙";
  const heroSubtitle = settings?.heroSubtitle || "记录技术、思考与持续学习";
  const archiveLabel = settings?.archiveLabel || "最新文章";
  const emptyStateText = settings?.emptyStateText || "暂无文章";

  const transformedPosts = posts.map(transformPost);

  return (
    <div className="relative">
      <section className="relative min-h-[62vh] md:min-h-[66vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="w-10 h-px bg-[var(--gold)] mb-8 opacity-70" />

        <h1
          className="font-serif text-5xl md:text-7xl text-[var(--text)] tracking-[0.18em] opacity-0 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          {heroTitle}
        </h1>

        <p
          className="font-sans text-[var(--text-muted)] text-sm tracking-[0.16em] mt-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {heroSubtitle}
        </p>

        <div className="w-16 h-px bg-[var(--border)] mt-8" />

        <nav
          className="flex flex-wrap justify-center gap-2 mt-12 opacity-0 animate-fade-up"
          style={{ animationDelay: "1.1s" }}
        >
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="portal-link border-[var(--border)]"
            >
              {cat.name}
              <span className="text-[var(--text-ghost)] text-[10px] ml-1">{cat._count.posts}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="relative max-w-page mx-auto px-6 pb-32">
        <div
          className="mb-8 opacity-0 animate-fade-up border-b border-[var(--border)] pb-4"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-[var(--text-muted)] text-xs tracking-[0.16em] font-sans">{archiveLabel}</span>
        </div>

        {transformedPosts.length === 0 ? (
          <EmptyState text={emptyStateText} />
        ) : (
          <div className="space-y-2">
            {transformedPosts.map((post, index) => (
              <div
                key={post.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${0.1 * index + 0.3}s` }}
              >
                <PostCard post={post} variant="hero" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
