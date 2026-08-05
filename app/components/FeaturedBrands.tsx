import Link from "next/link";
import { SIGNATURE_BRANDS, brandHref } from "../data/brands";

export default function FeaturedBrands() {
  return (
    <section id="featured-brands" className="mx-auto mt-24 max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-black">Featured Brands</h2>
        <p className="mt-1 text-sm text-black/60">
          Brands we trust — kitchen and gym equipment, sourced and supported locally.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {SIGNATURE_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={brandHref(brand.slug)}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-800 to-neutral-700 p-5 text-white transition hover:shadow-lg"
          >
            <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-neutral-300">
              Trusted
            </span>
            <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              {brand.origin}
            </span>
            <span className="mt-2 block font-serif text-lg tracking-wide md:text-xl">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
