"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import SearchPopover from "./SearchPopover";
import NavMenu from "./NavMenu";
import MobileNav from "./MobileNav";

export default function Header() {
  const { items, setCartOpen } = useCart();
  const cartCount = items.reduce((c, i) => c + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-[color:var(--surface)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface)]/70">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex shrink-0 items-center">
          <Link href="/" className="text-xl font-black tracking-tight text-black md:text-2xl">
            Home<span className="font-black">Vibe</span>
          </Link>
        </div>

        <SearchPopover />

        <div className="flex shrink-0 items-center space-x-2 sm:space-x-3">
          <NavMenu />
          <MobileNav />

          <button
            onClick={() => setCartOpen(true)}
            className="group relative flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition hover:bg-black active:scale-95"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[9px] font-black text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
