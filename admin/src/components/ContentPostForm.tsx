import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Globe, Settings2 } from "lucide-react";
import { api } from "../lib/api";
import {
  StorefrontField,
  StorefrontSection,
  storefrontInputClass,
} from "./StorefrontPanel";

export type ContentPostType = "blog" | "article";

export type ContentPostDetail = {
  id: number;
  type: ContentPostType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  author: string | null;
  isPublished: boolean;
  publishedAt: string | null;
};

type Props = {
  type: ContentPostType;
  post?: ContentPostDetail;
  mode: "create" | "edit";
  backHref: string;
  onCreated?: (id: number) => void;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const TYPE_LABELS: Record<ContentPostType, string> = {
  blog: "blog post",
  article: "article",
};

export default function ContentPostForm({ type, post, mode, backHref, onCreated }: Props) {
  const navigate = useNavigate();
  const isNew = mode === "create";

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [author, setAuthor] = useState(post?.author ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(post?.ogImageUrl ?? "");
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      type,
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      body: body.trim(),
      author: author.trim() || null,
      metaTitle: metaTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      ogImageUrl: ogImageUrl.trim() || null,
      isPublished,
    };

    try {
      if (isNew) {
        const data = await api<{ post: { id: number } }>("/admin/content/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (onCreated) {
          onCreated(data.post.id);
        } else {
          navigate(backHref, { replace: true });
        }
      } else if (post) {
        await api(`/admin/content/posts/${post.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        navigate(backHref);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <StorefrontSection
        title="Content"
        description={`Main ${TYPE_LABELS[type]} fields. Body supports basic Markdown.`}
        icon={FileText}
        accent="green"
      >
        <StorefrontField label="Title" sentenceCase>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className={storefrontInputClass}
          />
        </StorefrontField>
        <StorefrontField label="Slug" hint="Used in the public URL." sentenceCase>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={storefrontInputClass}
          />
        </StorefrontField>
        <StorefrontField label="Excerpt" hint="Short summary for list pages and SEO fallback." sentenceCase>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className={`${storefrontInputClass} resize-y`}
          />
        </StorefrontField>
        <StorefrontField label="Author" sentenceCase>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Optional"
            className={storefrontInputClass}
          />
        </StorefrontField>
        <StorefrontField label="Body" hint="Markdown: # headings, **bold**, - lists, [links](url)." sentenceCase>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={16}
            className={`${storefrontInputClass} resize-y font-mono text-xs leading-relaxed`}
          />
        </StorefrontField>
        <label className="flex items-center gap-3 rounded-lg border border-[#2a2a2a] bg-[#111111] p-3.5">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="h-4 w-4 rounded border-[#333] bg-[#0a0a0a] text-[#00e599] focus:ring-[#00e599]/30"
          />
          <span className="text-sm text-white">Published on storefront</span>
        </label>
      </StorefrontSection>

      <StorefrontSection
        title="SEO"
        description="Optional overrides for search and social previews."
        icon={Globe}
        accent="sky"
      >
        <StorefrontField label="Meta title" sentenceCase>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className={storefrontInputClass}
          />
        </StorefrontField>
        <StorefrontField label="Meta description" sentenceCase>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            className={`${storefrontInputClass} resize-y`}
          />
        </StorefrontField>
        <StorefrontField label="OG image URL" sentenceCase>
          <input
            type="url"
            value={ogImageUrl}
            onChange={(e) => setOgImageUrl(e.target.value)}
            placeholder="https://…"
            className={storefrontInputClass}
          />
        </StorefrontField>
      </StorefrontSection>

      <div className="flex flex-wrap items-center justify-end gap-2 rounded-xl border border-[#262626] bg-[#111111] px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(backHref)}
          className="rounded-lg border border-[#333] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#00e599] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00cc88] disabled:opacity-50"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {saving ? "Saving…" : isNew ? "Create" : "Save"}
        </button>
      </div>
    </form>
  );
}
