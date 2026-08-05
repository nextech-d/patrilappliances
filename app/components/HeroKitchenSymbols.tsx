import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Coffee,
  CookingPot,
  Dumbbell,
  Flame,
  HeartPulse,
  Microwave,
  Refrigerator,
  Trophy,
  UtensilsCrossed,
  Wine,
} from "lucide-react";

type SymbolTile = {
  Icon: LucideIcon;
  position: string;
  size: "sm" | "md" | "lg";
  rotate: string;
  tile: string;
  icon: string;
  glow: string;
};

const sizeMap = {
  sm: { tile: "rounded-xl p-3", icon: "h-7 w-7" },
  md: { tile: "rounded-2xl p-4", icon: "h-9 w-9" },
  lg: { tile: "rounded-2xl p-5", icon: "h-11 w-11" },
};

const desktopSymbols: SymbolTile[] = [
  { Icon: Refrigerator, position: "right-[4%] top-[4%]", size: "lg", rotate: "rotate-3", tile: "border-sky-400/25 bg-gradient-to-br from-sky-400/20 to-blue-600/10", icon: "text-sky-100", glow: "shadow-[0_0_40px_rgba(56,189,248,0.15)]" },
  { Icon: Dumbbell, position: "right-[38%] top-[6%]", size: "md", rotate: "-rotate-12", tile: "border-lime-400/25 bg-gradient-to-br from-lime-400/20 to-green-600/10", icon: "text-lime-100", glow: "shadow-[0_0_32px_rgba(163,230,53,0.14)]" },
  { Icon: Coffee, position: "right-[32%] top-[22%]", size: "md", rotate: "-rotate-6", tile: "border-amber-400/25 bg-gradient-to-br from-amber-400/20 to-orange-600/10", icon: "text-amber-100", glow: "shadow-[0_0_32px_rgba(251,191,36,0.12)]" },
  { Icon: Bike, position: "right-[48%] top-[36%]", size: "md", rotate: "rotate-3", tile: "border-cyan-400/25 bg-gradient-to-br from-cyan-400/18 to-teal-600/10", icon: "text-cyan-100", glow: "shadow-[0_0_32px_rgba(34,211,238,0.12)]" },
  { Icon: Microwave, position: "right-[2%] top-[40%]", size: "md", rotate: "rotate-2", tile: "border-violet-400/25 bg-gradient-to-br from-violet-400/18 to-purple-600/10", icon: "text-violet-100", glow: "shadow-[0_0_32px_rgba(167,139,250,0.12)]" },
  { Icon: HeartPulse, position: "right-[42%] bottom-[30%]", size: "sm", rotate: "-rotate-3", tile: "border-red-400/25 bg-gradient-to-br from-red-400/20 to-rose-600/10", icon: "text-red-100", glow: "shadow-[0_0_24px_rgba(248,113,113,0.14)]" },
  { Icon: UtensilsCrossed, position: "right-[28%] top-[50%]", size: "sm", rotate: "-rotate-3", tile: "border-emerald-400/25 bg-gradient-to-br from-emerald-400/18 to-teal-600/10", icon: "text-emerald-100", glow: "shadow-[0_0_24px_rgba(52,211,153,0.1)]" },
  { Icon: Trophy, position: "right-[34%] bottom-[8%]", size: "sm", rotate: "rotate-6", tile: "border-yellow-400/25 bg-gradient-to-br from-yellow-400/20 to-amber-600/10", icon: "text-yellow-100", glow: "shadow-[0_0_24px_rgba(250,204,21,0.14)]" },
  { Icon: CookingPot, position: "right-[14%] bottom-[16%]", size: "md", rotate: "rotate-6", tile: "border-orange-400/25 bg-gradient-to-br from-orange-400/20 to-red-600/10", icon: "text-orange-100", glow: "shadow-[0_0_32px_rgba(251,146,60,0.14)]" },
  { Icon: Flame, position: "right-[50%] bottom-[46%]", size: "sm", rotate: "rotate-0", tile: "border-rose-400/30 bg-gradient-to-br from-rose-400/25 to-orange-500/15", icon: "text-rose-100", glow: "shadow-[0_0_28px_rgba(251,113,133,0.18)]" },
  { Icon: Wine, position: "right-[6%] bottom-[6%]", size: "sm", rotate: "-rotate-2", tile: "border-fuchsia-400/25 bg-gradient-to-br from-fuchsia-400/18 to-pink-600/10", icon: "text-fuchsia-100", glow: "shadow-[0_0_24px_rgba(232,121,249,0.12)]" },
];

const mobileSymbols: SymbolTile[] = [
  { Icon: Refrigerator, position: "left-[4%] top-[8%]", size: "sm", rotate: "rotate-3", tile: "border-sky-400/25 bg-gradient-to-br from-sky-400/20 to-blue-600/10", icon: "text-sky-100", glow: "shadow-[0_0_32px_rgba(56,189,248,0.12)]" },
  { Icon: Dumbbell, position: "right-[6%] top-[6%]", size: "sm", rotate: "-rotate-12", tile: "border-lime-400/25 bg-gradient-to-br from-lime-400/20 to-green-600/10", icon: "text-lime-100", glow: "shadow-[0_0_28px_rgba(163,230,53,0.12)]" },
  { Icon: Coffee, position: "left-[28%] top-[4%]", size: "sm", rotate: "-rotate-6", tile: "border-amber-400/25 bg-gradient-to-br from-amber-400/20 to-orange-600/10", icon: "text-amber-100", glow: "shadow-[0_0_28px_rgba(251,191,36,0.1)]" },
  { Icon: Bike, position: "right-[32%] top-[2%]", size: "sm", rotate: "rotate-3", tile: "border-cyan-400/25 bg-gradient-to-br from-cyan-400/18 to-teal-600/10", icon: "text-cyan-100", glow: "shadow-[0_0_28px_rgba(34,211,238,0.1)]" },
  { Icon: Microwave, position: "right-[4%] bottom-[12%]", size: "sm", rotate: "rotate-2", tile: "border-violet-400/25 bg-gradient-to-br from-violet-400/18 to-purple-600/10", icon: "text-violet-100", glow: "shadow-[0_0_28px_rgba(167,139,250,0.1)]" },
  { Icon: Trophy, position: "left-[8%] bottom-[10%]", size: "sm", rotate: "rotate-6", tile: "border-yellow-400/25 bg-gradient-to-br from-yellow-400/20 to-amber-600/10", icon: "text-yellow-100", glow: "shadow-[0_0_24px_rgba(250,204,21,0.12)]" },
];

function SymbolTiles({ symbols, compact }: { symbols: SymbolTile[]; compact?: boolean }) {
  return (
    <>
      {symbols.map(({ Icon, position, size, rotate, tile, icon, glow }) => {
        const sizes = sizeMap[compact ? "sm" : size];
        return (
          <div key={Icon.name} className={`absolute ${position}`}>
            <div className={`border backdrop-blur-md ${sizes.tile} ${rotate} ${tile} ${glow} shadow-lg shadow-black/20`}>
              <Icon className={`${sizes.icon} ${icon}`} strokeWidth={1.75} />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function HeroKitchenSymbols() {
  return (
    <>
      <div aria-hidden className="pointer-events-none relative mt-6 h-44 w-full lg:hidden">
        <div className="absolute inset-0 rounded-2xl bg-white/[0.02]" />
        <SymbolTiles symbols={mobileSymbols} compact />
      </div>

      <div aria-hidden className="pointer-events-none relative hidden min-h-[340px] flex-1 lg:block">
        <div className="absolute right-[18%] top-[28%] h-56 w-56 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute right-[8%] bottom-[20%] h-40 w-40 rounded-full bg-amber-500/[0.06] blur-3xl" />
        <div className="absolute right-[36%] top-[40%] h-36 w-36 rounded-full bg-lime-500/[0.05] blur-3xl" />
        <div className="absolute right-[22%] top-[32%] h-44 w-44 rounded-full border border-dashed border-white/[0.07]" />
        <div className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full border border-white/[0.04]" />
        <SymbolTiles symbols={desktopSymbols} />
      </div>
    </>
  );
}
