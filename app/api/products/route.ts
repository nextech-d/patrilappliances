import { NextResponse } from "next/server";
import { getInventory } from "../../lib/inventory.server";

export async function GET() {
  const products = await getInventory();
  return NextResponse.json({
    success: true,
    products,
  });
}
