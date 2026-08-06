import { NextResponse } from "next/server";
import { getSiteSettingsData } from "../../../lib/storefront.server";

export async function GET() {
  try {
    const settings = await getSiteSettingsData();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load site settings.";
    return NextResponse.json({ success: false, message }, { status: 503 });
  }
}
