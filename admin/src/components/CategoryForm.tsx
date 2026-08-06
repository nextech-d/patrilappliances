import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export type CategoryDetail = {
  id: number;
  label: string;
  slug: string;
  navLabel: string;
  description: string;
  sortOrder: number;
  subcategoryCount?: number;
};

type Props = {
  category?: CategoryDetail;
  mode: "create" | "edit";
  onCreated?: (id: number) => void;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryForm({ category, mode, onCreated }: Props) {
  const navigate = useNavigate();
  const isNew = mode === "create";

  const [label, setLabel] = useState(category?.label ?? "");
  const [navLabel, setNavLabel] = useState(category?.navLabel ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!category);
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#00e599]/40 focus:outline-none";
  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500";

  function handleLabelChange(value: string) {
    setLabel(value);
    if (!slugTouched) setSlug(slugify(value));
    if (!navLabel || navLabel === label) setNavLabel(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      label: label.trim(),
      navLabel: (navLabel || label).trim(),
      description: (description || label).trim(),
      slug: slug.trim() || slugify(label),
      sortOrder: Number(sortOrder) || 0,
    };

    try {
      if (isNew) {
        const data = await api<{ category: { id: number } }>("/admin/catalog/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (onCreated) {
          onCreated(data.category.id);
        } else {
          navigate(`/categories?created=${data.category.id}`, { replace: true });
        }
      } else if (category) {
        await api(`/admin/catalog/categories/${category.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        navigate("/categories");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-5 rounded-xl border border-[#262626] bg-[#111111] p-6">
        {error && (
          <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div>
          <label className={labelClass}>Label</label>
          <input
            required
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Nav label</label>
          <input
            required
            value={navLabel}
            onChange={(e) => setNavLabel(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#262626] bg-[#111111] p-5">
        <label className={labelClass}>Slug</label>
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          placeholder={slugify(label) || "category-slug"}
          className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 font-mono text-xs text-white focus:border-[#00e599]/40 focus:outline-none"
        />

        <label className={`${labelClass} mt-4`}>Sort order</label>
        <input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#00e599]/40 focus:outline-none"
        />

        {!isNew && category && category.subcategoryCount !== undefined && (
          <p className="mt-4 text-xs text-neutral-500">
            {category.subcategoryCount} subcategor
            {category.subcategoryCount === 1 ? "y" : "ies"}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-5 w-full rounded-lg bg-[#00e599] py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00cc88] disabled:opacity-50"
        >
          {saving ? "Saving…" : isNew ? "Create category" : "Update category"}
        </button>
      </div>
    </form>
  );
}
