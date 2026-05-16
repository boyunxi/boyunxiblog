import PostCard from "./PostCard";

interface Post { id: number; title: string; slug: string; excerpt?: string | null; coverImage?: string | null; createdAt: string | Date; views: number; category?: { name: string; slug: string } | null; tags: { id: number; name: string; slug: string }[]; }

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="rift-line mx-auto animate-gold-breathe mb-8" />
        <p className="text-[var(--text-ghost)] font-serif tracking-[0.3em] text-xs">档案馆中尚无卷宗</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
