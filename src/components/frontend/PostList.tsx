import PostCard from "./PostCard";
import { type Post } from "@/lib/types";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative mb-6">
          <span className="font-display text-7xl text-ink/5">云</span>
          <span className="absolute inset-0 flex items-center justify-center font-display text-7xl text-ink/10 animate-gold-breathe">云</span>
        </div>
        <p className="font-serif text-ink-muted text-base tracking-wider">云隙无声</p>
        <p className="text-ink-muted/50 text-xs mt-2">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 5) * 0.1}s` }}
        >
          <PostCard post={post} featured={index === 0} />
        </div>
      ))}
    </div>
  );
}
