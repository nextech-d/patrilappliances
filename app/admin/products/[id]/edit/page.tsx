import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "../../../../components/admin/ProductForm";
import {
  getProductForAdmin,
  listBrandOptions,
  listSubcategoryOptions,
} from "../../../../lib/products.server";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId) notFound();

  const [product, brands, subcategories] = await Promise.all([
    getProductForAdmin(productId),
    listBrandOptions(),
    listSubcategoryOptions(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <Link href="/admin/products" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-neutral-900">Edit product</h1>
        <p className="mt-1 text-xs text-neutral-500">{product.name}</p>
      </div>
      <ProductForm brands={brands} subcategories={subcategories} product={product} />
    </div>
  );
}
