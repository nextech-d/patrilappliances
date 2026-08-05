"use client";

import React from "react";
import { FAQ_LIST } from "./data/faq";
import ProductCard from "./components/ProductCard";
import TrustBadges from "./components/TrustBadges";
import FeaturedBrands from "./components/FeaturedBrands";
import FeaturedProductsGrid from "./components/FeaturedProductsGrid";
import HeroKitchenSymbols from "./components/HeroKitchenSymbols";
import { useAddToCart } from "./hooks/useAddToCart";
import { useInventory } from "./context/ProductsContext";
import { SITE } from "./config/site";

export default function Home() {
  const { handleAddToCart, addedIds } = useAddToCart();
  const inventory = useInventory();
  const [openFAQ, setOpenFAQ] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans relative">
      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="relative mb-12 overflow-hidden rounded-3xl bg-neutral-900 px-8 py-14 text-white md:px-14 md:py-16">
          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
                Original &amp; Reliable Home &amp; Gym Gear
              </span>
              <h1 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                Appliances you&apos;ll actually
                <br />
                <span className="font-medium text-neutral-100">enjoy using every day.</span>
              </h1>
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed md:text-base">
                We pick appliances and gym gear we&apos;d trust ourselves — solid brands,
                fair prices, and delivery across {SITE.region}.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#featured-products"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-neutral-200 transition"
                >
                  Shop Featured Products
                </a>
              </div>
              <TrustBadges variant="hero" />
            </div>

            <HeroKitchenSymbols />
          </div>
        </section>

        <section id="featured-products">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-black">
                Featured Products
              </h2>
              <p className="mt-1 text-sm text-black/60">Our top performing items.</p>
            </div>
          </div>

          <FeaturedProductsGrid
            inventory={inventory}
            renderItem={(appliance) => (
              <ProductCard
                appliance={appliance}
                onAddToCart={handleAddToCart}
                added={addedIds[appliance.id]}
              />
            )}
          />
        </section>

        <FeaturedBrands />

        <section id="faq" className="mx-auto mt-24 mb-12 max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-black">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FAQ_LIST.map((faq, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  aria-expanded={openFAQ === i}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-neutral-50 focus:outline-none"
                >
                  <h3 className="pr-4 text-sm font-semibold text-black">{faq.q}</h3>
                  <svg className={`h-4 w-4 shrink-0 text-black/50 transition-transform duration-300 ${openFAQ === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === i && (
                  <div className="px-5 pb-5">
                    <p className="border-t border-neutral-100 pt-3 text-xs leading-relaxed text-black">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
