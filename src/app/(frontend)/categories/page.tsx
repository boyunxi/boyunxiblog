import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[25%] right-[20%] w-[350px] h-[200px] rounded-full blur-[80px] animate-fog-drift"
          style={{ backgroundColor: "rgba(var(--gold-rgb),0.015)" }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        <header className="text-center mb-20">
          <div className="rift-line animate-rift-glow mb-10" />
          <span className="text-[var(--text-ghost)] text-[10px] tracking-[0.5em] font-serif block mb-4">
            世界入口
          </span>
          <h1 className="font-serif text-3xl text-[var(--text)] tracking-[0.2em] gold-text-glow">
            分类
          </h1>
          <div
            className="rift-line animate-rift-glow mt-10"
            style={{ animationDelay: "-2s" }}
          />
        </header>

        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="rift-line mx-auto animate-gold-breathe mb-8" />
            <p className="text-[var(--text-ghost)] font-serif tracking-[0.3em] text-xs">
              尚无分类
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="scroll-vessel incomplete-border block p-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-[var(--text)] text-base tracking-wider hover:text-[var(--gold)] transition-colors duration-500">
                    {cat.name}
                  </h2>
                  <span className="text-[var(--text-ghost)] text-xs font-serif">
                    {cat._count.posts} 篇
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
