import { TRUST_BADGES } from "../config/site";
import { ShieldCheck, Truck, Wrench, Smartphone } from "lucide-react";

const ICONS = [Truck, ShieldCheck, Wrench, Smartphone] as const;

type TrustBadgesProps = {
  variant?: "hero" | "inline";
};

export default function TrustBadges({ variant = "inline" }: TrustBadgesProps) {
  if (variant === "hero") {
    return (
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {TRUST_BADGES.map((badge, i) => {
          const Icon = ICONS[i];
          return (
            <div key={badge.label} className="flex items-center gap-2 text-neutral-600">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold">{badge.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TRUST_BADGES.map((badge, i) => {
        const Icon = ICONS[i];
        return (
          <div
            key={badge.label}
            className="flex items-start gap-2.5 rounded-xl border border-neutral-200/70 bg-[color:var(--surface)] p-3"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neutral-700" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-900">
                {badge.label}
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-neutral-500">{badge.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
