import { NextResponse } from "next/server";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { listOrders, updateOrder } from "../../../lib/orders.server";

const VALID_STATUSES: OrderStatus[] = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "refunded"];

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ success: true, orders });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    trackingId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
  };

  if (!body.trackingId) {
    return NextResponse.json(
      { success: false, message: "trackingId is required." },
      { status: 400 }
    );
  }

  if (!body.status && !body.paymentStatus) {
    return NextResponse.json(
      { success: false, message: "status or paymentStatus is required." },
      { status: 400 }
    );
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ success: false, message: "Invalid status." }, { status: 400 });
  }

  if (body.paymentStatus && !VALID_PAYMENT_STATUSES.includes(body.paymentStatus)) {
    return NextResponse.json(
      { success: false, message: "Invalid payment status." },
      { status: 400 }
    );
  }

  const order = await updateOrder(body.trackingId, {
    status: body.status,
    paymentStatus: body.paymentStatus,
  });

  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}
