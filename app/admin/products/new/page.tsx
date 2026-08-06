import Link from "next/link";
import ProductForm from "../../../components/admin/ProductForm";
import { listBrandOptions, listSubcategoryOptions } from "../../../lib/products.server";

export default async function NewProductPage() {
  const [brands, subcategories] = await Promise.all([
    listBrandOptions(),
    listSubcategoryOptions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <Link href="/admin/products" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-neutral-900">New product</h1>
      </div>
      <ProductForm brands={brands} subcategories={subcategories} />
    </div>
  );
}
