import "server-only";

import type { StockStatus } from "@prisma/client";
import { getPrisma } from "./db";

export type AdminProduct = {
  id: number;
  name: string;
  brand: string;
  priceKes: number;
  stockStatus: StockStatus;
  isPublished: boolean;
};

export async function listProductsForAdmin(): Promise<AdminProduct[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const products = await prisma.product.findMany({
    include: { brand: true },
    orderBy: { id: "asc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand.name,
    priceKes: product.priceKes,
    stockStatus: product.stockStatus,
    isPublished: product.isPublished,
  }));
}

export async function updateProductForAdmin(
  id: number,
  data: { priceKes?: number; stockStatus?: StockStatus }
): Promise<AdminProduct | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const updateData: { priceKes?: number; stockStatus?: StockStatus } = {};
  if (typeof data.priceKes === "number" && data.priceKes >= 0) {
    updateData.priceKes = Math.round(data.priceKes);
  }
  if (data.stockStatus) {
    updateData.stockStatus = data.stockStatus;
  }

  if (Object.keys(updateData).length === 0) return null;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { brand: true },
    });

    return {
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      priceKes: product.priceKes,
      stockStatus: product.stockStatus,
      isPublished: product.isPublished,
    };
  } catch {
    return null;
  }
}
