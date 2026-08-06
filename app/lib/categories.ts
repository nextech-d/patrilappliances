import { ALL_CATEGORIES, type Category } from "../data/categories";
import { apiUrl } from "./api-client";

export type { Category };

/** Client-side fetch of categories via the catalog API. */
export async function fetchCategoriesClient(): Promise<Category[]> {
  const endpoint = apiUrl("/catalog/categories") || "/api/catalog/categories";
  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return ALL_CATEGORIES;
    const data = (await res.json()) as { success?: boolean; categories?: Category[] };
    if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
      return data.categories;
    }
  } catch {
    /* fall through */
  }
  return ALL_CATEGORIES;
}
