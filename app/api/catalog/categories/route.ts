import { NextResponse } from "next/server";
import { getAllCategories } from "../../../lib/categories.server";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load categories.";
    return NextResponse.json({ success: false, message }, { status: 503 });
  }
}
