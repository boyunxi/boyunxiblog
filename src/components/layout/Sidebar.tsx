import Link from "next/link";
import CloudTag from "../ui/SealTag";

interface Category {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
}

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  recentPosts: Post[];
}

export default function Sidebar({ categories, tags, recentPosts }: SidebarProps) {
  return (
    <aside className="space-y-8">
      <div className="cloud-card p-5">
        <h3 className="font-serif text-ink text-sm tracking-[0.15em] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          分类
        </h3>
        <ul className="space-y-2.5">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-ink-faint text-sm hover:text-ink transition-colors pl-3 border-l-2 border-transparent hover:border-gold py-0.5"
              >
                {cat.name}
                {cat.postCount !== undefined && (
                  <span className="text-ink-faint/40 ml-2 text-xs">({cat.postCount})</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="cloud-card p-5">
        <h3 className="font-serif text-ink text-sm tracking-[0.15em] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <CloudTag key={tag.id} text={tag.name} href={`/tags/${tag.slug}`} small />
          ))}
        </div>
      </div>

      <div className="cloud-card p-5">
        <h3 className="font-serif text-ink text-sm tracking-[0.15em] mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
          最新文章
        </h3>
        <ul className="space-y-0">
          {recentPosts.map((post, i) => (
            <li key={post.id} className={i > 0 ? "border-t border-ink/5" : ""}>
              <Link
                href={`/posts/${post.slug}`}
                className="block py-2.5 text-sm text-ink-faint hover:text-ink transition-colors line-clamp-1"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
