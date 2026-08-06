"use client";

import { useState } from "react";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import { formatPrice } from "../../lib/formatPrice";
import type { AdminOrder } from "../../lib/orders.server";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Payment pending" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

type OrdersPanelProps = {
  initialOrders: AdminOrder[];
};

export default function OrdersPanel({ initialOrders }: OrdersPanelProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function patchOrder(
    trackingId: string,
    updates: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) {
    setSavingId(trackingId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((order) => (order.trackingId === trackingId ? data.order : order))
        );
      }
    } finally {
      setSavingId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-neutral-200/60 bg-white p-10 text-center">
        <p className="text-xs text-neutral-500">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedId === order.id;
        return (
          <div
            key={order.id}
            className="rounded-3xl border border-neutral-200/60 bg-white overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              className="flex w-full flex-wrap items-center gap-4 px-6 py-4 text-left hover:bg-neutral-50"
            >
              <div className="min-w-[120px]">
                <p className="font-mono text-xs font-bold text-emerald-600">{order.trackingId}</p>
                <p className="mt-1 text-[10px] text-neutral-400">
                  {new Date(order.orderDate).toLocaleString("en-KE")}
                </p>
              </div>
              <div className="min-w-[140px] flex-1">
                <p className="text-xs font-semibold text-neutral-900">{order.customerName}</p>
                <p className="text-[10px] text-neutral-500">{order.deliveryCity}</p>
              </div>
              <div className="min-w-[100px] text-xs font-bold text-neutral-900">
                {formatPrice(order.total)}
              </div>
              <div className="min-w-[120px] text-[10px] font-semibold text-neutral-600">
                {order.status}
              </div>
              <div
                className={`min-w-[100px] text-[10px] font-bold uppercase tracking-wider ${
                  order.paymentStatusKey === "paid"
                    ? "text-emerald-600"
                    : order.paymentStatusKey === "refunded"
                      ? "text-red-600"
                      : "text-amber-600"
                }`}
              >
                {order.paymentStatus}
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-neutral-100 px-6 py-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Email</p>
                    <p className="mt-1 text-neutral-800">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Phone</p>
                    <p className="mt-1 text-neutral-800">{order.customerPhone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Address</p>
                    <p className="mt-1 text-neutral-800">
                      {order.deliveryAddress}, {order.deliveryCity}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Items</p>
                  <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-100">
                    {order.items.map((item) => (
                      <li key={`${order.id}-${item.id}-${item.name}`} className="flex justify-between px-4 py-2 text-xs">
                        <span className="text-neutral-700">
                          {item.name} <span className="text-neutral-400">×{item.qty}</span>
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Delivery status
                    </label>
                    <select
                      value={order.statusKey}
                      disabled={savingId === order.trackingId}
                      onChange={(e) =>
                        patchOrder(order.trackingId, { status: e.target.value as OrderStatus })
                      }
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Payment
                    </label>
                    <select
                      value={order.paymentStatusKey}
                      disabled={savingId === order.trackingId}
                      onChange={(e) =>
                        patchOrder(order.trackingId, {
                          paymentStatus: e.target.value as PaymentStatus,
                        })
                      }
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      {PAYMENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
