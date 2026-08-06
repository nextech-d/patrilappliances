import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, RefreshCw, Users, ShoppingBag, MapPin } from "lucide-react";
import { api, formatKes } from "../lib/api";
import {
  CatalogStatTile,
  StorefrontSection,
  storefrontInputClass,
} from "../components/StorefrontPanel";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  addressCount: number;
  totalSpentKes: number;
};

type CustomerDetail = Customer & {
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

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("id");
  const q = searchParams.get("q") ?? "";

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [searchInput, setSearchInput] = useState(q);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const queryString = useMemo(() => (q ? `?q=${encodeURIComponent(q)}` : ""), [q]);

  const loadCustomers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const data = await api<{ customers: Customer[] }>(`/admin/customers${queryString}`);
      setCustomers(data.customers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [queryString]);

  const loadDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const data = await api<{ customer: CustomerDetail }>(`/admin/customers/${id}`);
      setDetail(data.customer);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load customer");
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === q) return;

    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      next.delete("id");
      setSearchParams(next, { replace: true });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput, q, searchParams, setSearchParams]);

  const stats = useMemo(
    () => ({
      total: customers.length,
      withOrders: customers.filter((c) => c.orderCount > 0).length,
    }),
    [customers]
  );

  function selectCustomer(id: number) {
    const next = new URLSearchParams(searchParams);
    next.set("id", String(id));
    setSearchParams(next);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const next = new URLSearchParams(searchParams);
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    next.delete("id");
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Customers</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Registered accounts, orders, and saved addresses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadCustomers(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <StorefrontSection
        className="mt-6"
        title="Overview"
        description="Customer accounts in your store"
        icon={Users}
        accent="green"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading && customers.length === 0 ? (
            <>
              <div className="h-24 animate-pulse rounded-xl border border-[#333] bg-[#161616]" />
              <div className="h-24 animate-pulse rounded-xl border border-[#333] bg-[#161616]" />
            </>
          ) : (
            <>
              <CatalogStatTile
                label="Customers"
                value={stats.total}
                icon={Users}
                accent="green"
              />
              <CatalogStatTile
                label="With orders"
                value={stats.withOrders}
                icon={ShoppingBag}
                accent="sky"
                valueClassName="text-[#00e599]"
              />
              <form onSubmit={handleSearch} className="relative sm:col-span-2 lg:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search name, email, phone…"
                  className={`${storefrontInputClass} pl-10`}
                />
              </form>
            </>
          )}
        </div>
      </StorefrontSection>

      {error && (
        <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <StorefrontSection
          title="All customers"
          description={q ? `Results for “${q}”` : "Browse registered customers"}
          icon={Users}
          accent="violet"
          badge={!loading ? String(customers.length) : undefined}
        >
          <div className="overflow-hidden rounded-xl border border-[#262626]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#262626] bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626] bg-[#0a0a0a]">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-neutral-600">
                      Loading…
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-neutral-600">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className={`cursor-pointer transition hover:bg-[#111111]/80 ${
                        selectedId === String(customer.id) ? "bg-[#00e599]/5" : ""
                      }`}
                      onClick={() => selectCustomer(customer.id)}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{customer.name}</p>
                        <p className="text-xs text-neutral-500">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-xs text-neutral-600">{customer.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-neutral-400">{customer.orderCount}</td>
                      <td className="px-4 py-3 text-neutral-300">
                        {formatKes(customer.totalSpentKes)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </StorefrontSection>

        <StorefrontSection
          title="Customer detail"
          description={detail ? detail.email : "Select a customer from the list"}
          icon={Users}
          accent="amber"
        >
          {!selectedId ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-[#262626] bg-[#0a0a0a] py-12 text-center text-neutral-600">
              <Users className="mb-3 h-8 w-8" />
              <p className="text-sm">Select a customer to view details.</p>
            </div>
          ) : detailLoading || !detail ? (
            <div className="h-64 animate-pulse rounded-xl border border-[#333] bg-[#161616]" />
          ) : (
            <div className="space-y-5">
              <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3.5">
                <h2 className="text-sm font-semibold text-white">{detail.name}</h2>
                <p className="mt-1 text-xs text-neutral-500">{detail.email}</p>
                {detail.phone && <p className="text-xs text-neutral-500">{detail.phone}</p>}
                <p className="mt-2 text-[10px] text-neutral-600">
                  Joined {new Date(detail.createdAt).toLocaleDateString("en-KE")}
                </p>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  <ShoppingBag className="h-3.5 w-3.5" /> Orders
                </h3>
                {detail.orders.length === 0 ? (
                  <p className="text-xs text-neutral-600">No orders yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {detail.orders.map((order) => (
                      <li
                        key={order.trackingId}
                        className="rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2"
                      >
                        <Link
                          to={`/orders?q=${encodeURIComponent(order.trackingId)}`}
                          className="font-mono text-xs text-[#00e599] hover:underline"
                        >
                          {order.trackingId}
                        </Link>
                        <p className="mt-1 text-[10px] text-neutral-500">
                          {formatKes(order.totalKes)} · {order.status} · {order.paymentStatus}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  <MapPin className="h-3.5 w-3.5" /> Saved addresses
                </h3>
                {detail.addresses.length === 0 ? (
                  <p className="text-xs text-neutral-600">No saved addresses.</p>
                ) : (
                  <ul className="space-y-2">
                    {detail.addresses.map((addr) => (
                      <li
                        key={addr.id}
                        className="rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-xs text-neutral-400"
                      >
                        <span className="font-medium text-neutral-300">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="ml-2 text-[10px] uppercase text-[#00e599]">
                            Default
                          </span>
                        )}
                        <p className="mt-1">{addr.addressLine}</p>
                        <p>{addr.city}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </StorefrontSection>
      </div>
    </div>
  );
}
