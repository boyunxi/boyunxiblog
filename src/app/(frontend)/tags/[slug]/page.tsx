import { prisma } from "@/lib/prisma";
import { transformPost } from "@/lib/types";
import { notFound } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import PostList from "@/components/frontend/PostList";

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { post: { published: true } },
        include: {
          post: {
            include: { category: true, tags: { include: { tag: true } } },
          },
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const posts = tag.posts.map((pt) => transformPost(pt.post));

  return (
    <PageShell>
      <PageHeader title={tag.name} subtitle="星图节点" />
      <PostList posts={posts} emptyText="此节点尚无卷宗" />
    </PageShell>
  );
}
