import { NextResponse } from "next/server";
import { getInventory } from "../../lib/inventory";

export async function GET() {
  return NextResponse.json({
    success: true,
    products: getInventory(),
  });
}
