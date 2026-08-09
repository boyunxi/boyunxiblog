import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import { notFound } from "next/navigation";
import { decodeSlugParam } from "@/lib/utils";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";
import PostList from "@/components/frontend/PostList";

export default async function CategoryPage({ params }: { params: { name: string } }) {
  const name = decodeSlugParam(params.name);
  const category = await prisma.category.findUnique({
    where: { slug: name },
    include: {
      posts: {
        where: { published: true },
        include: { category: true, tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const posts = category.posts.map(transformPost);

  return (
    <PageShell>
      <PageHeader title={category.name} subtitle="世界入口" />
      <PostList posts={posts} emptyText="此入口尚无卷宗" />
    </PageShell>
  );
}
