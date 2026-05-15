import Link from "next/link";

interface Category { id: number; name: string; slug: string; postCount?: number; }

export default function CategoryNav({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/categories/${cat.slug}`} className="gold-tag">
          {cat.name}
          {cat.postCount !== undefined && <span className="text-pale-ghost ml-1 text-[10px]">({cat.postCount})</span>}
        </Link>
      ))}
    </div>
  );
}
