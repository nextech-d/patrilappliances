import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug } from "../../data/brands";
import BrandCatalog from "../../components/BrandCatalog";
import { buildPageMetadata } from "../../lib/seo";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) {
    return buildPageMetadata({
      title: "Brand Not Found",
      description: "This brand could not be found.",
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: brand.name,
    description: `Shop ${brand.name} kitchen and gym appliances at Patril Appliances. ${brand.tier === "signature" ? "Signature" : "Partner"} brand from ${brand.origin}.`,
    path: `/brand/${slug}`,
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  return <BrandCatalog brand={brand} />;
}
