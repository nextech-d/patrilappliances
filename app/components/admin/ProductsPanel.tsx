"use client";

import Link from "next/link";
import { useState } from "react";
import type { StockStatus } from "@prisma/client";
import { formatPrice } from "../../lib/formatPrice";
import type { AdminProductListItem } from "../../lib/products.server";

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

type ProductsPanelProps = {
  initialProducts: AdminProductListItem[];
};

export default function ProductsPanel({ initialProducts }: ProductsPanelProps) {
  const [products, setProducts] = useState(initialProducts);
  const [drafts, setDrafts] = useState<Record<number, { priceKes: string; stockStatus: StockStatus }>>(
    () =>
      Object.fromEntries(
        initialProducts.map((p) => [p.id, { priceKes: String(p.priceKes), stockStatus: p.stockStatus }])
      )
  );
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function saveProduct(id: number) {
    const draft = drafts[id];
    if (!draft) return;

    setSavingId(id);
    setMessage("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          priceKes: Number(draft.priceKes),
          stockStatus: draft.stockStatus,
        }),
      });
      const data = await res.json();

      if (data.success && data.product) {
        setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
        setMessage(`Saved ${data.product.name}.`);
      } else {
        setMessage(data.message || "Save failed.");
      }
    } catch {
      setMessage("Save failed. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-black"
        >
          + New product
        </Link>
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
          {message}
        </p>
      )}

      <div className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price (KES)</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => {
                const draft = drafts[product.id];
                return (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-semibold text-neutral-900">{product.name}</td>
                    <td className="px-4 py-3 text-neutral-600">{product.brand}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={draft?.priceKes ?? product.priceKes}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [product.id]: {
                              ...prev[product.id],
                              priceKes: e.target.value,
                            },
                          }))
                        }
                        className="w-28 rounded-lg border border-neutral-300 px-2 py-1.5 text-xs"
                      />
                      <p className="mt-1 text-[10px] text-neutral-400">
                        {formatPrice(Number(draft?.priceKes ?? product.priceKes))}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={draft?.stockStatus ?? product.stockStatus}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [product.id]: {
                              ...prev[product.id],
                              stockStatus: e.target.value as StockStatus,
                            },
                          }))
                        }
                        className="rounded-lg border border-neutral-300 px-2 py-1.5 text-xs"
                      >
                        {STOCK_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={savingId === product.id}
                          onClick={() => saveProduct(product.id)}
                          className="rounded-full bg-neutral-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-black disabled:opacity-50"
                        >
                          {savingId === product.id ? "..." : "Save"}
                        </button>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="rounded-full border border-neutral-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
