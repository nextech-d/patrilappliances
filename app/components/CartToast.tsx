"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";

export default function CartToast() {
  const { toast, dismissToast, setCartOpen } = useCart();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] w-[min(92vw,380px)] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-[var(--surface)] px-4 py-3 shadow-2xl">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-[var(--fg)]">{toast.itemName}</p>
          <p className="text-[10px] text-neutral-500">
            {toast.qty > 1 ? `${toast.qty} items added` : "Added to cart"}
          </p>
        </div>
        <button
          onClick={() => {
            dismissToast();
            setCartOpen(true);
          }}
          className="flex shrink-0 items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-black"
        >
          <ShoppingBag className="h-3 w-3" />
          View
        </button>
        <button
          onClick={dismissToast}
          className="shrink-0 rounded-full p-1 text-neutral-400 transition hover:text-neutral-700"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
