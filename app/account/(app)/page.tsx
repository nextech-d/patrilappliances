import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPrice } from "../../lib/formatPrice";
import { getCurrentUser, listOrdersForUser, listUserAddresses } from "../../lib/users.server";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  const [orders, addresses] = await Promise.all([
    listOrdersForUser(user.id),
    listUserAddresses(user.id),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-200/60 bg-white p-6">
        <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-xs text-neutral-500">No orders yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {orders.slice(0, 3).map((order) => (
              <li key={order.trackingId} className="flex justify-between py-3 text-xs">
                <span className="font-mono font-semibold text-emerald-600">{order.trackingId}</span>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/account/orders" className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
          View all orders →
        </Link>
      </section>

      <section className="rounded-3xl border border-neutral-200/60 bg-white p-6">
        <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">Saved addresses</h2>
        {addresses.length === 0 ? (
          <p className="mt-3 text-xs text-neutral-500">No saved addresses yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {addresses.slice(0, 2).map((addr) => (
              <li key={addr.id} className="text-xs text-neutral-700">
                <span className="font-semibold text-neutral-900">{addr.label}</span>
                {addr.isDefault && (
                  <span className="ml-2 text-[10px] uppercase text-emerald-600">Default</span>
                )}
                <p className="mt-0.5">{addr.addressLine}, {addr.city}</p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/account/addresses" className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900">
          Manage addresses →
        </Link>
      </section>
    </div>
  );
}
