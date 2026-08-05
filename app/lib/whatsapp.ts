import { SITE } from "../config/site";

export function buildWhatsAppUrl(message: string): string {
  const phone = SITE.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
