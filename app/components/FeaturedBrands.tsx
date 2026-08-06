import Link from "next/link";
import { SIGNATURE_BRANDS, PARTNER_BRANDS, brandHref, type Brand } from "../data/brands";
import TShapeGrid from "./TShapeGrid";

function SignatureBrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={brandHref(brand.slug)}
      className="relative block w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-800 to-neutral-700 p-5 text-white"
    >
      <span className="absolute right-3 top-3 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-neutral-300">
        Signature
      </span>
      <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">
        {brand.origin}
      </span>
      <span className="mt-2 block font-serif text-lg tracking-wide md:text-xl">
        {brand.name}
      </span>
    </Link>
  );
}

export default function FeaturedBrands() {
  return (
    <section id="featured-brands" className="mx-auto mt-24 max-w-5xl">
      <div className="mb-10 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">
          Authorized Partners
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-black md:text-3xl">
          Featured Brands
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-black">
          Genuine appliances from the world&apos;s most trusted manufacturers — sourced and serviced locally.
        </p>
      </div>

      <TShapeGrid
        items={SIGNATURE_BRANDS}
        getKey={(brand) => brand.slug}
        itemClassName="w-[min(100%,11rem)] sm:w-44"
        renderItem={(brand) => <SignatureBrandCard brand={brand} />}
      />

      <div className="mt-6 flex flex-wrap justify-center gap-2 rounded-2xl border border-neutral-200/60 bg-[color:var(--surface)] p-5">
        {PARTNER_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={brandHref(brand.slug)}
            className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
