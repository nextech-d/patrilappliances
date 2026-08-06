import { getInventory } from "../lib/inventory.js";

export async function handleGetProducts() {
  const products = await getInventory();
  return { success: true as const, products };
}
