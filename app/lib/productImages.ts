/** Standard square product image widths for catalog + PDP. */
export const PRODUCT_IMAGE_WIDTHS = {
  thumbnail: 400,
  card: 600,
  detail: 1500,
} as const;

export type ProductImageSet = {
  thumbnail: string;
  card: string;
  detail: string;
  gallery: string[];
};

const UNSPLASH_BASE = "https://images.unsplash.com";

/** Square crop URL — w and h match for consistent grid alignment. */
export function buildSquareImageUrl(photoId: string, width: number): string {
  return `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${width}&h=${width}&q=80`;
}

export function buildProductImageSet(
  photoId: string,
  galleryPhotoIds?: string[]
): ProductImageSet {
  const galleryIds = galleryPhotoIds?.length ? galleryPhotoIds : [photoId];
  return {
    thumbnail: buildSquareImageUrl(photoId, PRODUCT_IMAGE_WIDTHS.thumbnail),
    card: buildSquareImageUrl(photoId, PRODUCT_IMAGE_WIDTHS.card),
    detail: buildSquareImageUrl(photoId, PRODUCT_IMAGE_WIDTHS.detail),
    gallery: galleryIds.map((id) => buildSquareImageUrl(id, PRODUCT_IMAGE_WIDTHS.detail)),
  };
}

type ImageSource = { imageSet?: ProductImageSet; image: string };

export function getProductThumbnail(source: ImageSource): string {
  return source.imageSet?.thumbnail ?? source.image;
}

export function getProductCardImage(source: ImageSource): string {
  return source.imageSet?.card ?? source.image;
}

export function getProductDetailImage(source: ImageSource): string {
  return source.imageSet?.detail ?? source.image;
}

export function getProductGallery(source: ImageSource & { images?: string[] }): string[] {
  return source.imageSet?.gallery ?? source.images ?? [source.image];
}

export const PRODUCT_IMAGE_SIZES = {
  card: "(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw",
  thumbnail: "80px",
  cart: "72px",
  detail: "(min-width: 1024px) 600px, 100vw",
  search: "40px",
} as const;
