import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

type PostCardVariant = "default" | "compact" | "hero";

export default function PostCard({
  post,
  variant = "default",
}: {
  post: Post;
  variant?: PostCardVariant;
}) {
  if (variant === "compact") {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="scroll-vessel incomplete-border block p-5"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-[var(--text-soft)] text-sm tracking-wider mb-1 hover:text-[rgba(var(--gold-rgb),0.7)] transition-colors duration-500 line-clamp-1">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-[var(--text-ghost)] text-xs line-clamp-1">
                {post.excerpt}
              </p>
            )}
          </div>
          <ArrowRight size={12} className="text-[var(--text-ghost)] shrink-0" />
        </div>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="scroll-vessel incomplete-border block p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {post.category && <span className="gold-tag">{post.category.name}</span>}
              <span className="text-[var(--text-ghost)] text-[10px] tracking-wider">
                {new Date(post.createdAt).getFullYear()}.{String(new Date(post.createdAt).getMonth() + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-serif text-[var(--text)] text-lg md:text-xl tracking-wider mb-3 text-balance hover:text-[var(--gold)] transition-colors duration-500">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>
          <ArrowRight size={14} className="text-[var(--text-ghost)] mt-2 shrink-0 group-hover:text-[rgba(var(--gold-rgb),0.5)] transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="scroll-vessel incomplete-border block p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {post.category && <span className="gold-tag">{post.category.name}</span>}
          </div>
          <h2 className="font-serif text-[var(--text)] text-base tracking-wider mb-2 hover:text-[var(--gold)] transition-colors duration-500">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-[var(--text-muted)] text-sm line-clamp-2">{post.excerpt}</p>
          )}
        </div>
        <ArrowRight size={12} className="text-[var(--text-ghost)] shrink-0" />
      </div>
    </Link>
  );
}
