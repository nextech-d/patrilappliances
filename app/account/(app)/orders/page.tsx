import { redirect } from "next/navigation";
import { formatPrice } from "../../../lib/formatPrice";
import { getCurrentUser, listOrdersForUser } from "../../../lib/users.server";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const orders = await listOrdersForUser(user.id);

  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">Order history</h2>
      {orders.length === 0 ? (
        <p className="mt-4 text-xs text-neutral-500">You haven&apos;t placed any orders yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.trackingId} className="rounded-2xl border border-neutral-200/60 bg-white p-5">
              <div className="flex flex-wrap justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-emerald-600">{order.trackingId}</span>
                <span className="text-neutral-400">
                  {new Date(order.orderDate).toLocaleDateString("en-KE")}
                </span>
              </div>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                {STATUS_LABELS[order.status] ?? order.status}
              </p>
              <ul className="mt-3 divide-y divide-neutral-100 text-xs text-neutral-600">
                {order.items.map((item) => (
                  <li key={`${order.trackingId}-${item.name}`} className="flex justify-between py-2">
                    <span>{item.name} × {item.qty}</span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-right text-xs font-bold text-neutral-900">
                Total {formatPrice(order.total)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
