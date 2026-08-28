import { useCallback, useEffect, useState } from "react";
import { Save, RefreshCw, Globe, Image, ShieldCheck, Rocket } from "lucide-react";
import { api } from "../lib/api";
import {
  StorefrontSection,
  StorefrontField,
  storefrontInputClass,
} from "../components/StorefrontPanel";

type SeoSettings = {
  homepageTitle: string;
  homepageDescription: string;
  defaultOgImageUrl: string;
  googleSiteVerification: string;
};

export default function SeoGlobalPage() {
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ settings: SeoSettings }>("/admin/seo/global");
      setSettings(data.settings);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function updateField<K extends keyof SeoSettings>(key: K, value: SeoSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const data = await api<{ settings: SeoSettings }>("/admin/seo/global", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      setSettings(data.settings);
      setSaved(true);
      await buildAndUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save SEO settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Global SEO</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Homepage meta tags, default social image, and Google Search Console verification.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-[#1a1a1a] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
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

      {loading && !settings ? (
        <p className="text-sm text-neutral-500">Loading SEO settings…</p>
      ) : settings ? (
        <form onSubmit={handleSave} className="space-y-6">
          <StorefrontSection
            title="Homepage"
            description="Title and description for the root URL. Leave blank to use site name and tagline defaults."
            icon={Globe}
            accent="green"
          >
            <StorefrontField label="Homepage title" sentenceCase>
              <input
                type="text"
                value={settings.homepageTitle}
                onChange={(e) => updateField("homepageTitle", e.target.value)}
                placeholder="HomeVibe — Home & Gym Appliances"
                className={storefrontInputClass}
              />
            </StorefrontField>
            <StorefrontField
              label="Homepage description"
              hint="Shown in search results and social previews for the homepage."
              sentenceCase
            >
              <textarea
                value={settings.homepageDescription}
                onChange={(e) => updateField("homepageDescription", e.target.value)}
                rows={3}
                placeholder="Kitchen & gym gear you can trust. Shop in Nairobi with free delivery…"
                className={`${storefrontInputClass} resize-y`}
              />
            </StorefrontField>
          </StorefrontSection>

          <StorefrontSection
            title="Social & verification"
            description="Default Open Graph image and Google site verification token."
            icon={Image}
            accent="sky"
          >
            <StorefrontField
              label="Default OG image URL"
              hint="Used when a page has no specific image. Absolute HTTPS URL recommended."
              sentenceCase
            >
              <input
                type="url"
                value={settings.defaultOgImageUrl}
                onChange={(e) => updateField("defaultOgImageUrl", e.target.value)}
                placeholder="https://…"
                className={storefrontInputClass}
              />
            </StorefrontField>
            <StorefrontField
              label="Google site verification"
              hint="Content value from Google Search Console (not the full meta tag)."
              sentenceCase
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-600" />
                <input
                  type="text"
                  value={settings.googleSiteVerification}
                  onChange={(e) => updateField("googleSiteVerification", e.target.value)}
                  placeholder="abc123…"
                  className={storefrontInputClass}
                />
              </div>
            </StorefrontField>
          </StorefrontSection>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#262626] bg-[#111111] px-5 py-4">
            <p className="text-xs text-neutral-500">
              {saved ? (
                <span className="text-[#00e599]">SEO settings saved.</span>
              ) : (
                "Changes apply to homepage meta and verification tags after save."
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={buildAndUpdate}
                disabled={publishing || saving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50"
              >
                <Rocket className={`h-3.5 w-3.5 ${publishing ? "animate-pulse" : ""}`} />
                {publishing ? "Updating…" : "Build & update"}
              </button>
              <button
                type="submit"
                disabled={saving || publishing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#00e599] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00cc88] disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving…" : "Save & publish"}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}
