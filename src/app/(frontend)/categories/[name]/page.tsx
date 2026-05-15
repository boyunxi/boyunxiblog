import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function CategoryPage({ params }: { params: { name: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.name },
    include: {
      posts: {
        where: { published: true },
        include: { category: true, tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    return (
      <div className="text-center py-32">
        <div className="rift-line mx-auto animate-gold-breathe mb-8" />
        <p className="text-pale-ghost font-serif tracking-[0.3em] text-xs">此入口尚无卷宗</p>
      </div>
    );
  }

  const posts = category.posts.map(transformPost);

  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[25%] right-[20%] w-[350px] h-[200px] rounded-full bg-gold/[0.015] blur-[80px] animate-fog-drift" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        <header className="text-center mb-20">
          <div className="rift-line animate-rift-glow mb-10" />
          <span className="text-pale-ghost text-[10px] tracking-[0.5em] font-serif block mb-4">世界入口</span>
          <h1 className="font-serif text-3xl text-pale tracking-[0.2em] gold-text-glow">{category.name}</h1>
          <div className="rift-line animate-rift-glow mt-10" style={{ animationDelay: "-2s" }} />
        </header>

        <div className="space-y-4">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="scroll-vessel incomplete-border block p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-pale text-base tracking-wider mb-2 hover:text-gold-light transition-colors duration-500">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-pale-muted text-sm line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
                <ArrowRight size={12} className="text-pale-ghost shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="rift-line mx-auto animate-gold-breathe mb-8" />
            <p className="text-pale-ghost font-serif tracking-[0.3em] text-xs">此入口尚无卷宗</p>
          </div>
        )}
      </div>
    </div>
  );
}
