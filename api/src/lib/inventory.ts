import { getPrisma } from "./db.js";
import { mapDbProductToAppliance } from "./mapProduct.js";
import type { Appliance } from "../types.js";

const productInclude = {
  brand: true,
  subcategory: { include: { category: true } },
} as const;

export async function getInventory(): Promise<Appliance[]> {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("DATABASE_URL is required.");
  }

  const rows = await prisma.product.findMany({
    where: { isPublished: true },
    include: productInclude,
    orderBy: { id: "asc" },
  });

  return rows.map(mapDbProductToAppliance);
}
