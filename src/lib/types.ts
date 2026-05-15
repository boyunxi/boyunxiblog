export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: Category | null;
  tags: Tag[];
  createdAt: string | Date;
  views: number;
}

export function transformPost(post: {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: { id: number; name: string; slug: string } | null;
  tags: { tag: { id: number; name: string; slug: string } }[];
  createdAt: string | Date;
  views: number;
}): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    category: post.category,
    tags: post.tags.map((t) => ({
      id: t.tag.id,
      name: t.tag.name,
      slug: t.tag.slug,
    })),
    createdAt: post.createdAt,
    views: post.views,
  };
}
