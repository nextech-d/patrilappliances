import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import BrandForm, { type BrandDetail } from "../components/BrandForm";
import BrandCreatedView from "../views/BrandCreatedView";

export default function BrandEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const [brand, setBrand] = useState<BrandDetail | undefined>();
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;

    async function load() {
      try {
        const data = await api<{ brand: BrandDetail }>(`/admin/catalog/brands/${id}`);
        setBrand(data.brand);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load brand");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew]);

  if (createdId) {
    return <BrandCreatedView entityId={String(createdId)} />;
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
          onClick={() => navigate("/brands")}
          className="mt-4 text-xs text-neutral-500 hover:text-white"
        >
          Back to brands
        </button>
      </div>
    );
  }

  if (!isNew && !brand) {
    return (
      <div className="p-8 text-sm text-neutral-500">
        Brand not found.{" "}
        <Link to="/brands" className="text-[#00e599] hover:underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link
        to="/brands"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Brands
      </Link>

      <h1 className="text-xl font-semibold text-white">{isNew ? "Add brand" : "Edit brand"}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {isNew ? "Create a new product brand" : brand?.name}
      </p>

      <BrandForm brand={brand} mode={isNew ? "create" : "edit"} onCreated={setCreatedId} />
    </div>
  );
}
