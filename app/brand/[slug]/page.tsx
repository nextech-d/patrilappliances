import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BrandCatalog from "../../components/BrandCatalog";
import { buildPageMetadata } from "../../lib/seo";
import { getBrandBySlugFromDb } from "../../lib/brands.server";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlugFromDb(slug);
  if (!brand) {
    return buildPageMetadata({
      title: "Brand Not Found",
      description: "This brand could not be found.",
      noIndex: true,
    });
  }

  const fallbackDescription = `Shop ${brand.name} kitchen and gym appliances at HomeVibe. ${brand.tier === "signature" ? "Signature" : "Partner"} brand from ${brand.origin}.`;

  return buildPageMetadata({
    title: brand.metaTitle?.trim() || brand.name,
    description: brand.metaDescription?.trim() || fallbackDescription,
    path: `/brand/${slug}`,
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlugFromDb(slug);
  if (!brand) notFound();

  return <BrandCatalog brand={brand} />;
}
