import { useEffect, useState } from "react";
import { Package, Tag, Layers, AlertTriangle } from "lucide-react";
import { api } from "../lib/api";
import { SectionHeading, StatCard, StatCardSkeleton } from "./StatCard";

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
    <section>
      <SectionHeading title="Catalog" description="Products, brands, categories, and stock" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Products"
              value={stats?.products ?? 0}
              sub={`${stats?.unpublishedProducts ?? 0} unpublished`}
              icon={Package}
              href="/products"
              active={active === "products"}
            />
            <StatCard
              label="Brands"
              value={stats?.brands ?? 0}
              icon={Tag}
              href="/brands"
              active={active === "brands"}
            />
            <StatCard
              label="Categories"
              value={stats?.categories ?? 0}
              sub={`${stats?.subcategories ?? 0} subcategories`}
              icon={Layers}
              href="/categories"
              active={active === "categories"}
            />
            <StatCard
              label="Low stock"
              value={stats?.lowStock ?? 0}
              icon={AlertTriangle}
              href="/products?stock=low_stock"
              accent={stats?.lowStock ? "amber" : undefined}
            />
            <StatCard
              label="Out of stock"
              value={stats?.outOfStock ?? 0}
              icon={AlertTriangle}
              href="/products?stock=out_of_stock"
              accent={stats?.outOfStock ? "red" : undefined}
            />
            <StatCard
              label="Unpublished"
              value={stats?.unpublishedProducts ?? 0}
              icon={Package}
              href="/products?published=false"
            />
          </>
        )}
      </div>
    </section>
  );
}
