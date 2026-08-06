import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Tag,
  Users,
  Layers,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Download,
  ExternalLink,
  Activity,
} from "lucide-react";
import { api, exportOrdersCsv, formatKes, getToken } from "../lib/api";

type OrderStatus = "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

type DashboardData = {
  stats: {
    products: number;
    orders: number;
    brands: number;
    categories: number;
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
};

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[#262626] bg-[#111111] p-5">
      <div className="h-3 w-20 rounded bg-[#262626]" />
      <div className="mt-3 h-8 w-16 rounded bg-[#262626]" />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  accent?: "green" | "amber" | "red";
}) {
  const accentClass =
    accent === "amber"
      ? "text-amber-400"
      : accent === "red"
        ? "text-red-400"
        : accent === "green"
          ? "text-[#00e599]"
          : "text-white";

  return (
    <Link
      to={href}
      className="rounded-xl border border-[#262626] bg-[#111111] p-5 transition hover:border-[#333]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${accentClass}`}>{value}</p>
          {sub && <p className="mt-1 text-[10px] text-neutral-600">{sub}</p>}
        </div>
        <div className="shrink-0 rounded-lg bg-[#1a1a1a] p-2 text-neutral-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

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

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-[#262626] bg-[#111111] px-4 py-3">
        <Activity className="h-3.5 w-3.5 text-[#00e599]" />
        <span className="text-xs text-neutral-400">
          API connected
          {stats && stats.ordersToday > 0 && (
            <>
              <span className="mx-2 text-neutral-700">·</span>
              <span className="text-neutral-300">{stats.ordersToday} orders today</span>
            </>
          )}
        </span>
      </div>

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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Revenue (all time)"
              value={formatKes(stats?.revenueTotal ?? 0)}
              sub={`Today: ${formatKes(stats?.revenueToday ?? 0)}`}
              icon={TrendingUp}
              href="/orders"
              accent="green"
            />
            <StatCard
              label="Orders"
              value={stats?.orders ?? 0}
              sub={`${stats?.ordersToday ?? 0} today · ${stats?.pendingPayments ?? 0} unpaid`}
              icon={ShoppingBag}
              href="/orders?payment=pending"
            />
            <StatCard
              label="Products"
              value={stats?.products ?? 0}
              sub={`${stats?.unpublishedProducts ?? 0} unpublished`}
              icon={Package}
              href="/products"
            />
            <StatCard
              label="Customers"
              value={stats?.customers ?? 0}
              icon={Users}
              href="/orders"
            />
            <StatCard
              label="Low stock"
              value={stats?.lowStock ?? 0}
              icon={AlertTriangle}
              href="/products?stock=low_stock"
              accent={stats?.lowStock ? "amber" : undefined}
            />
            <StatCard
              label="Out of stock"
              value={stats?.outOfStock ?? 0}
              icon={AlertTriangle}
              href="/products?stock=out_of_stock"
              accent={stats?.outOfStock ? "red" : undefined}
            />
            <StatCard
              label="Brands"
              value={stats?.brands ?? 0}
              icon={Tag}
              href="/brands"
            />
            <StatCard
              label="Categories"
              value={stats?.categories ?? 0}
              icon={Layers}
              href="/categories"
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[#262626] bg-[#111111] p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">Orders — last 7 days</h2>
          <p className="mt-1 text-xs text-neutral-500">Daily order count</p>
          {loading ? (
            <div className="mt-6 h-32 animate-pulse rounded-lg bg-[#1a1a1a]" />
          ) : data ? (
            <OrdersChart days={data.ordersLast7Days} />
          ) : null}
        </div>

        <div className="rounded-xl border border-[#262626] bg-[#111111] p-5">
          <h2 className="text-sm font-semibold text-white">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <Link
              to="/products"
              className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-xs font-medium text-neutral-300 hover:border-[#00e599]/30 hover:text-white"
            >
              <Package className="h-3.5 w-3.5 text-[#00e599]" />
              Manage products
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
        </div>
      </div>

      {!loading && data && statusEntries.some(([, n]) => n > 0) && (
        <div className="mt-6 rounded-xl border border-[#262626] bg-[#111111] p-5">
          <h2 className="text-sm font-semibold text-white">Orders by status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {statusEntries.map(([status, count]) => (
              <Link
                key={status}
                to="/orders"
                className="rounded-full border border-[#333] px-3 py-1.5 text-[10px] font-medium text-neutral-400 hover:border-[#00e599]/30 hover:text-[#00e599]"
              >
                {status}{" "}
                <span className="ml-1 font-bold tabular-nums text-white">{count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-[#262626] bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#262626] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent orders</h2>
            <p className="text-xs text-neutral-500">Latest 5 placed</p>
          </div>
          <Link
            to="/orders"
            className="text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-[#1a1a1a]" />
            ))}
          </div>
        ) : !data?.recentOrders.length ? (
          <p className="px-5 py-8 text-center text-sm text-neutral-500">No orders yet.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
