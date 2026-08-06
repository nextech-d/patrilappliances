import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Tag, Layers, AlertTriangle } from "lucide-react";
import { api } from "../lib/api";
import {
  accentAt,
  CatalogStatTile,
  StorefrontSection,
} from "./StorefrontPanel";

type CatalogStats = {
  products: number;
  brands: number;
  categories: number;
  subcategories: number;
  lowStock: number;
  outOfStock: number;
  unpublishedProducts: number;
};

type Props = {
  active?: "products" | "brands" | "categories";
};

const TILES = [
  {
    key: "products",
    label: "Products",
    href: "/products",
    icon: Package,
    activeKey: "products" as const,
    stat: (s: CatalogStats) => s.products,
    sub: (s: CatalogStats) => `${s.unpublishedProducts} unpublished`,
  },
  {
    key: "brands",
    label: "Brands",
    href: "/brands",
    icon: Tag,
    activeKey: "brands" as const,
    stat: (s: CatalogStats) => s.brands,
  },
  {
    key: "categories",
    label: "Categories",
    href: "/categories",
    icon: Layers,
    activeKey: "categories" as const,
    stat: (s: CatalogStats) => s.categories,
    sub: (s: CatalogStats) => `${s.subcategories} subcategories`,
  },
  {
    key: "lowStock",
    label: "Low stock",
    href: "/products?stock=low_stock",
    icon: AlertTriangle,
    stat: (s: CatalogStats) => s.lowStock,
    valueClass: (s: CatalogStats) => (s.lowStock ? "text-amber-400" : "text-white"),
  },
  {
    key: "outOfStock",
    label: "Out of stock",
    href: "/products?stock=out_of_stock",
    icon: AlertTriangle,
    stat: (s: CatalogStats) => s.outOfStock,
    valueClass: (s: CatalogStats) => (s.outOfStock ? "text-red-400" : "text-white"),
  },
  {
    key: "unpublished",
    label: "Unpublished",
    href: "/products?published=false",
    icon: Package,
    stat: (s: CatalogStats) => s.unpublishedProducts,
  },
] as const;

export default function CatalogStatCards({ active }: Props) {
  const [stats, setStats] = useState<CatalogStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ dashboard: { stats: CatalogStats } }>("/admin/dashboard")
      .then((res) => setStats(res.dashboard.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StorefrontSection
      title="Catalog"
      description="Products, brands, categories, and stock"
      icon={Package}
      accent="green"
    >
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-[#333] bg-[#161616]"
            />
          ))
        ) : (
          TILES.map((tile, index) => (
            <Link
              key={tile.key}
              to={tile.href}
              className={`block transition ${
                "activeKey" in tile && active === tile.activeKey
                  ? "rounded-xl ring-1 ring-[#00e599]/30"
                  : "hover:opacity-90"
              }`}
            >
              <CatalogStatTile
                label={tile.label}
                value={stats ? tile.stat(stats) : 0}
                sub={stats && "sub" in tile && tile.sub ? tile.sub(stats) : undefined}
                icon={tile.icon}
                accent={accentAt(index)}
                valueClassName={
                  stats && "valueClass" in tile && tile.valueClass
                    ? tile.valueClass(stats)
                    : "text-white"
                }
              />
            </Link>
          ))
        )}
      </div>
    </StorefrontSection>
  );
}
