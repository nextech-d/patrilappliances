import type { Metadata } from "next";
import { SITE } from "../config/site";

/** Production site URL — set NEXT_PUBLIC_SITE_URL on Vercel when using a custom domain. */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://patrilappliances.vercel.app";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const title = input.title.includes(SITE.name)
    ? input.title
    : `${input.title} | ${SITE.name}`;
  const canonical = input.path ? absoluteUrl(input.path) : getSiteUrl();
  const ogImage = input.image
    ? [{ url: input.image, width: 600, height: 600, alt: input.title }]
    : undefined;

  return {
    title,
    description: input.description,
    alternates: { canonical },
    ...(input.noIndex && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      title,
      description: input.description,
      url: canonical,
      siteName: SITE.name,
      locale: "en_KE",
      type: "website",
      ...(ogImage && { images: ogImage }),
    },
    twitter: {
      card: input.image ? "summary_large_image" : "summary",
      title,
      description: input.description,
      ...(input.image && { images: [input.image] }),
    },
  };
}

export const siteKeywords = [
  "kitchen appliances",
  "gym equipment",
  "home appliances",
  "Nairobi",
  "Kenya",
  "East Africa",
  "M-Pesa",
  "Sub-Zero",
  "Life Fitness",
  "Patril Appliances",
];

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildPageMetadata({
    title: `${SITE.name} — Home & Gym Appliances`,
    description: `${SITE.tagline}. Shop kitchen and gym equipment in ${SITE.city} with free delivery, installation help, and M-Pesa across ${SITE.region}.`,
    path: "/",
  }),
  keywords: siteKeywords,
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false },
};
