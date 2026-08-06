import { listProductsForAdmin } from "../../lib/products.server";
import ProductsPanel from "../../components/admin/ProductsPanel";

export default async function AdminProductsPage() {
  const products = await listProductsForAdmin();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-lg font-black uppercase tracking-tight text-neutral-900">Products</h1>
        <p className="mt-1 text-xs text-neutral-500">
          Update prices and stock status — changes appear on the storefront immediately.
        </p>
      </div>
      <ProductsPanel initialProducts={products} />
    </div>
  );
}
