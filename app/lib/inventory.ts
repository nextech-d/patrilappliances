import { APPLIANCES_INVENTORY, type Appliance } from "../data/products";
import { apiUrl } from "./api-client";

export type { Appliance };

/** Client-side fetch of inventory via the products API. */
export async function fetchInventoryClient(): Promise<Appliance[]> {
  const endpoint = apiUrl("/products") || "/api/products";
  try {
    const res = await fetch(endpoint, { cache: "no-store" });
    if (!res.ok) return APPLIANCES_INVENTORY;
    const data = (await res.json()) as { success?: boolean; products?: Appliance[] };
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
  } catch {
    /* fall through */
  }
  return APPLIANCES_INVENTORY;
}
