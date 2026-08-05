import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { CartItem } from "../../context/CartContext";

// Path to orders storage
const ordersFilePath = path.join(process.cwd(), "app", "data", "orders.json");

type OrderPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: CartItem[];
  total: number;
  paymentMethod?: "card" | "mpesa";
  cardName?: string;
  cardNumber?: string;
  mpesaPhone?: string;
};

type StoredOrder = {
  trackingId: string;
  orderDate: string;
  customer: Pick<OrderPayload, "name" | "email" | "phone" | "address" | "city">;
  paymentSimulated: {
    method: string;
    cardHolder: string;
    cardNumberLast4: string;
    mpesaPhone?: string;
  };
  items: CartItem[];
  total: number;
  status: string;
};

async function readOrders(): Promise<StoredOrder[]> {
  try {
    const fileData = await fs.readFile(ordersFilePath, "utf-8");
    const parsed = JSON.parse(fileData) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredOrder[]) : [];
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get("trackingId")?.trim().toUpperCase();

  if (!trackingId) {
    return NextResponse.json(
      { success: false, message: "Tracking ID is required." },
      { status: 400 }
    );
  }

  const orders = await readOrders();
  const order = orders.find((o) => o.trackingId.toUpperCase() === trackingId);

  if (!order) {
    return NextResponse.json(
      { success: false, message: "No order found with that tracking ID." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    order: {
      trackingId: order.trackingId,
      orderDate: order.orderDate,
      status: order.status,
      total: order.total,
      customer: {
        name: order.customer.name,
        city: order.customer.city,
      },
      items: order.items,
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as OrderPayload;
    const { name, email, phone, address, city, items, total, paymentMethod, cardName, cardNumber, mpesaPhone } = payload;

    // Validate parameters
    if (!name || !email || !phone || !address || !city) {
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

    // Generate unique Tracking & Reference ID
    const trackingId = "PTL-" + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toISOString();

    const newOrder: StoredOrder = {
      trackingId,
      orderDate,
      customer: { name, email, phone, address, city },
      paymentSimulated: {
        method: paymentMethod ?? "card",
        cardHolder: paymentMethod === "mpesa" ? "M-Pesa" : (cardName || "Not provided"),
        cardNumberLast4: paymentMethod === "mpesa" ? "M-Pesa" : (cardNumber ? cardNumber.slice(-4) : "••••"),
        mpesaPhone: paymentMethod === "mpesa" ? mpesaPhone : undefined,
      },
      items,
      total,
      status: "Confirmed — preparing for delivery",
    };

    // Load existing orders if any
    let ordersList = await readOrders();

    ordersList.push(newOrder);

    // Save orders back to the file system
    await fs.writeFile(ordersFilePath, JSON.stringify(ordersList, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      trackingId,
      order: newOrder,
    });
  } catch (error: unknown) {
    console.error("Order processing failure:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Internal server processing failed.", error: message },
      { status: 500 }
    );
  }
}
