import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { ProductGalleryField, ProductImageField } from "./ProductImageField";
import type {
  AdminProductDetail,
  BrandOption,
  StockStatus,
  SubcategoryOption,
} from "../lib/products";

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "in_stock", label: "In stock" },
  { value: "low_stock", label: "Low stock" },
  { value: "out_of_stock", label: "Out of stock" },
];

type ProductFormProps = {
  brands: BrandOption[];
  subcategories: SubcategoryOption[];
  product?: AdminProductDetail;
  mode: "create" | "edit";
  onCreated?: (id: number) => void;
};

const UPLOADED_IMAGE_PREFIXES = ["/uploads/", "http://", "https://"];

function initialMainImage(product?: AdminProductDetail): string {
  const id = product?.primaryPhotoId ?? "";
  if (!id) return "";
  return UPLOADED_IMAGE_PREFIXES.some((prefix) => id.startsWith(prefix)) ? id : "";
}

function initialSecondaryImages(product?: AdminProductDetail): string[] {
  if (!product?.galleryPhotoIds.length) return [];
  return product.galleryPhotoIds.filter((id) =>
    UPLOADED_IMAGE_PREFIXES.some((prefix) => id.startsWith(prefix))
  );
}

export default function ProductForm({
  brands,
  subcategories,
  product,
  mode,
  onCreated,
}: ProductFormProps) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product?.name ?? "");
  const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(product?.metaDescription ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [brandId, setBrandId] = useState(product?.brandId ?? brands[0]?.id ?? 0);
  const [subcategoryId, setSubcategoryId] = useState(
    product?.subcategoryId ?? subcategories[0]?.id ?? 0
  );
  const [priceKes, setPriceKes] = useState(String(product?.priceKes ?? ""));
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    product?.stockStatus ?? "in_stock"
  );
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? false);
  const [specs, setSpecs] = useState(product?.specs ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [mainImage, setMainImage] = useState(initialMainImage(product));
  const [secondaryImages, setSecondaryImages] = useState(initialSecondaryImages(product));

  const inputClass =
    "w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#00e599]/40 focus:outline-none";
  const labelClass =
    "mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (isPublished && !mainImage) {
      setError("Main image is required to publish. Save as draft or upload an image.");
      return;
    }

    setLoading(true);

    const body = {
      id: product?.id,
      name,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      slug: slug || undefined,
      brandId: Number(brandId),
      subcategoryId: Number(subcategoryId),
      priceKes: Number(priceKes),
      stockStatus,
      isPublished,
      specs,
      description,
      primaryPhotoId: mainImage,
      galleryPhotoIds: secondaryImages,
    };

    try {
      if (isEdit) {
        await api("/admin/products", { method: "PATCH", body: JSON.stringify(body) });
        navigate("/products");
      } else {
        const data = await api<{ product: { id: number } }>("/admin/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
        if (onCreated) {
          onCreated(data.product.id);
        } else {
          navigate(`/products?created=${data.product.id}`, { replace: true });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      {error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-5 rounded-xl border border-[#262626] bg-[#111111] p-6 md:p-8">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Meta title</label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO page title (defaults to product name)"
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
            <label className={labelClass}>Description *</label>
            <textarea
              required
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <ProductImageField
            label="Main image"
            required={isPublished}
            value={mainImage}
            onChange={setMainImage}
            hint={
              isPublished
                ? undefined
                : "Optional for drafts — required before publishing."
            }
          />

          <ProductGalleryField
            label="Secondary images"
            value={secondaryImages}
            onChange={setSecondaryImages}
          />
        </div>

        <aside className="space-y-5 rounded-xl border border-[#262626] bg-[#111111] p-6 lg:sticky lg:top-8">
          <div>
            <label className={labelClass}>Slug (optional)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated from name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Brand *</label>
            <select
              required
              value={brandId}
              onChange={(e) => setBrandId(Number(e.target.value))}
              className={inputClass}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Subcategory *</label>
            <select
              required
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(Number(e.target.value))}
              className={inputClass}
            >
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.categoryLabel} — {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Price (KES) *</label>
            <input
              required
              type="number"
              min={0}
              value={priceKes}
              onChange={(e) => setPriceKes(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Stock status</label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as StockStatus)}
              className={inputClass}
            >
              {STOCK_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs text-neutral-400">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-[#333]"
            />
            Published on storefront
          </label>

          <div>
            <label className={labelClass}>Specs</label>
            <input
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="Convection • AI Assist • Matte Black"
              className={inputClass}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00e599] px-8 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#00cc88] disabled:opacity-50"
            >
              {loading ? "Saving…" : isEdit ? "Update product" : "Create product"}
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}
