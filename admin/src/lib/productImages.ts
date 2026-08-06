import { STORE_URL } from "./api";

export const PRODUCT_IMAGE_ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,.avif,image/jpeg,image/png,image/webp,image/gif,image/avif";

export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PRODUCT_IMAGE_RECOMMENDED = {
  dimensions: "1500 × 1500 px (square)",
  minDimensions: "800 × 800 px minimum",
  maxFileSize: "5 MB per image",
  formats: "JPEG, PNG, WebP, GIF, or AVIF",
} as const;

export function resolveProductImageUrl(value: string): string {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${STORE_URL}${value}`;
  return `https://images.unsplash.com/${value}?auto=format&fit=crop&w=80&h=80&q=80`;
}

export function productThumbUrl(photoId: string): string {
  const url = resolveProductImageUrl(photoId);
  return url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23222' width='80' height='80' rx='8'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='10' font-family='system-ui'%3ENo image%3C/text%3E%3C/svg%3E";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!allowed.includes(file.type)) {
    return `Unsupported format. Use ${PRODUCT_IMAGE_RECOMMENDED.formats}.`;
  }
  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return `File too large (${formatFileSize(file.size)}). Max ${PRODUCT_IMAGE_RECOMMENDED.maxFileSize}.`;
  }
  if (file.size === 0) return "File is empty.";
  return null;
}
