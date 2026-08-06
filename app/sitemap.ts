import type { MetadataRoute } from "next";
import { FEATURED_BRANDS } from "./data/brands";
import { ALL_CATEGORIES, categoryHref } from "./data/categories";
import { getInventory } from "./lib/inventory.server";
import { getSiteUrl } from "./lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const products = await getInventory();

  const home: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/track-order`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categories: MetadataRoute.Sitemap = ALL_CATEGORIES.flatMap((category) => {
    const entries: MetadataRoute.Sitemap = [
      {
        url: `${base}${categoryHref(category.slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
    for (const sub of category.subcategories) {
      entries.push({
        url: `${base}${categoryHref(category.slug, sub.slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    return entries;
  });

  const brands: MetadataRoute.Sitemap = FEATURED_BRANDS.map((brand) => ({
    url: `${base}/brand/${brand.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...home, ...categories, ...brands, ...productPages];
}
