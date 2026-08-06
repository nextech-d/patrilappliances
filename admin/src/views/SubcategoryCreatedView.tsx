import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import CreatedConfirmation from "../components/CreatedConfirmation";
import { type SubcategoryDetail } from "../components/SubcategoryForm";

type Props = {
  entityId: string;
};

export default function SubcategoryCreatedView({ entityId }: Props) {
  const [subcategory, setSubcategory] = useState<SubcategoryDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ subcategory: SubcategoryDetail }>(`/admin/catalog/subcategories/${entityId}`)
      .then((data) => setSubcategory(data.subcategory))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load subcategory"));
  }, [entityId]);

  if (error) {
    return <div className="p-8 text-sm text-red-400">{error}</div>;
  }

  if (!subcategory) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }

  return (
    <CreatedConfirmation
      entityType="Subcategory"
      name={subcategory.label}
      listPath="/categories"
      editPath={`/subcategories/${subcategory.id}/edit`}
      createAnotherPath="/subcategories/new"
      rows={[
        { label: "ID", value: `#${subcategory.id}`, mono: true },
        {
          label: "Parent category",
          value: (
            <Link
              to={`/categories/${subcategory.categoryId}/edit`}
              className="text-[#00e599] hover:underline"
            >
              {subcategory.categoryLabel}
            </Link>
          ),
        },
        { label: "Label", value: subcategory.label },
        { label: "Slug", value: subcategory.slug, mono: true },
        { label: "Sort order", value: String(subcategory.sortOrder) },
        { label: "Products", value: String(subcategory.productCount ?? 0) },
      ]}
    />
  );
}
