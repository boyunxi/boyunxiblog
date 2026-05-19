import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { posts: { where: { post: { published: true } } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <PageShell>
      <PageHeader title="标签" subtitle="星图节点" />

      {tags.length === 0 ? (
        <EmptyState text="尚无标签" />
      ) : (
        <div className="flex flex-wrap gap-3 justify-center">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="gold-tag"
            >
              {tag.name}
              <span className="ml-1 opacity-50">{tag._count.posts}</span>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
