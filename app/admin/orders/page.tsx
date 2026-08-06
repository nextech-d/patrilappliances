import { listOrders } from "../../lib/orders.server";
import OrdersPanel from "../../components/admin/OrdersPanel";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight text-neutral-900">Orders</h1>
          <p className="mt-1 text-xs text-neutral-500">
            {orders.length} order{orders.length === 1 ? "" : "s"} — click a row to view details and update status.
          </p>
        </div>
        <a
          href="/api/admin/orders/export"
          className="rounded-full border border-neutral-300 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
        >
          Export CSV
        </a>
      </div>
      <OrdersPanel initialOrders={orders} />
    </div>
  );
}
