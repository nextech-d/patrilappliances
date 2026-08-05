import { notFound } from "next/navigation";
import CategoryCatalog from "../../../components/CategoryCatalog";
import { getCategoryBySlug } from "../../../data/categories";

type Props = {
  params: Promise<{ slug: string; sub?: string[] }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug, sub } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const subSlug = sub?.[0];

  return <CategoryCatalog category={category} subSlug={subSlug} />;
}

export async function generateStaticParams() {
  const { ALL_CATEGORIES } = await import("../../../data/categories");
  const paths: { slug: string; sub?: string[] }[] = [];

  for (const cat of ALL_CATEGORIES) {
    paths.push({ slug: cat.slug });
    for (const sub of cat.subcategories) {
      paths.push({ slug: cat.slug, sub: [sub.slug] });
    }
  }

  return paths;
}
