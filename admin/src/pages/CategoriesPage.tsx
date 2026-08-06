import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { api } from "../lib/api";
import CategoryCreatedView from "../views/CategoryCreatedView";
import SubcategoryCreatedView from "../views/SubcategoryCreatedView";

type Subcategory = { id: number; label: string; slug: string; categoryId: number; sortOrder: number };
type Category = {
  id: number;
  label: string;
  slug: string;
  navLabel: string;
  description: string;
  sortOrder: number;
  subcategories: Subcategory[];
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

function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  function load() {
    api<{ categories: Category[] }>("/admin/catalog/categories").then((d) =>
      setCategories(d.categories)
    );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">Categories and subcategories</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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

      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="rounded-xl border border-[#262626] bg-[#111111] p-5">
            <div className="flex items-baseline gap-3">
              <Link
                to={`/categories/${category.id}/edit`}
                className="font-semibold text-white hover:text-[#00e599] hover:underline"
              >
                {category.label}
              </Link>
              <span className="font-mono text-[10px] text-neutral-500">{category.slug}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{category.description}</p>
            {category.subcategories.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      to={`/subcategories/${sub.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-full border border-[#333] px-3 py-1 text-[10px] text-neutral-400 transition hover:border-[#00e599]/30 hover:text-[#00e599]"
                    >
                      {sub.label}
                      <span className="text-neutral-600">({sub.slug})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
