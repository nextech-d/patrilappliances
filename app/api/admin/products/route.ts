import { NextResponse } from "next/server";
import type { StockStatus } from "@prisma/client";
import { listProductsForAdmin, updateProductForAdmin } from "../../../lib/products.server";

const VALID_STOCK: StockStatus[] = ["in_stock", "low_stock", "out_of_stock"];

export async function GET() {
  const products = await listProductsForAdmin();
  return NextResponse.json({ success: true, products });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id?: number;
    priceKes?: number;
    stockStatus?: StockStatus;
  };

  if (typeof body.id !== "number") {
    return NextResponse.json({ success: false, message: "Product id is required." }, { status: 400 });
  }

  if (body.stockStatus && !VALID_STOCK.includes(body.stockStatus)) {
    return NextResponse.json({ success: false, message: "Invalid stock status." }, { status: 400 });
  }

  const product = await updateProductForAdmin(body.id, {
    priceKes: body.priceKes,
    stockStatus: body.stockStatus,
  });

  if (!product) {
    return NextResponse.json(
      { success: false, message: "Product not found or no valid updates." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, product });
}
