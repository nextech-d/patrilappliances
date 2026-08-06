import { NextResponse } from "next/server";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { listOrders, updateOrder } from "../../../lib/orders.server";
import { VALID_ORDER_STATUSES, VALID_PAYMENT_STATUSES } from "../../../lib/order-rules";

const VALID_STATUSES = VALID_ORDER_STATUSES;
const VALID_PAYMENT_STATUSES_LIST = VALID_PAYMENT_STATUSES;

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

  if (body.paymentStatus && !VALID_PAYMENT_STATUSES_LIST.includes(body.paymentStatus)) {
    return NextResponse.json(
      { success: false, message: "Invalid payment status." },
      { status: 400 }
    );
  }

  try {
    const order = await updateOrder(body.trackingId, {
      status: body.status,
      paymentStatus: body.paymentStatus,
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed.";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
