import { getInventory } from "../../lib/inventory.server";
import { buildPageMetadata, absoluteUrl } from "../../lib/seo";
import { getProductDetailImage } from "../../lib/productImages";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
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

export default async function ProductLayout({ children, params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  const products = await getInventory();
  const product = productId ? products.find((p) => p.id === productId) : undefined;

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.metaDescription?.trim() || product.description,
        image: getProductDetailImage(product),
        brand: { "@type": "Brand", name: product.brand },
        sku: String(product.id),
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`/product/${product.id}`),
          priceCurrency: "KES",
          price: product.price,
          availability:
            product.status.toLowerCase().includes("out")
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
