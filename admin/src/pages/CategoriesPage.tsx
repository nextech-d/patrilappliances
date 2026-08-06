import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, RefreshCw, Plus, ExternalLink, Pencil, Trash2, Layers, ChevronRight } from "lucide-react";
import { api, STORE_URL } from "../lib/api";
import { cardFooter, cardInner, cardInnerEmpty, cardInnerHover, cardOuter } from "../lib/cardSurfaces";
import { SectionHeading, StatCardSkeleton } from "../components/StatCard";
import CategoryCreatedView from "../views/CategoryCreatedView";
import SubcategoryCreatedView from "../views/SubcategoryCreatedView";

type Subcategory = {
  id: number;
  label: string;
  slug: string;
  categoryId: number;
  sortOrder: number;
  productCount: number;
};

type Category = {
  id: number;
  label: string;
  slug: string;
  navLabel: string;
  description: string;
  sortOrder: number;
  subcategoryCount: number;
  productCount: number;
  subcategories: Subcategory[];
};

type Summary = {
  totalCategories: number;
  totalSubcategories: number;
  filteredCategories: number;
};

export default function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const createdId = searchParams.get("created");
  const createdSubId = searchParams.get("createdSub");

  if (createdId) {
    return <CategoryCreatedView entityId={createdId} />;
  }
  if (createdSubId) {
    return <SubcategoryCreatedView entityId={createdSubId} />;
  }

  return <CategoriesListPage />;
}

function CategoryCardSkeleton() {
  return (
    <div className={`flex h-full flex-col animate-pulse rounded-xl p-3 ${cardOuter}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-24 rounded bg-[#333]" />
          <div className="h-2 w-16 rounded bg-[#333]" />
        </div>
        <div className="h-6 w-6 rounded-md bg-[#333]" />
      </div>
      <div className="mt-2 space-y-1">
        <div className="h-2 w-20 rounded bg-[#333]" />
        <div className={`h-14 rounded-md ${cardInner}`} />
      </div>
      <div className={`mt-auto pt-2 ${cardFooter}`}>
        <div className="h-3 w-full rounded bg-[#333]" />
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  onDelete,
  deleting,
}: {
  category: Category;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div className={`flex h-full flex-col rounded-xl p-3 ${cardOuter}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            to={`/categories/${category.id}/edit`}
            className="block truncate text-xs font-semibold text-white hover:text-[#00e599]"
          >
            {category.label}
          </Link>
          <p className="mt-0.5 truncate font-mono text-[9px] text-neutral-600">{category.slug}</p>
        </div>
        <div className="shrink-0 rounded-md bg-[#00e599]/10 p-1.5 text-[#00e599]">
          <Layers className="h-3.5 w-3.5" />
        </div>
      </div>

      <div className="mt-2">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-600">
            Subcategories
          </p>
          <span className="text-[9px] tabular-nums text-neutral-600">{category.subcategoryCount}</span>
        </div>

        {category.subcategories.length > 0 ? (
          <div className={`overflow-hidden rounded-md ${cardInner}`}>
            <ul className="divide-y divide-[#333]">
              {category.subcategories.map((sub) => (
                <li key={sub.id}>
                  <Link
                    to={`/subcategories/${sub.id}/edit`}
                    title={sub.slug}
                    className={`group flex items-center gap-2 px-2 py-1.5 transition ${cardInnerHover}`}
                  >
                    <span className="w-3 shrink-0 text-[9px] font-bold tabular-nums text-neutral-600">
                      {sub.sortOrder}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-[11px] font-medium leading-none text-neutral-300 group-hover:text-[#00e599]">
                      {sub.label}
                    </p>
                    <ChevronRight className="h-3 w-3 shrink-0 text-neutral-700 transition group-hover:text-[#00e599]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={`rounded-md px-2 py-2 text-center ${cardInnerEmpty}`}>
            <Link
              to={`/subcategories/new?categoryId=${category.id}`}
              className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#00e599] hover:underline"
            >
              <Plus className="h-2.5 w-2.5" />
              Add subcategory
            </Link>
          </div>
        )}
      </div>

      <div className={`mt-auto flex items-center justify-between gap-2 pt-2 ${cardFooter}`}>
        <Link
          to={`/subcategories/new?categoryId=${category.id}`}
          className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#00e599]"
        >
          <Plus className="h-2.5 w-2.5" />
          Add
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`${STORE_URL}/category/${category.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-500 hover:text-white"
            title="View on storefront"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
          <Link
            to={`/categories/${category.id}/edit`}
            className="text-neutral-500 hover:text-white"
            title="Edit category"
          >
            <Pencil className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="text-red-400/70 hover:text-red-400 disabled:opacity-50"
            title="Delete category"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoriesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    const q = searchParams.get("q");
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `?${s}` : "";
  }, [searchParams]);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");
      try {
        const data = await api<{ categories: Category[]; summary: Summary }>(
          `/admin/catalog/categories${queryString}`
        );
        setCategories(data.categories);
        setSummary(data.summary);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load categories");
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

  useEffect(() => {
    const trimmed = searchInput.trim();
    const currentQ = searchParams.get("q") ?? "";
    if (trimmed === currentQ) return;

    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const next = new URLSearchParams(searchParams);
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }

  async function handleDeleteCategory(category: Category) {
    if (
      !confirm(
        category.productCount > 0
          ? `"${category.label}" has ${category.productCount} product(s) in its subcategories. Reassign them before deleting.`
          : `Delete "${category.label}" and all its subcategories? This cannot be undone.`
      )
    ) {
      return;
    }
    if (category.productCount > 0) return;

    setDeletingCategoryId(category.id);
    setError("");
    try {
      await api(`/admin/catalog/categories/${category.id}`, { method: "DELETE" });
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot delete category");
    } finally {
      setDeletingCategoryId(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">Catalog structure — categories and subcategories</p>
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
            to="/subcategories/new"
            className="inline-flex items-center gap-2 rounded-lg border border-[#00e599]/30 bg-[#00e599]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:bg-[#00e599]/15"
          >
            <Plus className="h-3.5 w-3.5" />
            Add subcategory
          </Link>
          <Link
            to="/categories/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00e599] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black hover:bg-[#00cc88]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add category
          </Link>
        </div>
      </div>

      <section className="mt-6">
        <SectionHeading title="Overview" description="Categories and subcategories in your catalog" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loading && !summary ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <div className={`rounded-xl p-5 ${cardOuter}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                      Categories
                    </p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-white">
                      {summary?.totalCategories ?? 0}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-lg bg-[#00e599]/10 p-2 text-[#00e599]">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className={`rounded-xl p-5 ${cardOuter}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                      Subcategories
                    </p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-white">
                      {summary?.totalSubcategories ?? 0}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-lg bg-[#00e599]/10 p-2 text-[#00e599]">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <form onSubmit={handleSearch} className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-600" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search categories, subcategories, slugs…"
          className="w-full rounded-lg border border-[#333] bg-[#111] py-2 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-[#00e599]/40 focus:outline-none"
        />
      </form>

      {error && (
        <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <section className="mt-6">
        <SectionHeading
          title="All categories"
          description={
            summary
              ? `${summary.filteredCategories} of ${summary.totalCategories} shown`
              : undefined
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <CategoryCardSkeleton key={i} />)
          ) : categories.length === 0 ? (
            <div className={`col-span-full rounded-xl px-6 py-16 text-center text-sm text-neutral-500 ${cardInner}`}>
              No categories match your search.
            </div>
          ) : (
            categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                deleting={deletingCategoryId === category.id}
                onDelete={() => handleDeleteCategory(category)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
