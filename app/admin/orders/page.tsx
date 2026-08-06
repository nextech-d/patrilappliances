import { listOrders } from "../../lib/orders.server";
import OrdersPanel from "../../components/admin/OrdersPanel";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-lg font-black uppercase tracking-tight text-neutral-900">Orders</h1>
        <p className="mt-1 text-xs text-neutral-500">
          {orders.length} order{orders.length === 1 ? "" : "s"} — click a row to view details and update status.
        </p>
      </div>
      <OrdersPanel initialOrders={orders} />
    </div>
  );
}
