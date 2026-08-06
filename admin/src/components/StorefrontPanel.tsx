import { Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cardOuter } from "../lib/cardSurfaces";

export const storefrontInputClass =
  "w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:border-[#00e599]/40 focus:outline-none focus:ring-1 focus:ring-[#00e599]/20";

export const storefrontSelectClass =
  "w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:border-[#00e599]/40 focus:outline-none focus:ring-1 focus:ring-[#00e599]/20";

export const storefrontLabelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500";

export const storefrontLabelSentenceClass =
  "mb-1.5 block text-xs font-medium text-neutral-500";

export type StorefrontAccent = "green" | "sky" | "violet" | "amber";

export const ACCENT_CYCLE: StorefrontAccent[] = ["green", "sky", "violet", "amber"];

export function accentAt(index: number): StorefrontAccent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] ?? "green";
}

const accentStyles: Record<
  StorefrontAccent,
  { bar: string; icon: string; ring: string; badge: string }
> = {
  green: {
    bar: "from-[#00e599]/80 to-[#00e599]/10",
    icon: "bg-[#00e599]/10 text-[#00e599]",
    ring: "ring-[#00e599]/10",
    badge: "bg-[#00e599]/10 text-[#00e599]",
  },
  sky: {
    bar: "from-sky-400/80 to-sky-400/10",
    icon: "bg-sky-500/10 text-sky-400",
    ring: "ring-sky-500/10",
    badge: "bg-sky-500/10 text-sky-400",
  },
  violet: {
    bar: "from-violet-400/80 to-violet-400/10",
    icon: "bg-violet-500/10 text-violet-400",
    ring: "ring-violet-500/10",
    badge: "bg-violet-500/10 text-violet-400",
  },
  amber: {
    bar: "from-amber-400/80 to-amber-400/10",
    icon: "bg-amber-500/10 text-amber-400",
    ring: "ring-amber-500/10",
    badge: "bg-amber-500/10 text-amber-400",
  },
};

export function StorefrontSection({
  title,
  description,
  icon: Icon,
  accent,
  badge,
  actions,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  accent: StorefrontAccent;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const styles = accentStyles[accent];

  return (
    <section className={`relative overflow-hidden rounded-xl p-5 ${cardOuter} ${className}`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${styles.bar}`} />
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${styles.icon} ${styles.ring}`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              {badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{description}</p>
            )}
          </div>
        </div>
        {actions}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function StorefrontField({
  label,
  hint,
  sentenceCase = false,
  children,
}: {
  label: string;
  hint?: string;
  sentenceCase?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3.5">
      <label className={sentenceCase ? storefrontLabelSentenceClass : storefrontLabelClass}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[10px] text-neutral-600">{hint}</p>}
    </div>
  );
}

export function CatalogStatTile({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  valueClassName = "text-white",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent: StorefrontAccent;
  valueClassName?: string;
}) {
  const styles = accentStyles[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl p-5 ${cardOuter}`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${styles.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${valueClassName}`}>{value}</p>
          {sub && <p className="mt-1 text-[10px] text-neutral-600">{sub}</p>}
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${styles.icon} ${styles.ring}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function CatalogEntityCard({
  accent,
  children,
  className = "",
}: {
  accent: StorefrontAccent;
  children: ReactNode;
  className?: string;
}) {
  const styles = accentStyles[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl ${cardOuter} ${className}`}>
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${styles.bar}`} />
      {children}
    </div>
  );
}

export function StorefrontSaveBar({
  preview,
  onSave,
  saving,
  label = "Save",
}: {
  preview?: ReactNode;
  onSave: () => void;
  saving?: boolean;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#262626] bg-[#111111] px-5 py-4">
      {preview ? (
        <p className="text-xs text-neutral-500">{preview}</p>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#00e599] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#00cc88] disabled:opacity-50"
      >
        <Save className="h-3.5 w-3.5" />
        {label}
      </button>
    </div>
  );
}
