import { SITE } from "../config/site";

export function buildWhatsAppUrl(message: string, phoneOverride?: string): string {
  const phone = (phoneOverride ?? SITE.whatsapp).replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
