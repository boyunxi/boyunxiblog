import Link from "next/link";
import { Eye, Calendar, Clock } from "lucide-react";
import CloudCard from "../ui/ScrollCard";
import CloudTag from "../ui/SealTag";
import { type Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function estimateReadingTime(content: string | null): string {
  if (!content) return "1 分钟";
  const text = content.replace(/<[^>]*>/g, "");
  const charCount = text.length;
  const minutes = Math.max(1, Math.ceil(charCount / 500));
  return `${minutes} 分钟`;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <CloudCard className={`group cursor-pointer ${featured ? "md:col-span-2 lg:col-span-2" : ""}`}>
      <div className={`flex ${featured ? "md:flex-row gap-6" : "flex-col"}`}>
        {post.coverImage && (
          <div className={`overflow-hidden relative ${featured ? "md:w-1/2" : "-mx-6 -mt-6 mb-5"}`}>
            <img
              src={post.coverImage}
              alt={post.title}
              className={`w-full object-cover transition-all duration-700 group-hover:scale-[1.03] rounded-xl ${featured ? "md:h-full" : "h-52"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )}

        <div className={`flex flex-col justify-between ${featured && post.coverImage ? "md:w-1/2" : "w-full"}`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              {post.category && (
                <CloudTag text={post.category.name} href={`/categories/${post.category.slug}`} small />
              )}
            </div>

            <Link href={`/posts/${post.slug}`}>
              <h2 className={`font-serif text-ink group-hover:text-gold transition-colors duration-300 mb-3 text-balance ${featured ? "text-2xl" : "text-lg"}`}>
                {post.title}
              </h2>
            </Link>

            {post.excerpt && (
              <p className="text-ink-muted text-sm leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {estimateReadingTime(post.excerpt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {post.views}
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <CloudTag key={tag.id} text={tag.name} href={`/tags/${tag.slug}`} small />
                ))}
                {post.tags.length > 2 && (
                  <span className="text-ink-muted text-[10px] self-center">+{post.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CloudCard>
  );
}
