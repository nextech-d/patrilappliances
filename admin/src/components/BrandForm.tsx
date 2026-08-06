import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import BrandLogoField from "./BrandLogoField";

export type BrandTier = "signature" | "partner";

export type BrandDetail = {
  id: number;
  name: string;
  slug: string;
  tier: BrandTier;
  origin: string;
  logoUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  productCount?: number;
};

type Props = {
  brand?: BrandDetail;
  mode: "create" | "edit";
  onCreated?: (id: number) => void;
};

const UPLOADED_IMAGE_PREFIXES = ["/uploads/", "http://", "https://"];

function initialLogo(brand?: BrandDetail): string {
  const url = brand?.logoUrl ?? "";
  if (!url) return "";
  return UPLOADED_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix)) ? url : "";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BrandForm({ brand, mode, onCreated }: Props) {
  const navigate = useNavigate();
  const isNew = mode === "create";

  const [name, setName] = useState(brand?.name ?? "");
  const [metaTitle, setMetaTitle] = useState(brand?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(brand?.metaDescription ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!brand);
  const [origin, setOrigin] = useState(brand?.origin ?? "");
  const [logoUrl, setLogoUrl] = useState(initialLogo(brand));
  const [sortOrder, setSortOrder] = useState(String(brand?.sortOrder ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#00e599]/40 focus:outline-none";
  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500";

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      origin: origin.trim(),
      logoUrl: logoUrl || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      sortOrder: Number(sortOrder) || 0,
    };

    try {
      if (isNew) {
        const data = await api<{ brand: { id: number } }>("/admin/catalog/brands", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (onCreated) {
          onCreated(data.brand.id);
        } else {
          navigate(`/brands?created=${data.brand.id}`, { replace: true });
        }
      } else if (brand) {
        await api(`/admin/catalog/brands/${brand.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        navigate("/brands");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save brand");
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
          <label className={labelClass}>Brand name</label>
          <input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Meta title</label>
          <input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="SEO page title (defaults to brand name)"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Meta description</label>
          <textarea
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Short summary for search results (~155 characters)"
            className={inputClass}
          />
          <p className="mt-1 text-[10px] text-neutral-600">{metaDescription.length} characters</p>
        </div>

        <div>
          <label className={labelClass}>Origin</label>
          <input
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g. USA, Germany, Kenya"
            className={inputClass}
          />
        </div>

        <BrandLogoField value={logoUrl} onChange={setLogoUrl} />
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-[#262626] bg-[#111111] p-5">
          <label className={labelClass}>Slug</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder={slugify(name) || "brand-slug"}
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
          <p className="mt-1.5 text-xs text-neutral-600">Lower numbers appear first in listings.</p>

          {!isNew && brand && brand.productCount !== undefined && (
            <p className="mt-4 text-xs text-neutral-500">
              {brand.productCount} product{brand.productCount === 1 ? "" : "s"} linked
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-5 w-full rounded-lg bg-[#00e599] py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00cc88] disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Create brand" : "Update brand"}
          </button>
        </div>
      </div>
    </form>
  );
}
