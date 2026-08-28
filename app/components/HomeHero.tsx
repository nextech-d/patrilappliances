"use client";

import Link from "next/link";
import {
  ArrowRight,
  Coffee,
  CookingPot,
  Dumbbell,
  Refrigerator,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import HeroKitchenSymbols from "./HeroKitchenSymbols";
import { categoryHref } from "../data/categories";
import { useNavCategories } from "../context/CategoriesContext";
import { useStorefront } from "../context/StorefrontContext";

function HighlightedTagline({ tagline }: { tagline: string }) {
  const match = tagline.match(/^(.*\b)(you)(\b.*)$/i);
  if (!match) return <>{tagline}</>;
  return (
    <>
      {match[1]}
      <span className="font-semibold text-rose-600">{match[2]}</span>
      {match[3]}
    </>
  );
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  gym: Dumbbell,
  cooking: CookingPot,
  refrigeration: Refrigerator,
  cleaning: Sparkles,
  "coffee-tech": Coffee,
};

export default function HomeHero() {
  const { siteSettings } = useStorefront();
  const categories = useNavCategories();

  return (
    <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-white px-6 py-10 md:px-12 md:py-12">
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold tracking-tight text-neutral-950 md:text-6xl">
            {siteSettings.name}
          </h1>
          <p className="mt-4 text-xl font-medium text-neutral-700 md:text-2xl">
            <HighlightedTagline tagline={siteSettings.tagline} />
          </p>
          <Link
            href="#featured-products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Shop featured
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <HeroKitchenSymbols />
      </div>

      <nav className="mt-12" aria-label="Shop by category">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug] ?? Sparkles;
            return (
              <Link
                key={category.slug}
                href={categoryHref(category.slug)}
                className="group flex w-[4.75rem] flex-col items-center gap-2 sm:w-24"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-sky-100 bg-white shadow-sm transition group-hover:border-neutral-300 group-hover:shadow-md sm:h-[4.5rem] sm:w-[4.5rem]">
                  <Icon className="h-7 w-7 text-neutral-800" strokeWidth={1.6} />
                </span>
                <span className="text-center text-[11px] font-semibold text-rose-600 sm:text-xs">
                  {category.navLabel || category.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
