import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Database,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Tag,
  Layers,
  ExternalLink,
} from "lucide-react";
import { clearToken } from "../lib/api";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/products", label: "Products", icon: Package },
  { to: "/brands", label: "Brands", icon: Tag },
  { to: "/categories", label: "Categories", icon: Layers },
];

export default function Shell() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <aside className="flex w-56 shrink-0 flex-col border-r border-[#262626] bg-[#111111]">
        <div className="border-b border-[#262626] px-4 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00e599]/10 text-[#00e599]">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-white">Patril Admin</p>
              <p className="text-[10px] text-neutral-500">production</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
            Commerce
          </p>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-[#00e599]/10 text-[#00e599]"
                    : "text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-200"
                }`
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#262626] p-3 space-y-1">
          <a
            href="https://patrilappliances.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:bg-[#1a1a1a] hover:text-neutral-300"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View store
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:bg-[#1a1a1a] hover:text-neutral-300"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
