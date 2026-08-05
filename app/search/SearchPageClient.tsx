"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getAllSearchResults } from "../lib/searchProducts";
import ProductCard from "../components/ProductCard";
import { useAddToCart } from "../hooks/useAddToCart";
import { useInventory } from "../context/ProductsContext";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const inventory = useInventory();
  const results = getAllSearchResults(q, inventory);
  const { handleAddToCart, addedIds } = useAddToCart();

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
          Search Results
        </h1>
        {q ? (
          <p className="mt-2 text-sm text-neutral-500">
            {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{q}&quot;
          </p>
        ) : (
          <p className="mt-2 text-sm text-neutral-500">Enter a search term to find products.</p>
        )}

        {results.length === 0 && q ? (
          <div className="mt-12 rounded-3xl border border-neutral-200/60 bg-[color:var(--surface)] py-16 text-center">
            <p className="text-sm font-semibold text-neutral-700">No products found.</p>
            <Link href="/" className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline">
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((appliance) => (
              <ProductCard
                key={appliance.id}
                appliance={appliance}
                onAddToCart={handleAddToCart}
                added={addedIds[appliance.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
