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
        className="group scroll-vessel block border-x-0 border-t-0 p-5 md:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[var(--text-soft)] text-sm tracking-wide mb-1 group-hover:text-[var(--text)] transition-colors line-clamp-2">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-[var(--text-ghost)] text-xs line-clamp-1">
                {post.excerpt}
              </p>
            )}
          </div>
          <ArrowRight size={14} className="text-[var(--text-ghost)] shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group scroll-vessel block p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {post.category && <span className="gold-tag">{post.category.name}</span>}
              <span className="text-[var(--text-ghost)] text-[10px] tracking-wide">
                {new Date(post.createdAt).getFullYear()}.{String(new Date(post.createdAt).getMonth() + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-serif text-[var(--text)] text-lg md:text-xl tracking-wide mb-3 text-balance group-hover:text-[var(--gold)] transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>
          <ArrowRight size={15} className="text-[var(--text-ghost)] mt-2 shrink-0 group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
        </div>
      </Link>
    );
  }

  return (
      <Link
        href={`/posts/${post.slug}`}
      className="group scroll-vessel block border-x-0 border-t-0 p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {post.category && <span className="gold-tag">{post.category.name}</span>}
          </div>
          <h2 className="font-serif text-[var(--text)] text-base tracking-wide mb-2 group-hover:text-[var(--gold)] transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-[var(--text-muted)] text-sm line-clamp-2">{post.excerpt}</p>
          )}
        </div>
        <ArrowRight size={14} className="text-[var(--text-ghost)] shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </div>
    </Link>
  );
}
