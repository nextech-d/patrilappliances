import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, RefreshCw, Plus, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { api, STORE_URL } from "../lib/api";
import type { BrandTier } from "../components/BrandForm";
import BrandCreatedView from "../views/BrandCreatedView";

type Brand = {
  id: number;
  name: string;
  slug: string;
  tier: BrandTier;
  origin: string;
  sortOrder: number;
  productCount: number;
};

type Summary = {
  total: number;
  filtered: number;
  signature: number;
  partner: number;
};

const QUICK_FILTERS = [
  { key: "all", label: "All", tier: "" },
  { key: "signature", label: "Signature", tier: "signature" },
  { key: "partner", label: "Partner", tier: "partner" },
] as const;

function tierBadgeClass(tier: BrandTier): string {
  return tier === "signature"
    ? "bg-[#00e599]/10 text-[#00e599]"
    : "bg-neutral-500/10 text-neutral-400";
}

export default function BrandsPage() {
  const [searchParams] = useSearchParams();
  const createdId = searchParams.get("created");
  if (createdId) {
    return <BrandCreatedView entityId={createdId} />;
  }
  return <BrandsListPage />;
}

function BrandsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const tierFilter = searchParams.get("tier") ?? "";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    if (tierFilter) params.set("tier", tierFilter);
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [searchParams, tierFilter]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");
      try {
        const data = await api<{ brands: Brand[]; summary: Summary }>(
          `/admin/catalog/brands${queryString}`
        );
        setBrands(data.brands);
        setSummary(data.summary);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load brands");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [queryString]
  );

  useEffect(() => {
    load();
  }, [load]);

  function applyQuickFilter(key: string) {
    const filter = QUICK_FILTERS.find((f) => f.key === key);
    if (!filter) return;
    const next = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) next.set("q", q);
    if (filter.tier) next.set("tier", filter.tier);
    setSearchParams(next);
  }

  function activeQuickKey(): string {
    if (tierFilter === "signature") return "signature";
    if (tierFilter === "partner") return "partner";
    if (!tierFilter) return "all";
    return "";
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set("q", searchInput.trim());
    else next.delete("q");
    setSearchParams(next);
  }

  async function handleDelete(brand: Brand) {
    if (
      !confirm(
        brand.productCount > 0
          ? `"${brand.name}" has ${brand.productCount} product(s). Reassign them before deleting.`
          : `Delete "${brand.name}"? This cannot be undone.`
      )
    ) {
      return;
    }
    if (brand.productCount > 0) return;

    setDeletingId(brand.id);
    setError("");
    try {
      await api(`/admin/catalog/brands/${brand.id}`, { method: "DELETE" });
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot delete brand");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Brands</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {summary ? (
              <>
                {summary.total} total · {summary.signature} signature · {summary.partner} partner
              </>
            ) : (
              "Manage product brands"
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-[#333] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            to="/brands/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00e599] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-[#00cc88]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add brand
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => applyQuickFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              activeQuickKey() === f.key
                ? "bg-[#00e599]/15 text-[#00e599]"
                : "bg-[#111] text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="relative min-w-[220px] flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, slug, origin…"
            className="w-full rounded-lg border border-[#333] bg-[#111] py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-[#00e599]/40 focus:outline-none"
          />
        </form>
        <select
          value={tierFilter}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value) next.set("tier", e.target.value);
            else next.delete("tier");
            setSearchParams(next);
          }}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-xs text-white"
        >
          <option value="">All tiers</option>
          <option value="signature">Signature</option>
          <option value="partner">Partner</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-[#262626]">
        {loading ? (
          <div className="space-y-0 divide-y divide-[#262626] bg-[#0a0a0a] p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse gap-4 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 rounded bg-[#222]" />
                  <div className="h-3 w-1/3 rounded bg-[#222]" />
                </div>
              </div>
            ))}
          </div>
        ) : brands.length === 0 ? (
          <div className="bg-[#0a0a0a] px-6 py-16 text-center text-sm text-neutral-500">
            No brands match your filters.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-[10px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626] bg-[#0a0a0a]">
              {brands.map((brand) => (
                <tr key={brand.id} className="text-neutral-300">
                  <td className="px-4 py-3">
                    <Link
                      to={`/brands/${brand.id}/edit`}
                      className="font-medium text-white hover:text-[#00e599] hover:underline"
                    >
                      {brand.name}
                    </Link>
                    <div className="mt-0.5 font-mono text-[10px] text-neutral-600">{brand.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tierBadgeClass(brand.tier)}`}
                    >
                      {brand.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">{brand.origin}</td>
                  <td className="px-4 py-3">
                    {brand.productCount > 0 ? (
                      <Link
                        to={`/products?brandId=${brand.id}`}
                        className="text-[#00e599] hover:underline"
                      >
                        {brand.productCount}
                      </Link>
                    ) : (
                      <span className="text-neutral-600">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{brand.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <a
                        href={`${STORE_URL}/brand/${brand.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-500 hover:text-white"
                        title="View on storefront"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Link
                        to={`/brands/${brand.id}/edit`}
                        className="text-neutral-500 hover:text-white"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(brand)}
                        disabled={deletingId === brand.id}
                        className="text-red-400/70 hover:text-red-400 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && summary && (
        <p className="mt-3 text-[10px] uppercase tracking-wider text-neutral-600">
          Showing {summary.filtered} of {summary.total}
        </p>
      )}
    </div>
  );
}
