import { NextResponse } from "next/server";
import { getCurrentUser, listOrdersForUser } from "../../../lib/users.server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const orders = await listOrdersForUser(user.id);
  return NextResponse.json({ success: true, orders });
}
