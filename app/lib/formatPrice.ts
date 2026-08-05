import { SITE } from "../config/site";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(SITE.currency.locale, {
    style: "currency",
    currency: SITE.currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
}
