"use client";

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
  type LucideIcon,
} from "lucide-react";

type SymbolTile = {
  id: string;
  Icon: LucideIcon;
  position: string;
  size: "sm" | "md" | "lg";
  rotate: string;
  tile: string;
  icon: string;
};

const sizeMap = {
  sm: { tile: "rounded-xl p-3", icon: "h-7 w-7" },
  md: { tile: "rounded-2xl p-4", icon: "h-9 w-9" },
  lg: { tile: "rounded-2xl p-5", icon: "h-11 w-11" },
};

const desktopSymbols: SymbolTile[] = [
  { id: "fridge", Icon: Refrigerator, position: "right-[4%] top-[4%]", size: "lg", rotate: "rotate-3", tile: "border-sky-200 bg-sky-50", icon: "text-sky-600" },
  { id: "dumbbell", Icon: Dumbbell, position: "right-[38%] top-[6%]", size: "md", rotate: "-rotate-12", tile: "border-lime-200 bg-lime-50", icon: "text-lime-600" },
  { id: "coffee", Icon: Coffee, position: "right-[32%] top-[22%]", size: "md", rotate: "-rotate-6", tile: "border-amber-200 bg-amber-50", icon: "text-amber-600" },
  { id: "bike", Icon: Bike, position: "right-[48%] top-[36%]", size: "md", rotate: "rotate-3", tile: "border-cyan-200 bg-cyan-50", icon: "text-cyan-600" },
  { id: "microwave", Icon: Microwave, position: "right-[2%] top-[40%]", size: "md", rotate: "rotate-2", tile: "border-violet-200 bg-violet-50", icon: "text-violet-600" },
  { id: "pulse", Icon: HeartPulse, position: "right-[42%] bottom-[30%]", size: "sm", rotate: "-rotate-3", tile: "border-red-200 bg-red-50", icon: "text-red-500" },
  { id: "utensils", Icon: UtensilsCrossed, position: "right-[28%] top-[50%]", size: "sm", rotate: "-rotate-3", tile: "border-emerald-200 bg-emerald-50", icon: "text-emerald-600" },
  { id: "trophy", Icon: Trophy, position: "right-[34%] bottom-[8%]", size: "sm", rotate: "rotate-6", tile: "border-yellow-200 bg-yellow-50", icon: "text-yellow-600" },
  { id: "pot", Icon: CookingPot, position: "right-[14%] bottom-[16%]", size: "md", rotate: "rotate-6", tile: "border-orange-200 bg-orange-50", icon: "text-orange-600" },
  { id: "flame", Icon: Flame, position: "right-[50%] bottom-[46%]", size: "sm", rotate: "rotate-0", tile: "border-rose-200 bg-rose-50", icon: "text-rose-500" },
  { id: "wine", Icon: Wine, position: "right-[6%] bottom-[6%]", size: "sm", rotate: "-rotate-2", tile: "border-fuchsia-200 bg-fuchsia-50", icon: "text-fuchsia-600" },
];

const mobileSymbols: SymbolTile[] = desktopSymbols.slice(0, 6).map((symbol, index) => ({
  ...symbol,
  size: "sm" as const,
  position: [
    "left-[4%] top-[8%]",
    "right-[6%] top-[6%]",
    "left-[28%] top-[4%]",
    "right-[32%] top-[2%]",
    "right-[4%] bottom-[12%]",
    "left-[8%] bottom-[10%]",
  ][index] ?? symbol.position,
}));

function SymbolTiles({ symbols, compact }: { symbols: SymbolTile[]; compact?: boolean }) {
  return (
    <>
      {symbols.map(({ id, Icon, position, size, rotate, tile, icon }) => {
        const sizes = sizeMap[compact ? "sm" : size];
        return (
          <div key={id} className={`absolute ${position}`}>
            <div className={`border shadow-sm ${sizes.tile} ${rotate} ${tile}`}>
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
      <div aria-hidden className="pointer-events-none relative mt-4 h-40 w-full lg:hidden">
        <SymbolTiles symbols={mobileSymbols} compact />
      </div>

      <div aria-hidden className="pointer-events-none relative hidden min-h-[300px] flex-1 lg:block">
        <div className="absolute right-[18%] top-[28%] h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="absolute right-[8%] bottom-[20%] h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />
        <SymbolTiles symbols={desktopSymbols} />
      </div>
    </>
  );
}
