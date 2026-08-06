import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import SubcategoryForm, { type SubcategoryDetail } from "../components/SubcategoryForm";
import SubcategoryCreatedView from "../views/SubcategoryCreatedView";

export default function SubcategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = !id || id === "new";
  const defaultCategoryId = Number(searchParams.get("categoryId")) || undefined;

  const [subcategory, setSubcategory] = useState<SubcategoryDetail | undefined>();
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;

    async function load() {
      try {
        const data = await api<{ subcategory: SubcategoryDetail }>(
          `/admin/catalog/subcategories/${id}`
        );
        setSubcategory(data.subcategory);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load subcategory");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew]);

  if (createdId) {
    return <SubcategoryCreatedView entityId={String(createdId)} />;
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

  if (!isNew && !subcategory) {
    return (
      <div className="p-8 text-sm text-neutral-500">
        Subcategory not found.{" "}
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
        {isNew ? "Add subcategory" : "Edit subcategory"}
      </h1>
      {!isNew && subcategory ? (
        <div className="mt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {subcategory.categoryLabel}
          </p>
          <p className="mt-1 text-sm text-white">{subcategory.label}</p>
        </div>
      ) : (
        <p className="mt-1 text-sm text-neutral-500">Create a new subcategory</p>
      )}

      <SubcategoryForm
        subcategory={subcategory}
        mode={isNew ? "create" : "edit"}
        onCreated={setCreatedId}
        defaultCategoryId={defaultCategoryId}
      />
    </div>
  );
}
