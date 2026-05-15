import Link from "next/link";

interface Category { id: number; name: string; slug: string; postCount?: number; }
interface Tag { id: number; name: string; slug: string; }
interface Post { id: number; title: string; slug: string; }

export default function Sidebar({ categories, tags, recentPosts }: { categories: Category[]; tags: Tag[]; recentPosts: Post[] }) {
  return (
    <aside className="space-y-6">
      <div className="scroll-vessel incomplete-border p-5">
        <h3 className="font-serif text-pale-soft text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          分类
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link href={`/categories/${cat.slug}`} className="text-pale-muted text-sm hover:text-gold/60 transition-colors duration-500 pl-3 border-l border-gold/10 hover:border-gold/25 py-0.5">
                {cat.name}
                {cat.postCount !== undefined && <span className="text-pale-ghost ml-2 text-xs">({cat.postCount})</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="scroll-vessel incomplete-border p-5">
        <h3 className="font-serif text-pale-soft text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag.id} href={`/tags/${tag.slug}`} className="gold-tag">{tag.name}</Link>
          ))}
        </div>
      </div>
      <div className="scroll-vessel incomplete-border p-5">
        <h3 className="font-serif text-pale-soft text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          近期卷宗
        </h3>
        <ul className="space-y-0">
          {recentPosts.map((post, i) => (
            <li key={post.id} className={i > 0 ? "border-t border-gold/5" : ""}>
              <Link href={`/posts/${post.slug}`} className="block py-2.5 text-sm text-pale-muted hover:text-gold/60 transition-colors duration-500 line-clamp-1">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
