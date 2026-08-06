import { NextResponse } from "next/server";
import type { CartItem } from "../../context/CartContext";
import { createOrder, getOrderByTrackingId, type OrderPayload } from "../../lib/orders.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get("trackingId")?.trim().toUpperCase();

  if (!trackingId) {
    return NextResponse.json(
      { success: false, message: "Order reference is required." },
      { status: 400 }
    );
  }

  const order = await getOrderByTrackingId(trackingId);

  if (!order) {
    return NextResponse.json(
      { success: false, message: "No order found with that reference." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, order });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;
    const { name, email, phone, address, city, items, total } = payload;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !address?.trim() || !city?.trim()) {
      return NextResponse.json(
        { success: false, message: "Delivery information is required." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart is empty." },
        { status: 400 }
      );
    }

    const validItems = items.filter(
      (item): item is CartItem =>
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.qty === "number" &&
        item.qty > 0
    );

    if (validItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your cart items are invalid." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      items: validItems,
      total: typeof total === "number" ? total : 0,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      trackingId: order.trackingId,
      order,
    });
  } catch (error: unknown) {
    console.error("Order processing failure:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("DATABASE_URL") ? 503 : 500;
    return NextResponse.json(
      { success: false, message: "Unable to place your order. Please try again.", error: message },
      { status }
    );
  }
}
