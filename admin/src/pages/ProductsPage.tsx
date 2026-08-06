import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, RefreshCw, Plus, ExternalLink, Pencil } from "lucide-react";
import { api, formatKes, STORE_URL } from "../lib/api";
import { productThumbUrl, STOCK_LABELS, type StockStatus } from "../lib/products";
import ProductCreatedView from "../views/ProductCreatedView";

type Product = {
  id: number;
  name: string;
  brand: string;
  priceKes: number;
  stockStatus: StockStatus;
  isPublished: boolean;
  primaryPhotoId: string;
};

type Summary = {
  total: number;
  published: number;
  unpublished: number;
  lowStock: number;
  outOfStock: number;
};

const STOCK_OPTS: { value: StockStatus | ""; label: string }[] = [
  { value: "", label: "All stock" },
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

const QUICK_FILTERS = [
  { key: "all", label: "All", stock: "", published: "" },
  { key: "low", label: "Low stock", stock: "low_stock", published: "" },
  { key: "out", label: "Out of stock", stock: "out_of_stock", published: "" },
  { key: "draft", label: "Unpublished", stock: "", published: "false" },
] as const;

function stockBadgeClass(status: StockStatus): string {
  if (status === "in_stock") return "bg-emerald-500/10 text-emerald-400";
  if (status === "low_stock") return "bg-amber-500/10 text-amber-400";
  return "bg-red-500/10 text-red-400";
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const createdId = searchParams.get("created");
  if (createdId) {
    return <ProductCreatedView entityId={createdId} />;
  }
  return <ProductsListPage />;
}

function ProductsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const stockFilter = searchParams.get("stock") ?? "";
  const publishedFilter = searchParams.get("published") ?? "";
  const brandIdFilter = searchParams.get("brandId") ?? "";
  const subcategoryIdFilter = searchParams.get("subcategoryId") ?? "";

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    if (stockFilter) params.set("stock", stockFilter);
    if (publishedFilter) params.set("published", publishedFilter);
    if (brandIdFilter) params.set("brandId", brandIdFilter);
    if (subcategoryIdFilter) params.set("subcategoryId", subcategoryIdFilter);
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [searchParams, stockFilter, publishedFilter, brandIdFilter, subcategoryIdFilter]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");
      try {
        const data = await api<{ products: Product[]; summary: Summary }>(
          `/admin/products${queryString}`
        );
        setProducts(data.products);
        setSummary(data.summary);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load products");
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
    const brandId = searchParams.get("brandId");
    if (q) next.set("q", q);
    if (brandId) next.set("brandId", brandId);
    if (filter.stock) next.set("stock", filter.stock);
    if (filter.published) next.set("published", filter.published);
    setSearchParams(next);
  }

  function activeQuickKey(): string {
    if (publishedFilter === "false" && !stockFilter) return "draft";
    if (stockFilter === "low_stock") return "low";
    if (stockFilter === "out_of_stock") return "out";
    if (!stockFilter && !publishedFilter) return "all";
    return "";
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set("q", searchInput.trim());
    else next.delete("q");
    setSearchParams(next);
  }

  async function quickSave(
    id: number,
    patch: { priceKes?: number; stockStatus?: StockStatus; isPublished?: boolean }
  ) {
    const data = await api<{ product: Product }>("/admin/products", {
      method: "PATCH",
      body: JSON.stringify({ id, ...patch }),
    });
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data.product } : p)));
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Products</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {summary ? (
              <>
                {summary.total} total · {summary.published} published · {summary.lowStock} low
                stock · {summary.outOfStock} out of stock
              </>
            ) : (
              "Catalog management"
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
            to="/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00e599] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-[#00cc88]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add product
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
            placeholder="Search name, slug, brand…"
            className="w-full rounded-lg border border-[#333] bg-[#111] py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-[#00e599]/40 focus:outline-none"
          />
        </form>
        <select
          value={stockFilter}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value) next.set("stock", e.target.value);
            else next.delete("stock");
            setSearchParams(next);
          }}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-xs text-white"
        >
          {STOCK_OPTS.map((o) => (
            <option key={o.value || "all"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={publishedFilter}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value) next.set("published", e.target.value);
            else next.delete("published");
            setSearchParams(next);
          }}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-xs text-white"
        >
          <option value="">All visibility</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
      </div>

      {brandIdFilter && (
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
          <span>Filtered by brand</span>
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("brandId");
              setSearchParams(next);
            }}
            className="rounded-full bg-[#111] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {subcategoryIdFilter && (
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
          <span>Filtered by subcategory</span>
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("subcategoryId");
              setSearchParams(next);
            }}
            className="rounded-full bg-[#111] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-xl border border-[#262626]">
        {loading ? (
          <div className="space-y-0 divide-y divide-[#262626] bg-[#0a0a0a] p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex animate-pulse gap-4 py-4">
                <div className="h-10 w-10 rounded-lg bg-[#222]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-[#222]" />
                  <div className="h-3 w-1/4 rounded bg-[#222]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#0a0a0a] px-6 py-16 text-center text-sm text-neutral-500">
            No products match your filters.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-[10px] uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3 w-12"></th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626] bg-[#0a0a0a]">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} onSave={quickSave} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && summary && (
        <p className="mt-3 text-[10px] uppercase tracking-wider text-neutral-600">
          Showing {products.length} of {summary.total}
        </p>
      )}
    </div>
  );
}

function ProductRow({
  product,
  onSave,
}: {
  product: Product;
  onSave: (
    id: number,
    patch: { priceKes?: number; stockStatus?: StockStatus; isPublished?: boolean }
  ) => Promise<void>;
}) {
  const [price, setPrice] = useState(String(product.priceKes));
  const [stock, setStock] = useState(product.stockStatus);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(product.id, { priceKes: Number(price), stockStatus: stock });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished() {
    setToggling(true);
    try {
      await onSave(product.id, { isPublished: !product.isPublished });
    } finally {
      setToggling(false);
    }
  }

  return (
    <tr className="text-neutral-300">
      <td className="px-4 py-3">
        <img
          src={productThumbUrl(product.primaryPhotoId)}
          alt=""
          className="h-10 w-10 rounded-lg border border-[#333] object-cover"
        />
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/products/${product.id}/edit`}
          className="font-medium text-white hover:text-[#00e599] hover:underline"
        >
          {product.name}
        </Link>
        <div className="font-mono text-[10px] text-neutral-600">#{product.id}</div>
      </td>
      <td className="px-4 py-3">{product.brand}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 rounded border border-[#333] bg-[#111] px-2 py-1 text-white"
          />
          <span className="text-neutral-600">{formatKes(Number(price) || 0)}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <select
          value={stock}
          onChange={(e) => setStock(e.target.value as StockStatus)}
          className="rounded border border-[#333] bg-[#111] px-2 py-1 text-white"
        >
          {(Object.keys(STOCK_LABELS) as StockStatus[]).map((s) => (
            <option key={s} value={s}>
              {STOCK_LABELS[s]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          disabled={toggling}
          onClick={togglePublished}
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            product.isPublished
              ? "bg-[#00e599]/10 text-[#00e599]"
              : "bg-neutral-800 text-neutral-500"
          }`}
        >
          {product.isPublished ? "Live" : "Draft"}
        </button>
        <span
          className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${stockBadgeClass(product.stockStatus)}`}
        >
          {STOCK_LABELS[product.stockStatus]}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-lg bg-[#00e599]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:bg-[#00e599]/20 disabled:opacity-50"
          >
            Save
          </button>
          <Link
            to={`/products/${product.id}/edit`}
            className="rounded-lg border border-[#333] p-1.5 text-neutral-500 hover:text-white"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          {product.isPublished && (
            <a
              href={`${STORE_URL}/product/${product.id}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-[#333] p-1.5 text-neutral-500 hover:text-white"
              title="View on store"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}
