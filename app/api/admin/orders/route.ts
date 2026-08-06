import { NextResponse } from "next/server";
import type { OrderStatus } from "@prisma/client";
import { listOrders, updateOrderStatus } from "../../../lib/orders.server";

const VALID_STATUSES: OrderStatus[] = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { trackingId?: string; status?: OrderStatus };

  if (!body.trackingId || !body.status) {
    return NextResponse.json(
      { success: false, message: "trackingId and status are required." },
      { status: 400 }
    );
  }

  if (!VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
  }

  const order = await updateOrderStatus(body.trackingId, body.status);
  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
