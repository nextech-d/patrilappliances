import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryCatalog from "../../../components/CategoryCatalog";
import { ALL_CATEGORIES, getSubcategory } from "../../../data/categories";
import { getCategoryBySlugFromDb } from "../../../lib/categories.server";
import { buildPageMetadata } from "../../../lib/seo";

type Props = {
  params: Promise<{ slug: string; sub?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params;
  const category = await getCategoryBySlugFromDb(slug);
  if (!category) {
    return buildPageMetadata({
      title: "Category Not Found",
      description: "This category could not be found.",
      noIndex: true,
    });
  }

  const subSlug = sub?.[0];
  const subcategory = getSubcategory(slug, subSlug, category);

  if (subcategory) {
    return buildPageMetadata({
      title: `${subcategory.label} — ${category.label}`,
      description: `Shop ${subcategory.label.toLowerCase()} from ${category.label.toLowerCase()} at Patril Appliances. Delivery across ${category.label.toLowerCase()} categories in Nairobi and East Africa.`,
      path: `/category/${slug}/${subSlug}`,
    });
  }

  return buildPageMetadata({
    title: category.label,
    description: category.description,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug, sub } = await params;
  const category = await getCategoryBySlugFromDb(slug);

  if (!category) notFound();

  const subSlug = sub?.[0];

  return <CategoryCatalog category={category} subSlug={subSlug} />;
}

export async function generateStaticParams() {
  const paths: { slug: string; sub?: string[] }[] = [];

  for (const cat of ALL_CATEGORIES) {
    paths.push({ slug: cat.slug });
    for (const sub of cat.subcategories) {
      paths.push({ slug: cat.slug, sub: [sub.slug] });
    }
  }

  return paths;
}
