import { useEffect, useState } from "react";
import { api } from "../lib/api";
import CreatedConfirmation from "../components/CreatedConfirmation";
import { type CategoryDetail } from "../components/CategoryForm";

type Props = {
  entityId: string;
};

export default function CategoryCreatedView({ entityId }: Props) {
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ category: CategoryDetail }>(`/admin/catalog/categories/${entityId}`)
      .then((data) => setCategory(data.category))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load category"));
  }, [entityId]);

  if (error) {
    return <div className="p-8 text-sm text-red-400">{error}</div>;
  }

  if (!category) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }

  return (
    <CreatedConfirmation
      entityType="Category"
      name={category.label}
      listPath="/categories"
      editPath={`/categories/${category.id}/edit`}
      createAnotherPath="/categories/new"
      rows={[
        { label: "ID", value: `#${category.id}`, mono: true },
        { label: "Slug", value: category.slug, mono: true },
        { label: "Nav label", value: category.navLabel },
        { label: "Description", value: category.description },
        { label: "Sort order", value: String(category.sortOrder) },
        { label: "Subcategories", value: String(category.subcategoryCount ?? 0) },
      ]}
    />
  );
}
