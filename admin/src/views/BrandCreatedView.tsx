import { useEffect, useState } from "react";
import { api, STORE_URL } from "../lib/api";
import CreatedConfirmation from "../components/CreatedConfirmation";
import { type BrandDetail } from "../components/BrandForm";
import { productThumbUrl } from "../lib/products";

type Props = {
  entityId: string;
};

export default function BrandCreatedView({ entityId }: Props) {
  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ brand: BrandDetail }>(`/admin/catalog/brands/${entityId}`)
      .then((data) => setBrand(data.brand))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load brand"));
  }, [entityId]);

  if (error) {
    return <div className="p-8 text-sm text-red-400">{error}</div>;
  }

  if (!brand) {
    return <div className="p-8 text-sm text-neutral-500">Loading…</div>;
  }

  return (
    <CreatedConfirmation
      entityType="Brand"
      name={brand.name}
      listPath="/brands"
      editPath={`/brands/${brand.id}/edit`}
      createAnotherPath="/brands/new"
      preview={
        brand.logoUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={productThumbUrl(brand.logoUrl)}
              alt=""
              className="h-16 w-16 rounded-lg border border-[#333] bg-white object-contain p-1"
            />
            <div>
              <p className="font-medium text-white">{brand.name}</p>
              <p className="text-xs text-neutral-500">{brand.origin}</p>
            </div>
          </div>
        ) : undefined
      }
      rows={[
        { label: "ID", value: `#${brand.id}`, mono: true },
        { label: "Slug", value: brand.slug, mono: true },
        { label: "Origin", value: brand.origin },
        { label: "Tier", value: brand.tier },
        { label: "Sort order", value: String(brand.sortOrder) },
        { label: "Meta title", value: brand.metaTitle },
        { label: "Meta description", value: brand.metaDescription },
        { label: "Logo", value: brand.logoUrl ? "Uploaded" : "None" },
        {
          label: "Storefront",
          value: (
            <a
              href={`${STORE_URL}/brand/${brand.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00e599] hover:underline"
            >
              View brand page
            </a>
          ),
        },
      ]}
    />
  );
}
