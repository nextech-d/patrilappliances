import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  ExternalLink,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Rocket,
  Package,
  Tag,
  HelpCircle,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { api } from "../lib/api";
import {
  CatalogStatTile,
  StorefrontSection,
} from "../components/StorefrontPanel";

type SeoOverview = {
  siteUrl: string;
  sitemapUrl: string;
  robotsUrl: string;
  publishedProducts: number;
  productsMissingMeta: number;
  brandsMissingMeta: number;
  categoriesUsingDefaults: number;
  faqCount: number;
  publishedBlogPosts: number;
  publishedArticles: number;
  contentMissingMeta: number;
  hasHomepageTitle: boolean;
  hasHomepageDescription: boolean;
  hasDefaultOgImage: boolean;
  hasGoogleVerification: boolean;
  items: Array<{
    type: "product" | "brand" | "blog" | "article";
    id: number;
    name: string;
    slug?: string;
    missing: ("title" | "description")[];
  }>;
};

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        ok ? "bg-[#00e599]/10 text-[#00e599]" : "bg-amber-500/10 text-amber-400"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  );
}

export default function SeoOverviewPage() {
  const [overview, setOverview] = useState<SeoOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [publishMessage, setPublishMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ overview: SeoOverview }>("/admin/seo/overview");
      setOverview(data.overview);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load SEO overview");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function buildAndUpdate() {
    setPublishing(true);
    setError("");
    setPublishMessage("");
    try {
      const data = await api<{
        publish: { revalidated: boolean; deployed: boolean; message: string };
      }>("/admin/seo/publish", { method: "POST" });
      setPublishMessage(data.publish.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update storefront");
    } finally {
      setPublishing(false);
    }
  }

  const missingTotal =
    (overview?.productsMissingMeta ?? 0) +
    (overview?.brandsMissingMeta ?? 0) +
    (overview?.contentMissingMeta ?? 0);

  function editHref(item: SeoOverview["items"][number]): string {
    if (item.type === "product") return `/products/${item.id}/edit`;
    if (item.type === "brand") return `/brands/${item.id}/edit`;
    if (item.type === "blog") return `/content/blog/${item.id}/edit`;
    return `/content/articles/${item.id}/edit`;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">SEO overview</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Meta coverage, structured data, and live storefront links.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-[#1a1a1a] disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={buildAndUpdate}
            disabled={publishing}
            className="inline-flex items-center gap-2 rounded-lg bg-[#00e599] px-3 py-2 text-xs font-semibold text-black hover:bg-[#00cc88] disabled:opacity-50"
          >
            <Rocket className={`h-3.5 w-3.5 ${publishing ? "animate-pulse" : ""}`} />
            {publishing ? "Updating…" : "Build & update"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {publishMessage && (
        <div className="mb-4 rounded-lg border border-[#00e599]/30 bg-[#00e599]/10 px-4 py-3 text-sm text-[#00e599]">
          {publishMessage}
        </div>
      )}

      {loading && !overview ? (
        <p className="text-sm text-neutral-500">Loading SEO overview…</p>
      ) : overview ? (
        <div className="space-y-6">
          <StorefrontSection
            title="Overview"
            description="Published catalog and global SEO readiness."
            icon={Search}
            accent="green"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CatalogStatTile label="Published products" value={overview.publishedProducts} icon={Package} accent="green" />
              <CatalogStatTile
                label="Missing product meta"
                value={overview.productsMissingMeta}
                sub={overview.productsMissingMeta > 0 ? "Edit in Products" : "All set"}
                icon={Package}
                accent="amber"
                valueClassName={
                  overview.productsMissingMeta > 0 ? "text-amber-400" : "text-white"
                }
              />
              <CatalogStatTile
                label="Blog posts"
                value={overview.publishedBlogPosts}
                icon={Newspaper}
                accent="sky"
              />
              <CatalogStatTile
                label="Articles"
                value={overview.publishedArticles}
                icon={BookOpen}
                accent="violet"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CatalogStatTile
                label="Missing brand meta"
                value={overview.brandsMissingMeta}
                sub={overview.brandsMissingMeta > 0 ? "Edit in Brands" : "All set"}
                icon={Tag}
                accent="amber"
                valueClassName={
                  overview.brandsMissingMeta > 0 ? "text-amber-400" : "text-white"
                }
              />
              <CatalogStatTile
                label="Missing content meta"
                value={overview.contentMissingMeta}
                sub={overview.contentMissingMeta > 0 ? "Edit in Content" : "All set"}
                icon={FileText}
                accent="amber"
                valueClassName={
                  overview.contentMissingMeta > 0 ? "text-amber-400" : "text-white"
                }
              />
              <CatalogStatTile
                label="FAQ items"
                value={overview.faqCount}
                sub="FAQPage JSON-LD on storefront"
                icon={HelpCircle}
                accent="green"
              />
            </div>
          </StorefrontSection>

          <StorefrontSection
            title="Global SEO"
            description="Homepage and site-wide settings from the Global SEO page."
            icon={Globe}
            accent="sky"
            actions={
              <Link
                to="/seo/global"
                className="text-xs font-medium text-sky-400 hover:text-sky-300"
              >
                Edit global SEO →
              </Link>
            }
          >
            <div className="flex flex-wrap gap-2">
              <StatusPill ok={overview.hasHomepageTitle} label="Homepage title" />
              <StatusPill ok={overview.hasHomepageDescription} label="Homepage description" />
              <StatusPill ok={overview.hasDefaultOgImage} label="Default OG image" />
              <StatusPill ok={overview.hasGoogleVerification} label="Google verification" />
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Categories use label and description for meta until dedicated fields are added.
              {overview.categoriesUsingDefaults > 0 &&
                ` ${overview.categoriesUsingDefaults} categories on defaults.`}
            </p>
          </StorefrontSection>

          <StorefrontSection
            title="Live storefront"
            description="Public URLs crawlers and search engines use."
            icon={ExternalLink}
            accent="violet"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Site", href: overview.siteUrl },
                { label: "Sitemap", href: overview.sitemapUrl },
                { label: "Robots", href: overview.robotsUrl },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#111111] px-3.5 py-3 text-sm text-white hover:border-[#333]"
                >
                  <span>{label}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
                </a>
              ))}
            </div>
          </StorefrontSection>

          {missingTotal > 0 && (
            <StorefrontSection
              title="Missing meta"
              description="Products, brands, and published content without custom meta title or description."
              icon={FileText}
              accent="amber"
              badge={`${missingTotal} items`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#2a2a2a] text-[10px] uppercase tracking-widest text-neutral-600">
                      <th className="pb-2 pr-4 font-semibold">Type</th>
                      <th className="pb-2 pr-4 font-semibold">Name</th>
                      <th className="pb-2 pr-4 font-semibold">Missing</th>
                      <th className="pb-2 font-semibold">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {overview.items.map((item) => (
                      <tr key={`${item.type}-${item.id}`} className="text-neutral-300">
                        <td className="py-2.5 pr-4 capitalize text-neutral-500">{item.type}</td>
                        <td className="py-2.5 pr-4 font-medium text-white">{item.name}</td>
                        <td className="py-2.5 pr-4 text-neutral-400">
                          {item.missing.join(", ")}
                        </td>
                        <td className="py-2.5">
                          <Link to={editHref(item)} className="text-[#00e599] hover:underline">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {missingTotal > overview.items.length && (
                  <p className="mt-3 text-[10px] text-neutral-600">
                    Showing first {overview.items.length} of {missingTotal} items with missing meta.
                  </p>
                )}
              </div>
            </StorefrontSection>
          )}
        </div>
      ) : null}
    </div>
  );
}
