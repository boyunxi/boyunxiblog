import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { posts: { where: { post: { published: true } } } } },
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
            星图节点
          </span>
          <h1 className="font-serif text-3xl text-[var(--text)] tracking-[0.2em] gold-text-glow">
            标签
          </h1>
          <div
            className="rift-line animate-rift-glow mt-10"
            style={{ animationDelay: "-2s" }}
          />
        </header>

        {tags.length === 0 ? (
          <div className="text-center py-20">
            <div className="rift-line mx-auto animate-gold-breathe mb-8" />
            <p className="text-[var(--text-ghost)] font-serif tracking-[0.3em] text-xs">
              尚无标签
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 justify-center">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="gold-tag"
              >
                {tag.name}
                <span className="ml-1 opacity-50">{tag._count.posts}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
