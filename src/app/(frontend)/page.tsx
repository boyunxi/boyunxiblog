import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import CategoryNav from "@/components/frontend/CategoryNav";
import PostList from "@/components/frontend/PostList";
import Sidebar from "@/components/layout/Sidebar";

export default async function HomePage() {
  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { category: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
    }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: { where: { post: { published: true } } } } } },
    }),
  ]);

  const transformedPosts = posts.map(transformPost);
  const recentPosts = transformedPosts.slice(0, 5);

  return (
    <div>
      <section className="text-center py-24 mb-12 relative overflow-hidden">
        <div className="cloud-blob w-64 h-64 bg-gold/[0.04] top-10 -left-20 animate-cloud-drift" />
        <div className="cloud-blob w-48 h-48 bg-gold/[0.06] top-20 right-10 animate-cloud-drift-slow" />
        <div className="cloud-blob w-56 h-56 bg-mist-deep/30 bottom-0 left-1/3 animate-cloud-drift" style={{ animationDelay: "2s" }} />

        <div className="relative z-10">
          <div
            className="flex items-center justify-center gap-6 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-gold-breathe" />
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <h1
            className="font-display text-6xl md:text-8xl text-ink mb-6 tracking-[0.2em] opacity-0 animate-brush-stroke"
          >
            博云隙
          </h1>

          <p
            className="font-serif text-ink-muted text-base tracking-[0.3em] mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            以云为伴 · 记录成长与思考
          </p>

          <div
            className="flex items-center justify-center gap-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/30" />
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gold-faint text-gold text-[10px] font-serif opacity-60 animate-float-gentle">
              印
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </div>
      </section>

      <div className="mb-10">
        <CategoryNav categories={categories} />
      </div>

      <div className="flex gap-12">
        <div className="flex-1 min-w-0">
          <PostList posts={transformedPosts} />
        </div>

        <aside className="hidden lg:block w-80 shrink-0">
          <Sidebar
            categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, postCount: c._count.posts }))}
            tags={tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug }))}
            recentPosts={recentPosts}
          />
        </aside>
      </div>
    </div>
  );
}
