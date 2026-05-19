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
  const heroSubtitle = settings?.heroSubtitle || "窥见世界裂隙 · 数字古风档案馆";
  const archiveLabel = settings?.archiveLabel || "云 海 档 案 馆";
  const emptyStateText = settings?.emptyStateText || "档案馆中尚无卷宗";

  const transformedPosts = posts.map(transformPost);

  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[300px] rounded-full blur-[100px] animate-fog-drift" style={{backgroundColor: "rgba(var(--gold-rgb),0.02)"}} />
        <div className="absolute top-[50%] right-[10%] w-[400px] h-[250px] rounded-full blur-[80px] animate-fog-drift-slow" style={{backgroundColor: "rgba(var(--gold-rgb),0.015)"}} />
        <div className="absolute bottom-[20%] left-[40%] w-[350px] h-[200px] rounded-full blur-[90px] animate-fog-drift" style={{backgroundColor: "rgba(var(--fog-white),0.01)", animationDelay: "-8s"}} />
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px animate-particle-fall"
            style={{
              backgroundColor: "rgba(var(--gold-rgb),0.3)",
              left: `${15 + i * 15}%`,
              animationDuration: `${10 + i * 3}s`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6">
        <div className="rift-line animate-rift-glow mb-8" />

        <h1
          className="font-display text-6xl md:text-8xl text-[var(--text)] tracking-[0.3em] opacity-0 animate-fade-up gold-text-glow"
          style={{ animationDelay: "0.3s" }}
        >
          {heroTitle}
        </h1>

        <p
          className="font-serif text-[var(--text-muted)] text-sm tracking-[0.5em] mt-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          {heroSubtitle}
        </p>

        <div className="rift-line animate-rift-glow mt-8" style={{ animationDelay: "-2s" }} />

        <nav
          className="flex flex-wrap justify-center gap-4 mt-16 opacity-0 animate-fade-up"
          style={{ animationDelay: "1.1s" }}
        >
          {categories.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="portal-link"
            >
              {cat.name}
              <span className="text-[var(--text-ghost)] text-[10px] ml-1">{cat._count.posts}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="relative max-w-page mx-auto px-6 pb-32">
        <div className="rift-horizontal mb-16" />

        <div
          className="text-center mb-16 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.5em] font-serif">{archiveLabel}</span>
        </div>

        {transformedPosts.length === 0 ? (
          <EmptyState text={emptyStateText} />
        ) : (
          <div className="space-y-6">
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
