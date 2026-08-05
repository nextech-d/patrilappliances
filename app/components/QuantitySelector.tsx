"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  qty: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  variant?: "default" | "pill";
};

export default function QuantitySelector({
  qty,
  onChange,
  min = 1,
  max = 99,
  variant = "default",
}: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, qty - 1));
  const increment = () => onChange(Math.min(max, qty + 1));

  if (variant === "pill") {
    return (
      <div className="flex h-11 w-28 shrink-0 items-center overflow-hidden rounded-full border-2 border-neutral-900 bg-transparent">
        <button
          type="button"
          onClick={decrement}
          disabled={qty <= min}
          className="flex h-full w-10 items-center justify-center text-neutral-900 transition hover:bg-neutral-200 disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <div className="flex h-full flex-1 items-center justify-center text-sm font-bold text-neutral-900">
          {qty}
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={qty >= max}
          className="flex h-full w-10 items-center justify-center text-neutral-900 transition hover:bg-neutral-200 disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-9 items-center rounded-full border border-neutral-200/80 bg-[var(--bg)]">
      <button
        type="button"
        onClick={decrement}
        disabled={qty <= min}
        className="flex h-full items-center justify-center px-2 text-neutral-600 transition hover:text-neutral-900 disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="px-1.5 text-[11px] font-bold text-neutral-900">{qty}</span>
      <button
        type="button"
        onClick={increment}
        disabled={qty >= max}
        className="flex h-full items-center justify-center px-2 text-neutral-600 transition hover:text-neutral-900 disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
