import { APPLIANCES_INVENTORY, type Appliance } from "../data/products";

export type { Appliance };

/** Single source of truth — swap implementation when backend is live. */
export function getInventory(): Appliance[] {
  return APPLIANCES_INVENTORY;
}

export async function fetchInventoryClient(): Promise<Appliance[]> {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) return getInventory();
    const data = (await res.json()) as { success?: boolean; products?: Appliance[] };
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      return data.products;
    }
  } catch {
    /* fall through */
  }
  return getInventory();
}
