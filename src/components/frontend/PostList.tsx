import PostCard from "./PostCard";
import Reveal from "@/components/ui/Reveal";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  createdAt: string | Date;
  views: number;
  likesCount: number;
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
      {posts.map((post, index) => (
        <Reveal key={post.id} delay={Math.min(index, 8) * 80}>
          <PostCard post={post} variant={variant} />
        </Reveal>
      ))}
    </div>
  );
}
