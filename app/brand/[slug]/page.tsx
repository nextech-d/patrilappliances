import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug } from "../../data/brands";
import BrandCatalog from "../../components/BrandCatalog";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name} — Patril Appliances`,
    description: `Shop ${brand.name} appliances and gym equipment at Patril Appliances.`,
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  return <BrandCatalog brand={brand} />;
}
