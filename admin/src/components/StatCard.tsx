import { Link } from "react-router-dom";
import { cardOuter } from "../lib/cardSurfaces";

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-neutral-600">{description}</p>}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className={`animate-pulse rounded-xl p-5 ${cardOuter}`}>
      <div className="h-3 w-20 rounded bg-[#333]" />
      <div className="mt-3 h-8 w-16 rounded bg-[#333]" />
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  accent?: "green" | "amber" | "red";
  active?: boolean;
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent,
  active,
}: StatCardProps) {
  const accentClass =
    accent === "amber"
      ? "text-amber-400"
      : accent === "red"
        ? "text-red-400"
        : accent === "green"
          ? "text-[#00e599]"
          : "text-white";

  return (
    <Link
      to={href}
      className={`rounded-xl p-5 ${cardOuter} ${
        active ? "border-[#00e599]/40 ring-1 ring-[#00e599]/20" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
            {label}
          </p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${accentClass}`}>{value}</p>
          {sub && <p className="mt-1 text-[10px] text-neutral-600">{sub}</p>}
        </div>
        <div className="shrink-0 rounded-lg bg-[#00e599]/10 p-2 text-[#00e599]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
