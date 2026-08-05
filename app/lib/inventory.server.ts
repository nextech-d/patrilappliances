import "server-only";

import { APPLIANCES_INVENTORY, type Appliance } from "../data/products";
import { getPrisma } from "./db";
import { mapDbProductToAppliance } from "./mapProduct";

const productInclude = {
  brand: true,
  subcategory: { include: { category: true } },
} as const;

/** Load published products from Postgres, with static fallback when DB is unavailable. */
export async function getInventory(): Promise<Appliance[]> {
  if (!process.env.DATABASE_URL) {
    return APPLIANCES_INVENTORY;
  }

  const prisma = getPrisma();
  if (!prisma) {
    return APPLIANCES_INVENTORY;
  }

  try {
    const rows = await prisma.product.findMany({
      where: { isPublished: true },
      include: productInclude,
      orderBy: { id: "asc" },
    });

    if (rows.length === 0) {
      return APPLIANCES_INVENTORY;
    }

    return rows.map(mapDbProductToAppliance);
  } catch (error) {
    console.error("Failed to load inventory from database:", error);
    return APPLIANCES_INVENTORY;
  }
}
