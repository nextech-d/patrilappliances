import "server-only";

import type { OrderStatus } from "@prisma/client";
import type { CartItem } from "../context/CartContext";
import { getPrisma } from "./db";

export type OrderPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: CartItem[];
  total: number;
};

export type PublicOrder = {
  trackingId: string;
  orderDate: string;
  status: string;
  total: number;
  customer: { name: string; city: string };
  items: CartItem[];
};

export type AdminOrder = {
  id: number;
  trackingId: string;
  orderDate: string;
  status: string;
  statusKey: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  total: number;
  items: CartItem[];
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed — preparing for delivery",
  preparing: "Preparing for delivery",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

async function generateTrackingId(): Promise<string> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database unavailable");

  for (let attempt = 0; attempt < 10; attempt++) {
    const trackingId = "PTL-" + Math.floor(100000 + Math.random() * 900000);
    const existing = await prisma.order.findUnique({ where: { trackingId } });
    if (!existing) return trackingId;
  }

  throw new Error("Could not generate a unique order reference.");
}

export async function createOrder(payload: OrderPayload) {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("Orders require DATABASE_URL to be configured.");
  }

  const { name, email, phone, address, city, items, total } = payload;
  const trackingId = await generateTrackingId();

  const order = await prisma.order.create({
    data: {
      trackingId,
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      deliveryAddress: address.trim(),
      deliveryCity: city.trim(),
      totalKes: Math.round(total),
      items: {
        create: items.map((item) => ({
          productId: item.id,
          name: item.name,
          priceKes: Math.round(item.price),
          quantity: item.qty,
          imageUrl: item.image,
        })),
      },
    },
    include: { items: true },
  });

  return {
    trackingId: order.trackingId,
    orderDate: order.orderDate.toISOString(),
    status: statusLabel(order.status),
    total: order.totalKes,
    customer: { name, email, phone, address, city },
    items,
  };
}

export async function getOrderByTrackingId(
  trackingId: string
): Promise<PublicOrder | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const order = await prisma.order.findUnique({
    where: { trackingId: trackingId.toUpperCase() },
    include: { items: true },
  });

  if (!order) return null;

  return {
    trackingId: order.trackingId,
    orderDate: order.orderDate.toISOString(),
    status: statusLabel(order.status),
    total: order.totalKes,
    customer: { name: order.customerName, city: order.deliveryCity },
    items: order.items.map((item) => ({
      id: item.productId ?? 0,
      name: item.name,
      price: item.priceKes,
      qty: item.quantity,
      image: item.imageUrl,
    })),
  };
}

export async function listOrders(): Promise<AdminOrder[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { orderDate: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    trackingId: order.trackingId,
    orderDate: order.orderDate.toISOString(),
    status: statusLabel(order.status),
    statusKey: order.status,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,
    deliveryCity: order.deliveryCity,
    total: order.totalKes,
    items: order.items.map((item) => ({
      id: item.productId ?? 0,
      name: item.name,
      price: item.priceKes,
      qty: item.quantity,
      image: item.imageUrl,
    })),
  }));
}

export async function updateOrderStatus(
  trackingId: string,
  status: OrderStatus
): Promise<AdminOrder | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    await prisma.order.update({
      where: { trackingId: trackingId.toUpperCase() },
      data: { status },
    });
  } catch {
    return null;
  }

  const orders = await listOrders();
  return orders.find((o) => o.trackingId.toUpperCase() === trackingId.toUpperCase()) ?? null;
}
