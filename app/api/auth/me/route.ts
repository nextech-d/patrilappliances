import { NextResponse } from "next/server";
import { getCurrentUser, listUserAddresses, listOrdersForUser } from "../../../lib/users.server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  if (searchParams.get("include") === "all") {
    const [orders, addresses] = await Promise.all([
      listOrdersForUser(user.id),
      listUserAddresses(user.id),
    ]);
    return NextResponse.json({ success: true, user, orders, addresses });
  }

  return NextResponse.json({ success: true, user });
}
