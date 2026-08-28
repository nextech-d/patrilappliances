"use client";

import Link from "next/link";
import { getBrandBySlug, type Brand } from "../data/brands";
import ProductCard from "./ProductCard";
import { useAddToCart } from "../hooks/useAddToCart";
import { useInventory } from "../context/ProductsContext";
import { ChevronRight } from "lucide-react";

type BrandCatalogProps = {
  brand: Brand;
};

export default function BrandCatalog({ brand }: BrandCatalogProps) {
  const { handleAddToCart, addedIds } = useAddToCart();
  const inventory = useInventory();

  const products = inventory.filter(
    (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-8 flex items-center gap-2 text-xs font-semibold text-neutral-500">
          <Link href="/" className="transition hover:text-neutral-900">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-neutral-900">{brand.name}</span>
        </nav>

        <div className="mb-10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {brand.origin} · {brand.tier === "signature" ? "Top Brand" : "Partner Brand"}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
            {brand.name}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-black/60">
            Browse {products.length} {products.length === 1 ? "product" : "products"} from{" "}
            {brand.name} available at HomeVibe.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200/60 bg-white py-20 text-center">
            <h3 className="text-sm font-bold text-neutral-800">No products yet</h3>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-neutral-500">
              We&apos;re adding {brand.name} items soon. Check back or browse all products.
            </p>
            <Link
              href="/#featured-products"
              className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black"
            >
              View Featured Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
            {products.map((appliance) => (
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
