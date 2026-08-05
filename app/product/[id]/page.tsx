"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCategorySlug, getSubcategoryLabel, categoryHref } from "../../data/categories";
import { useCart } from "../../context/CartContext";
import { useInventory } from "../../context/ProductsContext";
import { formatPrice } from "../../lib/formatPrice";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import {
  getProductGallery,
  getProductDetailImage,
  getProductThumbnail,
  PRODUCT_IMAGE_SIZES,
} from "../../lib/productImages";
import ProductCard from "../../components/ProductCard";
import QuantitySelector from "../../components/QuantitySelector";
import TrustBadges from "../../components/TrustBadges";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const inventory = useInventory();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = inventory.find((p) => p.id === Number(id));
  const gallery = product ? getProductGallery(product) : [];
  const [activeImage, setActiveImage] = useState(
    product ? getProductDetailImage(product) : ""
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Product Not Found</h1>
          <Link href="/" className="mt-4 inline-block text-emerald-600 hover:underline font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductThumbnail(product),
      },
      qty,
      { openDrawer: false }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappUrl = buildWhatsAppUrl(`I'm interested in the ${product.name} (Quantity: ${qty})`);

  const relatedProducts = inventory.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans pb-24">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="mb-12 text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center space-x-3">
          <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
          <span className="text-neutral-400">/</span>
          <Link href={`/category/${getCategorySlug(product.category)}`} className="hover:text-neutral-900 transition">
            {product.category}
          </Link>
          <span className="text-neutral-400">/</span>
          <Link
            href={categoryHref(getCategorySlug(product.category), product.subcategory)}
            className="hover:text-neutral-900 transition"
          >
            {getSubcategoryLabel(getCategorySlug(product.category), product.subcategory)}
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 w-full">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50 shadow-inner group">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes={PRODUCT_IMAGE_SIZES.detail}
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full">
              {gallery.slice(0, 5).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 p-1 transition-all duration-200 ${
                    activeImage === img
                      ? "border-neutral-900 bg-neutral-50 shadow-md"
                      : "border-transparent bg-neutral-50 opacity-70 hover:border-neutral-300 hover:opacity-100"
                  }`}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      sizes={PRODUCT_IMAGE_SIZES.thumbnail}
                      className="object-contain p-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-8 w-full">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-3xl font-light tracking-tighter text-neutral-900">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-neutral-600">{product.description}</p>

            <div className="my-8">
              <TrustBadges />
            </div>

            <div className="h-px w-full bg-neutral-300/70"></div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-8 my-10">
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500">Category</span>
                <span className="block mt-1.5 text-sm font-semibold text-neutral-900">{product.category}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500">Brand</span>
                <span className="block mt-1.5 text-sm font-semibold text-neutral-900">{product.brand}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500">Availability</span>
                <span className="block mt-1.5 text-sm font-semibold text-neutral-900">{product.status}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500">Authenticity</span>
                <span className="flex items-center gap-1.5 mt-1.5 text-sm font-semibold text-neutral-900">
                  <CheckCircle2 size={16} className="text-neutral-900" />
                  100% Genuine
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-neutral-300/70"></div>

            <div className="flex flex-col sm:flex-row gap-4 items-center mt-6">
              <QuantitySelector qty={qty} onChange={setQty} variant="pill" />

              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 h-11 rounded-full font-bold uppercase tracking-widest text-[10px] transition active:scale-[0.98] shadow-lg ${
                    added
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "bg-neutral-900 hover:bg-black text-white shadow-neutral-900/10"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {added ? "Added!" : "Add to Cart"}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 flex items-center justify-center bg-transparent border-2 border-[#25D366] text-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white transition active:scale-[0.95] shrink-0"
                  title="WhatsApp inquiry"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-4">Core Specifications</h4>
              <div className="flex flex-wrap gap-2">
                {product.specs.split("•").map((spec, i) => (
                  <span key={i} className="px-4 py-2 border-2 border-neutral-300 rounded-full text-xs font-bold text-neutral-900">
                    {spec.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 max-w-4xl">
          <h2 className="text-3xl font-black text-neutral-900 mb-8 uppercase tracking-tight">
            Why {product.name}
          </h2>
          <ul className="list-none space-y-4 pl-0">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-neutral-900 shrink-0" />
                <span className="font-medium text-neutral-800">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-300/70 w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950">Related Collections</h2>
              <p className="text-sm text-neutral-500 mt-1">
                Complete your space with complementary {product.category.toLowerCase()} appliances.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} appliance={rp} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
