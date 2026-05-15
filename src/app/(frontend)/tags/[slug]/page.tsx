import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import PostList from "@/components/frontend/PostList";
import CloudDivider from "@/components/ui/InkDivider";

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { post: { published: true } },
        include: {
          post: {
            include: { category: true, tags: { include: { tag: true } } },
          },
        },
      },
    },
  });

  if (!tag) {
    return (
      <div className="text-center py-24">
        <div className="relative inline-block mb-6">
          <span className="font-display text-7xl text-ink/5">无</span>
        </div>
        <p className="font-serif text-ink-muted tracking-wider">该标签不存在</p>
      </div>
    );
  }

  const posts = tag.posts.map((pt) => transformPost(pt.post));

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-14">
        <div
          className="flex items-center justify-center gap-4 mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <span className="text-gold/40 text-xs font-serif tracking-[0.3em] block mb-3 opacity-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>标签</span>
        <h1 className="font-display text-4xl text-ink tracking-wider mb-4 opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>{tag.name}</h1>
        <CloudDivider />
      </header>

      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <div className="text-center py-24">
          <div className="relative inline-block mb-6">
            <span className="font-display text-7xl text-ink/5">云</span>
            <span className="absolute inset-0 flex items-center justify-center font-display text-7xl text-ink/10 animate-gold-breathe">云</span>
          </div>
          <p className="font-serif text-ink-muted tracking-wider">该标签暂无文章</p>
        </div>
      )}
    </div>
  );
}
