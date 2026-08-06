import { NextResponse } from "next/server";
import { clearUserSession } from "../../../lib/users.server";

export async function POST() {
  await clearUserSession();
  return NextResponse.json({ success: true });
}
