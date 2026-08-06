import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadProductImage } from "../lib/api";
import {
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_RECOMMENDED,
  productThumbUrl,
  validateImageFile,
} from "../lib/productImages";

function ImageGuidelines() {
  return (
    <p className="mt-1.5 text-[10px] leading-relaxed text-neutral-600">
      {PRODUCT_IMAGE_RECOMMENDED.formats} · {PRODUCT_IMAGE_RECOMMENDED.maxFileSize} · Recommended{" "}
      {PRODUCT_IMAGE_RECOMMENDED.dimensions} ({PRODUCT_IMAGE_RECOMMENDED.minDimensions})
    </p>
  );
}

type ProductImageFieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
};

export function ProductImageField({
  label,
  required,
  hint,
  value,
  onChange,
}: ProductImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    const validationError = validateImageFile(file);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    setFieldError("");
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      onChange(url);
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
        {label}
        {required ? " *" : ""}
      </label>

      <div
        className={`relative rounded-lg border border-dashed border-[#333] bg-[#0a0a0a] p-4 transition-colors ${
          uploading ? "opacity-60" : "hover:border-[#00e599]/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={PRODUCT_IMAGE_ACCEPT}
          disabled={uploading}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="pointer-events-none flex items-center gap-3 text-neutral-500">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#00e599]" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <div className="text-xs">
            <span className="text-neutral-300">
              {uploading ? "Uploading…" : "Click or drop an image"}
            </span>
            <ImageGuidelines />
          </div>
        </div>
      </div>

      {fieldError && <p className="mt-2 text-xs text-red-400">{fieldError}</p>}

      {required && !value && (
        <p className="mt-2 text-[10px] text-neutral-600">Upload required before publishing.</p>
      )}
      {!required && hint && !value && (
        <p className="mt-2 text-[10px] text-neutral-600">{hint}</p>
      )}

      {value && (
        <div className="relative mt-3 inline-block">
          <img
            src={productThumbUrl(value)}
            alt=""
            className="h-20 w-20 rounded-lg border border-[#333] object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full border border-[#333] bg-[#111] p-1 text-neutral-400 hover:text-white"
            title="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

type ProductGalleryFieldProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
};

export function ProductGalleryField({ label, value, onChange }: ProductGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [fieldError, setFieldError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const fileList = Array.from(files);
    for (const file of fileList) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setFieldError(validationError);
        return;
      }
    }

    setFieldError("");
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of fileList) {
        urls.push(await uploadProductImage(file));
      }
      onChange([...value, ...urls]);
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
        {label}
      </label>

      <div
        className={`relative rounded-lg border border-dashed border-[#333] bg-[#0a0a0a] p-4 transition-colors ${
          uploading ? "opacity-60" : "hover:border-[#00e599]/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={PRODUCT_IMAGE_ACCEPT}
          multiple
          disabled={uploading}
          className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="pointer-events-none flex items-center gap-3 text-neutral-500">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#00e599]" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <div className="text-xs">
            <span className="text-neutral-300">
              {uploading ? "Uploading…" : "Click or drop multiple images"}
            </span>
            <ImageGuidelines />
          </div>
        </div>
      </div>

      {fieldError && <p className="mt-2 text-xs text-red-400">{fieldError}</p>}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="relative">
              <img
                src={productThumbUrl(url)}
                alt=""
                className="h-16 w-16 rounded-lg border border-[#333] object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute -right-1.5 -top-1.5 rounded-full border border-[#333] bg-[#111] p-0.5 text-neutral-400 hover:text-white"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
