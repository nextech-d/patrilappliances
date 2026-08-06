export const SITE = {
  name: "Patril Appliances",
  email: process.env.ORDER_NOTIFY_EMAIL ?? "hello@patrilappliances.com",
  phone: "+254 700 000 000",
  currency: {
    code: "KES",
    locale: "en-KE",
  },
} as const;

export function getSiteUrl(): string {
  const url = process.env.SITE_URL?.trim() || "https://patrilappliances.vercel.app";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}
