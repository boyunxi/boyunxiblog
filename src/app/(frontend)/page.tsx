import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
    }),
  ]);

  const transformedPosts = posts.map(transformPost);

  return (
    <div className="relative">
      {/* 雾气层 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[300px] rounded-full bg-gold/[0.02] blur-[100px] animate-fog-drift" />
        <div className="absolute top-[50%] right-[10%] w-[400px] h-[250px] rounded-full bg-gold/[0.015] blur-[80px] animate-fog-drift-slow" />
        <div className="absolute bottom-[20%] left-[40%] w-[350px] h-[200px] rounded-full bg-white/[0.01] blur-[90px] animate-fog-drift" style={{ animationDelay: "-8s" }} />
      </div>

      {/* 粒子 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-gold/30 animate-particle-fall"
            style={{
              left: `${15 + i * 15}%`,
              animationDuration: `${10 + i * 3}s`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero 区域 - 云层裂隙 */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6">
        {/* 裂隙光柱 */}
        <div className="rift-line animate-rift-glow mb-8" />

        <h1
          className="font-display text-6xl md:text-8xl text-pale tracking-[0.3em] opacity-0 animate-fade-up gold-text-glow"
          style={{ animationDelay: "0.3s" }}
        >
          薄云隙
        </h1>

        <p
          className="font-serif text-pale-muted text-sm tracking-[0.5em] mt-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.7s" }}
        >
          窥见世界裂隙 · 数字古风档案馆
        </p>

        {/* 裂隙下光 */}
        <div className="rift-line animate-rift-glow mt-8" style={{ animationDelay: "-2s" }} />

        {/* 世界入口导航 */}
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
              <span className="text-pale-ghost text-[10px] ml-1">{cat._count.posts}</span>
            </Link>
          ))}
        </nav>
      </section>

      {/* 云海档案馆 - 漂浮文章 */}
      <section className="relative max-w-4xl mx-auto px-6 pb-32">
        <div className="rift-horizontal mb-16" />

        <div
          className="text-center mb-16 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-pale-ghost text-[10px] tracking-[0.5em] font-serif">云 海 档 案 馆</span>
        </div>

        <div className="space-y-6">
          {transformedPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="scroll-vessel incomplete-border block p-6 md:p-8 opacity-0 animate-fade-up"
              style={{ animationDelay: `${0.1 * index + 0.3}s` }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="gold-tag">{post.category.name}</span>
                    )}
                    <span className="text-pale-ghost text-[10px] tracking-wider">
                      {new Date(post.createdAt).getFullYear()}.{String(new Date(post.createdAt).getMonth() + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="font-serif text-pale text-lg md:text-xl tracking-wider mb-3 text-balance hover:text-gold-light transition-colors duration-500">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-pale-muted text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <ArrowRight size={14} className="text-pale-ghost mt-2 shrink-0 group-hover:text-gold/50 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {transformedPosts.length === 0 && (
          <div className="text-center py-24">
            <div className="rift-line mx-auto mb-8 animate-gold-breathe" />
            <p className="text-pale-ghost text-sm font-serif tracking-[0.3em]">档案馆中尚无卷宗</p>
          </div>
        )}
      </section>
    </div>
  );
}
