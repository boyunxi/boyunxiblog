import CloudTag from "../ui/SealTag";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <CloudTag
        text="全部"
        href="/"
        small
        active={!activeSlug}
      />
      {categories.map((cat) => (
        <CloudTag
          key={cat.id}
          text={cat.name}
          href={`/categories/${cat.slug}`}
          small
          active={activeSlug === cat.slug}
        />
      ))}
    </div>
  );
}
