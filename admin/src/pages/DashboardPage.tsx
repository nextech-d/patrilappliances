import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Tag,
  Users,
  Layers,
  TrendingUp,
  RefreshCw,
  Download,
  ExternalLink,
  Activity,
} from "lucide-react";
import { api, exportOrdersCsv, formatKes, getToken } from "../lib/api";
import CatalogStatCards from "../components/CatalogStatCards";
import {
  CatalogStatTile,
  StorefrontSection,
} from "../components/StorefrontPanel";

type OrderStatus = "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

type DashboardData = {
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
  recentOrders: Array<{
    trackingId: string;
    customerName: string;
    total: number;
    status: string;
    statusKey: OrderStatus;
    paymentStatus: string;
    paymentStatusKey: string;
    orderDate: string;
  }>;
  ordersLast7Days: Array<{ date: string; label: string; count: number; revenue: number }>;
  catalogCategories: Array<{
    id: number;
    label: string;
    slug: string;
    subcategoryCount: number;
    productCount: number;
  }>;
};

function OrdersChart({ days }: { days: DashboardData["ordersLast7Days"] }) {
  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="mt-6 flex items-end justify-between gap-2 h-32">
      {days.map((day) => (
        <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-[10px] font-bold tabular-nums text-neutral-400">{day.count}</span>
          <div
            className="w-full max-w-[48px] rounded-t-md bg-[#00e599]/80 transition-all"
            style={{ height: `${Math.max((day.count / max) * 100, day.count > 0 ? 8 : 2)}%` }}
            title={`${day.label}: ${day.count} orders, ${formatKes(day.revenue)}`}
          />
          <span className="text-[9px] text-neutral-600 text-center leading-tight max-w-[56px] truncate">
            {day.label.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const res = await api<{ dashboard: DashboardData }>("/admin/dashboard");
      setData(res.dashboard);
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    load();
  }, [load]);

  async function exportCsv() {
    try {
      await exportOrdersCsv();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Export failed");
    }
  }

  const stats = data?.stats;
  const statusEntries = data
    ? (Object.entries(data.ordersByStatus) as [OrderStatus, number][])
    : [];

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Project dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Overview of catalog, orders, and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {updatedAt && (
            <span className="text-[10px] text-neutral-600">
              Updated {updatedAt.toLocaleTimeString("en-KE")}
            </span>
          )}
          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <StorefrontSection
        className="mt-6"
        title="Status"
        description="API connection and today's activity"
        icon={Activity}
        accent="green"
      >
        <p className="text-xs text-neutral-400">
          API connected
          {stats && stats.ordersToday > 0 && (
            <>
              <span className="mx-2 text-neutral-700">·</span>
              <span className="text-neutral-300">{stats.ordersToday} orders today</span>
            </>
          )}
        </p>
      </StorefrontSection>

      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => load()}
            className="text-xs font-bold uppercase tracking-wider text-red-300 hover:text-red-200"
          >
            Try again
          </button>
        </div>
      )}

      <div className="mt-6 space-y-6">
        <CatalogStatCards />

        <StorefrontSection
          title="Commerce"
          description="Revenue, orders, and customers"
          icon={TrendingUp}
          accent="sky"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-[#333] bg-[#161616]"
                />
              ))
            ) : (
              <>
                <Link to="/orders" className="block hover:opacity-90">
                  <CatalogStatTile
                    label="Revenue (all time)"
                    value={formatKes(stats?.revenueTotal ?? 0)}
                    sub={`Today: ${formatKes(stats?.revenueToday ?? 0)}`}
                    icon={TrendingUp}
                    accent="green"
                    valueClassName="text-[#00e599] text-xl"
                  />
                </Link>
                <Link to="/orders?payment=pending" className="block hover:opacity-90">
                  <CatalogStatTile
                    label="Orders"
                    value={stats?.orders ?? 0}
                    sub={`${stats?.ordersToday ?? 0} today · ${stats?.pendingPayments ?? 0} unpaid`}
                    icon={ShoppingBag}
                    accent="sky"
                  />
                </Link>
                <Link to="/customers" className="block hover:opacity-90">
                  <CatalogStatTile
                    label="Customers"
                    value={stats?.customers ?? 0}
                    icon={Users}
                    accent="violet"
                  />
                </Link>
              </>
            )}
          </div>
        </StorefrontSection>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <StorefrontSection
          className="lg:col-span-2"
          title="Orders — last 7 days"
          description="Daily order count"
          icon={ShoppingBag}
          accent="violet"
        >
          {loading ? (
            <div className="h-32 animate-pulse rounded-lg bg-[#161616]" />
          ) : data ? (
            <OrdersChart days={data.ordersLast7Days} />
          ) : null}
        </StorefrontSection>

        <StorefrontSection
          title="Quick actions"
          description="Common admin tasks"
          icon={Package}
          accent="amber"
        >
          <div className="space-y-2">
            <Link
              to="/products/new"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <Package className="h-3.5 w-3.5 text-[#00e599]" />
              Add product
            </Link>
            <Link
              to="/categories"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <Layers className="h-3.5 w-3.5 text-[#00e599]" />
              Manage categories
            </Link>
            <Link
              to="/brands"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <Tag className="h-3.5 w-3.5 text-[#00e599]" />
              Manage brands
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <Package className="h-3.5 w-3.5 text-[#00e599]" />
              All products
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#00e599]" />
              View all orders
            </Link>
            <button
              type="button"
              onClick={exportCsv}
              className="flex w-full items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-[#00e599]" />
              Export orders CSV
            </button>
            <a
              href="https://patrilappliances.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#00e599]" />
              Open storefront
            </a>
          </div>
        </StorefrontSection>
      </div>

      {!loading && data && statusEntries.some(([, n]) => n > 0) && (
        <StorefrontSection
          className="mt-6"
          title="Orders by status"
          description="Fulfillment pipeline breakdown"
          icon={ShoppingBag}
          accent="green"
        >
          <div className="flex flex-wrap gap-2">
            {statusEntries.map(([status, count]) => (
              <Link
                key={status}
                to="/orders"
                className="rounded-full border border-[#333] bg-[#0a0a0a] px-3 py-1.5 text-[10px] font-medium text-neutral-400 hover:border-[#00e599]/30 hover:text-[#00e599]"
              >
                {status}{" "}
                <span className="ml-1 font-bold tabular-nums text-white">{count}</span>
              </Link>
            ))}
          </div>
        </StorefrontSection>
      )}

      {!loading && data && data.catalogCategories.length > 0 && (
        <StorefrontSection
          className="mt-6"
          title="Catalog by category"
          description={`${stats?.categories ?? 0} categories · ${stats?.subcategories ?? 0} subcategories`}
          icon={Layers}
          accent="sky"
          actions={
            <Link
              to="/categories"
              className="text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:underline"
            >
              Manage all
            </Link>
          }
        >
          <div className="overflow-hidden rounded-xl border border-[#262626]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0a0a] text-[10px] uppercase tracking-wider text-neutral-600">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Subcategories</th>
                <th className="px-5 py-3">Products</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {data.catalogCategories.map((category) => (
                <tr key={category.id} className="text-neutral-300 hover:bg-[#1a1a1a]/50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="font-medium text-white hover:text-[#00e599] hover:underline"
                    >
                      {category.label}
                    </Link>
                    <div className="mt-0.5 font-mono text-[10px] text-neutral-600">
                      {category.slug}
                    </div>
                  </td>
                  <td className="px-5 py-3 tabular-nums">{category.subcategoryCount}</td>
                  <td className="px-5 py-3">
                    {category.productCount > 0 ? (
                      <span className="font-semibold tabular-nums text-[#00e599]">
                        {category.productCount}
                      </span>
                    ) : (
                      <span className="text-neutral-600">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#00e599]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </StorefrontSection>
      )}

      <StorefrontSection
        className="mt-6"
        title="Recent orders"
        description="Latest 5 placed"
        icon={ShoppingBag}
        accent="amber"
        actions={
          <Link
            to="/orders"
            className="text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:underline"
          >
            View all
          </Link>
        }
      >
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-[#161616]" />
            ))}
          </div>
        ) : !data?.recentOrders.length ? (
          <p className="rounded-xl border border-[#262626] bg-[#0a0a0a] px-5 py-8 text-center text-sm text-neutral-500">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#262626]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0a0a] text-[10px] uppercase tracking-wider text-neutral-600">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {data.recentOrders.map((order) => (
                <tr key={order.trackingId} className="text-neutral-300 hover:bg-[#1a1a1a]/50">
                  <td className="px-5 py-3 font-mono font-bold text-[#00e599]">
                    <Link to="/orders" className="hover:underline">
                      {order.trackingId}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{order.customerName}</td>
                  <td className="px-5 py-3 text-neutral-400">{order.status}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        order.paymentStatusKey === "paid"
                          ? "text-[#00e599]"
                          : "text-amber-500"
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-white">
                    {formatKes(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </StorefrontSection>
    </div>
  );
}
