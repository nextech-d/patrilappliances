import { getInventory } from "../../lib/inventory.server";
import { buildPageMetadata } from "../../lib/seo";
import { getProductDetailImage } from "../../lib/productImages";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (!productId) {
    return buildPageMetadata({
      title: "Product Not Found",
      description: "This product could not be found.",
      noIndex: true,
    });
  }

  const products = await getInventory();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return buildPageMetadata({
      title: "Product Not Found",
      description: "This product could not be found.",
      noIndex: true,
    });
  }

  const fallbackDescription =
    product.description.length > 155
      ? `${product.description.slice(0, 152)}…`
      : product.description;

  return buildPageMetadata({
    title: product.metaTitle?.trim() || product.name,
    description:
      product.metaDescription?.trim() ||
      `${product.brand} ${product.name}. ${fallbackDescription}`,
    path: `/product/${product.id}`,
    image: getProductDetailImage(product),
  });
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
