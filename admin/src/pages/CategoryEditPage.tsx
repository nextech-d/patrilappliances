import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    </div>
  );
}
