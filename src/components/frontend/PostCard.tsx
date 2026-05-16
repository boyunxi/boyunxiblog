import Link from "next/link";
import { Eye, Calendar, Clock } from "lucide-react";

interface Post { id: number; title: string; slug: string; excerpt?: string | null; coverImage?: string | null; createdAt: string | Date; views: number; category?: { name: string; slug: string } | null; tags: { id: number; name: string; slug: string }[]; }

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link href={`/posts/${post.slug}`} className="scroll-vessel incomplete-border block p-6">
      <div className="flex items-center gap-2 mb-3">
        {post.category && <span className="gold-tag">{post.category.name}</span>}
      </div>
      <h2 className="font-serif text-[var(--text)] text-lg tracking-wider mb-2 hover:text-gold-light transition-colors duration-500">{post.title}</h2>
      {post.excerpt && <p className="text-[var(--text-muted)] text-sm line-clamp-2">{post.excerpt}</p>}
    </Link>
  );
}
