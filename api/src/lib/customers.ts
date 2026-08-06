import { getPrisma } from "./db.js";

export type AdminCustomerListItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  addressCount: number;
  totalSpentKes: number;
};

export type AdminCustomerDetail = AdminCustomerListItem & {
  orders: Array<{
    trackingId: string;
    orderDate: string;
    status: string;
    paymentStatus: string;
    totalKes: number;
  }>;
  addresses: Array<{
    id: number;
    label: string;
    addressLine: string;
    city: string;
    isDefault: boolean;
  }>;
};

export async function listCustomersForAdmin(query?: string): Promise<AdminCustomerListItem[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const q = query?.trim();
  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      _count: { select: { orders: true, addresses: true } },
      orders: { select: { totalKes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
    orderCount: user._count.orders,
    addressCount: user._count.addresses,
    totalSpentKes: user.orders.reduce((sum, order) => sum + order.totalKes, 0),
  }));
}

export async function getCustomerForAdmin(id: number): Promise<AdminCustomerDetail | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { orders: true, addresses: true } },
      orders: {
        orderBy: { orderDate: "desc" },
        select: {
          trackingId: true,
          orderDate: true,
          status: true,
          paymentStatus: true,
          totalKes: true,
        },
      },
      addresses: { orderBy: [{ isDefault: "desc" }, { id: "asc" }] },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt.toISOString(),
    orderCount: user._count.orders,
    addressCount: user._count.addresses,
    totalSpentKes: user.orders.reduce((sum, order) => sum + order.totalKes, 0),
    orders: user.orders.map((order) => ({
      trackingId: order.trackingId,
      orderDate: order.orderDate.toISOString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalKes: order.totalKes,
    })),
    addresses: user.addresses.map((addr) => ({
      id: addr.id,
      label: addr.label,
      addressLine: addr.addressLine,
      city: addr.city,
      isDefault: addr.isDefault,
    })),
  };
}
