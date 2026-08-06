"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, ShoppingBag, LogOut } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const linkClass = (href: string) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
      pathname.startsWith(href)
        ? "bg-neutral-900 text-white"
        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
    }`;

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
            Patril Admin
          </span>
          <nav className="flex items-center gap-1">
            <Link href="/admin/orders" className={linkClass("/admin/orders")}>
              <ShoppingBag className="h-3.5 w-3.5" /> Orders
            </Link>
            <Link href="/admin/products" className={linkClass("/admin/products")}>
              <Package className="h-3.5 w-3.5" /> Products
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900"
          >
            View store
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </div>
      </div>
    </header>
  );
}
