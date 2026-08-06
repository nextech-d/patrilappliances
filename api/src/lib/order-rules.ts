import type { OrderStatus, PaymentStatus } from "@prisma/client";

const FULFILLMENT_STATUSES: OrderStatus[] = ["preparing", "shipped", "delivered"];

export type OrderUpdateValidation =
  | { ok: true }
  | { ok: false; message: string };

/** Enforce payment before fulfillment; refund only when paid. */
export function validateOrderUpdate(
  existing: { status: OrderStatus; paymentStatus: PaymentStatus },
  updates: { status?: OrderStatus; paymentStatus?: PaymentStatus }
): OrderUpdateValidation {
  const nextPayment = updates.paymentStatus ?? existing.paymentStatus;
  const nextStatus = updates.status ?? existing.status;

  if (FULFILLMENT_STATUSES.includes(nextStatus) && nextPayment === "pending") {
    return {
      ok: false,
      message: "Mark payment as paid before moving to preparing, shipped, or delivered.",
    };
  }

  if (
    updates.paymentStatus === "refunded" &&
    existing.paymentStatus !== "paid"
  ) {
    return {
      ok: false,
      message: "Cannot refund an order that has not been paid.",
    };
  }

  return { ok: true };
}

export const VALID_ORDER_STATUSES: OrderStatus[] = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export const VALID_PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "refunded"];
