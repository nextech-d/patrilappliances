export type Brand = {
  name: string;
  slug: string;
  tier: "signature" | "partner";
  origin: string;
};

export const FEATURED_BRANDS: Brand[] = [
  { name: "Sub-Zero", slug: "sub-zero", tier: "signature", origin: "USA" },
  { name: "Wolf", slug: "wolf", tier: "signature", origin: "USA" },
  { name: "Gaggenau", slug: "gaggenau", tier: "signature", origin: "Germany" },
  { name: "Miele", slug: "miele", tier: "signature", origin: "Germany" },
  { name: "Thermador", slug: "thermador", tier: "signature", origin: "USA" },
  { name: "Bosch", slug: "bosch", tier: "partner", origin: "Germany" },
  { name: "Samsung", slug: "samsung", tier: "partner", origin: "Korea" },
  { name: "LG", slug: "lg", tier: "partner", origin: "Korea" },
  { name: "KitchenAid", slug: "kitchenaid", tier: "partner", origin: "USA" },
  { name: "Viking", slug: "viking", tier: "partner", origin: "USA" },
  { name: "Smeg", slug: "smeg", tier: "partner", origin: "Italy" },
  { name: "Electrolux", slug: "electrolux", tier: "partner", origin: "Sweden" },
  { name: "Panasonic", slug: "panasonic", tier: "partner", origin: "Japan" },
  { name: "Whirlpool", slug: "whirlpool", tier: "partner", origin: "USA" },
  { name: "GE Appliances", slug: "ge-appliances", tier: "partner", origin: "USA" },
  { name: "Fisher & Paykel", slug: "fisher-paykel", tier: "partner", origin: "New Zealand" },
  { name: "JennAir", slug: "jennair", tier: "partner", origin: "USA" },
  { name: "Haier", slug: "haier", tier: "partner", origin: "China" },
  { name: "Hisense", slug: "hisense", tier: "partner", origin: "China" },
  { name: "Beko", slug: "beko", tier: "partner", origin: "Turkey" },
  { name: "Life Fitness", slug: "life-fitness", tier: "partner", origin: "USA" },
  { name: "Precor", slug: "precor", tier: "partner", origin: "USA" },
  { name: "Technogym", slug: "technogym", tier: "partner", origin: "Italy" },
  { name: "Bowflex", slug: "bowflex", tier: "partner", origin: "USA" },
  { name: "Rogue", slug: "rogue", tier: "partner", origin: "USA" },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return FEATURED_BRANDS.find((b) => b.slug === slug);
}

export function brandHref(slug: string): string {
  return `/brand/${slug}`;
}

export function getProductsByBrandSlug(
  slug: string,
  products: { brand: string }[]
): { brand: string }[] {
  const brand = getBrandBySlug(slug);
  if (!brand) return [];
  return products.filter(
    (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
  );
}

export const SIGNATURE_BRANDS = FEATURED_BRANDS.filter((b) => b.tier === "signature");
export const PARTNER_BRANDS = FEATURED_BRANDS.filter((b) => b.tier === "partner");
