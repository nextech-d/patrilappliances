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

function isFullUrl(value: string): boolean {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}

export function buildSquareImageUrl(photoIdOrUrl: string, width: number): string {
  if (isFullUrl(photoIdOrUrl)) {
    return photoIdOrUrl;
  }
  return `${UNSPLASH_BASE}/${photoIdOrUrl}?auto=format&fit=crop&w=${width}&h=${width}&q=80`;
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
