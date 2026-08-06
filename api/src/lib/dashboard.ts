import type { OrderStatus } from "@prisma/client";
import { listCategoriesFiltered } from "./catalog.js";
import { getPrisma } from "./db.js";

const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type DashboardRecentOrder = {
  trackingId: string;
  customerName: string;
  total: number;
  status: string;
  statusKey: OrderStatus;
  paymentStatus: string;
  paymentStatusKey: string;
  orderDate: string;
};

export type DashboardCatalogCategory = {
  id: number;
  label: string;
  slug: string;
  subcategoryCount: number;
  productCount: number;
};

export type DashboardData = {
  stats: {
    products: number;
    orders: number;
    brands: number;
    categories: number;
    subcategories: number;
    customers: number;
    pendingPayments: number;
    lowStock: number;
    outOfStock: number;
    unpublishedProducts: number;
    revenueTotal: number;
    revenueToday: number;
    ordersToday: number;
  };
  ordersByStatus: Record<OrderStatus, number>;
  recentOrders: DashboardRecentOrder[];
  ordersLast7Days: Array<{ date: string; label: string; count: number; revenue: number }>;
  catalogCategories: DashboardCatalogCategory[];
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" });
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getDashboardData(): Promise<DashboardData> {
  const prisma = getPrisma();
  const emptyStatus: Record<OrderStatus, number> = {
    confirmed: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  if (!prisma) {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = startOfDay(new Date());
      d.setDate(d.getDate() - (6 - i));
      return { date: toDateKey(d), label: formatDayLabel(d), count: 0, revenue: 0 };
    });
    return {
      stats: {
        products: 0,
        orders: 0,
        brands: 0,
        categories: 0,
        subcategories: 0,
        customers: 0,
        pendingPayments: 0,
        lowStock: 0,
        outOfStock: 0,
        unpublishedProducts: 0,
        revenueTotal: 0,
        revenueToday: 0,
        ordersToday: 0,
      },
      ordersByStatus: emptyStatus,
      recentOrders: [],
      ordersLast7Days: days,
      catalogCategories: [],
    };
  }

  const todayStart = startOfDay(new Date());
  const sevenDaysAgo = startOfDay(new Date());
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const [
    products,
    orders,
    brands,
    categories,
    customers,
    pendingPayments,
    lowStock,
    outOfStock,
    unpublishedProducts,
    revenueAgg,
    revenueTodayAgg,
    ordersToday,
    statusGroups,
    recentRows,
    weekOrders,
    catalogResult,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.order.count({ where: { paymentStatus: "pending" } }),
    prisma.product.count({ where: { stockStatus: "low_stock" } }),
    prisma.product.count({ where: { stockStatus: "out_of_stock" } }),
    prisma.product.count({ where: { isPublished: false } }),
    prisma.order.aggregate({ _sum: { totalKes: true } }),
    prisma.order.aggregate({
      where: { orderDate: { gte: todayStart } },
      _sum: { totalKes: true },
    }),
    prisma.order.count({ where: { orderDate: { gte: todayStart } } }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.order.findMany({
      orderBy: { orderDate: "desc" },
      take: 5,
      select: {
        trackingId: true,
        customerName: true,
        totalKes: true,
        status: true,
        paymentStatus: true,
        orderDate: true,
      },
    }),
    prisma.order.findMany({
      where: { orderDate: { gte: sevenDaysAgo } },
      select: { orderDate: true, totalKes: true },
    }),
    listCategoriesFiltered({}),
  ]);

  const ordersByStatus = { ...emptyStatus };
  for (const row of statusGroups) {
    ordersByStatus[row.status] = row._count.status;
  }

  const dayBuckets = new Map<string, { count: number; revenue: number }>();
  for (let i = 0; i < 7; i++) {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() - (6 - i));
    dayBuckets.set(toDateKey(d), { count: 0, revenue: 0 });
  }

  for (const order of weekOrders) {
    const key = toDateKey(order.orderDate);
    const bucket = dayBuckets.get(key);
    if (bucket) {
      bucket.count += 1;
      bucket.revenue += order.totalKes;
    }
  }

  const ordersLast7Days = Array.from({ length: 7 }, (_, i) => {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() - (6 - i));
    const key = toDateKey(d);
    const bucket = dayBuckets.get(key) ?? { count: 0, revenue: 0 };
    return {
      date: key,
      label: formatDayLabel(d),
      count: bucket.count,
      revenue: bucket.revenue,
    };
  });

  const recentOrders: DashboardRecentOrder[] = recentRows.map((order) => ({
    trackingId: order.trackingId,
    customerName: order.customerName,
    total: order.totalKes,
    status: STATUS_LABELS[order.status],
    statusKey: order.status,
    paymentStatus:
      order.paymentStatus === "paid"
        ? "Paid"
        : order.paymentStatus === "refunded"
          ? "Refunded"
          : "Payment pending",
    paymentStatusKey: order.paymentStatus,
    orderDate: order.orderDate.toISOString(),
  }));

  const catalogCategories: DashboardCatalogCategory[] = catalogResult.categories.map(
    (category) => ({
      id: category.id,
      label: category.label,
      slug: category.slug,
      subcategoryCount: category.subcategoryCount,
      productCount: category.productCount,
    })
  );

  return {
    stats: {
      products,
      orders,
      brands,
      categories,
      subcategories: catalogResult.summary.totalSubcategories,
      customers,
      pendingPayments,
      lowStock,
      outOfStock,
      unpublishedProducts,
      revenueTotal: revenueAgg._sum.totalKes ?? 0,
      revenueToday: revenueTodayAgg._sum.totalKes ?? 0,
      ordersToday,
    },
    ordersByStatus,
    recentOrders,
    ordersLast7Days,
    catalogCategories,
  };
}
