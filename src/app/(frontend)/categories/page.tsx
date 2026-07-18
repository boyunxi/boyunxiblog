import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <PageShell>
      <PageHeader title="分类" subtitle="世界入口" />

      {categories.length === 0 ? (
        <EmptyState text="尚无分类" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="scroll-vessel incomplete-border block p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[var(--text)] text-base tracking-wider hover:text-[var(--gold)] transition-colors duration-500">
                  {cat.name}
                </h2>
                <span className="text-[var(--text-ghost)] text-xs font-serif">
                  {cat._count.posts} 篇
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
