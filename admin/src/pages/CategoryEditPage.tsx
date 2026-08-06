import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import CategoryForm, { type CategoryDetail } from "../components/CategoryForm";
import CategoryCreatedView from "../views/CategoryCreatedView";

export default function CategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [category, setCategory] = useState<CategoryDetail | undefined>();
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [deletingSubId, setDeletingSubId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;

    async function load() {
      try {
        const data = await api<{ category: CategoryDetail }>(`/admin/catalog/categories/${id}`);
        setCategory(data.category);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load category");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew]);

  async function handleDeleteSubcategory(subId: number, label: string, productCount: number) {
    if (
      !confirm(
        productCount > 0
          ? `"${label}" has ${productCount} product(s). Reassign them before deleting.`
          : `Delete subcategory "${label}"? This cannot be undone.`
      )
    ) {
      return;
    }
    if (productCount > 0) return;

    setDeletingSubId(subId);
    setError("");
    try {
      await api(`/admin/catalog/subcategories/${subId}`, { method: "DELETE" });
      const data = await api<{ category: CategoryDetail }>(`/admin/catalog/categories/${id}`);
      setCategory(data.category);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot delete subcategory");
    } finally {
      setDeletingSubId(null);
    }
  }

  if (createdId) {
    return <CategoryCreatedView entityId={String(createdId)} />;
  }

  if (loading) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="mt-4 text-xs text-neutral-500 hover:text-white"
        >
          Back to categories
        </button>
      </div>
    );
  }

  if (!isNew && !category) {
    return (
      <div className="p-8 text-sm text-neutral-500">
        Category not found.{" "}
        <Link to="/categories" className="text-[#00e599] hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        to="/categories"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Categories
      </Link>

      <h1 className="text-xl font-semibold text-white">
        {isNew ? "Add category" : "Edit category"}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        {isNew ? "Create a new product category" : category?.label}
      </p>

      <CategoryForm
        category={category}
        mode={isNew ? "create" : "edit"}
        onCreated={setCreatedId}
      />

      {!isNew && category && (
        <div className="mt-8 rounded-xl border border-[#262626] bg-[#111111] p-6">
          <div>
            <h2 className="text-sm font-semibold text-white">Subcategories</h2>
            <p className="mt-1 text-xs text-neutral-500">
              {category.subcategories?.length ?? 0} under {category.label}. Subcategories can only be
              added when creating a category.
            </p>
          </div>

          {category.subcategories && category.subcategories.length > 0 ? (
            <ul className="mt-4 divide-y divide-[#262626] rounded-lg border border-[#262626] bg-[#0a0a0a]">
              {category.subcategories.map((sub) => (
                <li
                  key={sub.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                >
                  <div>
                    <Link
                      to={`/subcategories/${sub.id}/edit`}
                      className="text-sm font-medium text-white hover:text-[#00e599] hover:underline"
                    >
                      {sub.label}
                    </Link>
                    <span className="ml-2 font-mono text-[10px] text-neutral-600">{sub.slug}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.productCount > 0 ? (
                      <Link
                        to={`/products?subcategoryId=${sub.id}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:underline"
                      >
                        {sub.productCount} product{sub.productCount === 1 ? "" : "s"}
                      </Link>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-neutral-600">
                        0 products
                      </span>
                    )}
                    <Link
                      to={`/subcategories/${sub.id}/edit`}
                      className="text-neutral-500 hover:text-white"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSubcategory(sub.id, sub.label, sub.productCount)
                      }
                      disabled={deletingSubId === sub.id}
                      className="text-red-400/70 hover:text-red-400 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-neutral-500">No subcategories yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
