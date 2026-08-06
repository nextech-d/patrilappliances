import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Trash2,
  Save,
  HelpCircle,
  MessageSquareQuote,
} from "lucide-react";
import { api } from "../lib/api";
import { cardOuter } from "../lib/cardSurfaces";
import {
  StorefrontField,
  StorefrontSection,
  storefrontInputClass,
} from "../components/StorefrontPanel";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
};

const ACCENTS = ["sky", "violet", "green", "amber"] as const;

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api<{ items: FaqItem[] }>("/admin/storefront/faq");
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load FAQ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function updateLocal(id: number, patch: Partial<FaqItem>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function saveItem(item: FaqItem) {
    setSavingId(item.id);
    setError("");
    try {
      const data = await api<{ item: FaqItem }>(`/admin/storefront/faq/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          question: item.question,
          answer: item.answer,
          sortOrder: item.sortOrder,
        }),
      });
      setItems((prev) => prev.map((row) => (row.id === item.id ? data.item : row)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save FAQ item");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id: number) {
    if (!confirm("Delete this FAQ item?")) return;
    setDeletingId(id);
    setError("");
    try {
      await api(`/admin/storefront/faq/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete FAQ item");
    } finally {
      setDeletingId(null);
    }
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setCreating(true);
    setError("");
    try {
      const data = await api<{ item: FaqItem }>("/admin/storefront/faq", {
        method: "POST",
        body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
      });
      setItems((prev) => [...prev, data.item]);
      setNewQuestion("");
      setNewAnswer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create FAQ item");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">FAQ</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Questions and answers on the homepage — accordion below Featured Brands.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:bg-[#1a1a1a] hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={createItem} className="mb-6">
        <StorefrontSection
          title="Add question"
          description="New entries appear at the bottom of the homepage FAQ section."
          icon={Plus}
          accent="sky"
        >
          <StorefrontField label="Question">
            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className={storefrontInputClass}
              placeholder="Do you offer installation?"
            />
          </StorefrontField>
          <StorefrontField label="Answer">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              rows={3}
              className={storefrontInputClass}
              placeholder="Yes — we deliver and install across Nairobi…"
            />
          </StorefrontField>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#00e599] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00cc88] disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add FAQ
          </button>
        </StorefrontSection>
      </form>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`h-48 animate-pulse rounded-xl ${cardOuter}`} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <StorefrontSection
          title="No questions yet"
          description="Add your first FAQ above — common topics include delivery, warranty, and returns."
          icon={HelpCircle}
          accent="violet"
        >
          <p className="text-xs text-neutral-600">Your homepage will fall back to default copy until items exist.</p>
        </StorefrontSection>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            {items.length} question{items.length === 1 ? "" : "s"} on the storefront
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item, index) => (
              <StorefrontSection
                key={item.id}
                title={item.question.slice(0, 48) + (item.question.length > 48 ? "…" : "")}
                description={`FAQ item #${item.sortOrder + 1}`}
                icon={HelpCircle}
                accent={ACCENTS[index % ACCENTS.length]}
                badge={`#${item.sortOrder + 1}`}
                actions={
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => saveItem(item)}
                      disabled={savingId === item.id}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#00e599]/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00e599] hover:bg-[#00e599]/20 disabled:opacity-50"
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-950/30 hover:text-red-400 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                }
              >
                <StorefrontField label="Question">
                  <input
                    value={item.question}
                    onChange={(e) => updateLocal(item.id, { question: e.target.value })}
                    className={storefrontInputClass}
                  />
                </StorefrontField>
                <StorefrontField label="Answer">
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateLocal(item.id, { answer: e.target.value })}
                    rows={4}
                    className={storefrontInputClass}
                  />
                </StorefrontField>
              </StorefrontSection>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
