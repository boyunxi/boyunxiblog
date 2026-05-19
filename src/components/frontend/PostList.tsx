import PostCard from "./PostCard";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  createdAt: string | Date;
  views: number;
  category?: { name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
}

import EmptyState from "@/components/ui/EmptyState";

export default function PostList({ posts, emptyText, variant = "default" }: { posts: Post[]; emptyText?: string; variant?: "default" | "compact" | "hero" }) {
  if (posts.length === 0) {
    return <EmptyState text={emptyText || "档案馆中尚无卷宗"} />;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} variant={variant} />
      ))}
    </div>
  );
}
