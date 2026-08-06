import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/users.server";

export default async function AccountAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/account/login");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">My account</p>
          <h1 className="text-lg font-black text-neutral-900">{user.name}</h1>
          <p className="text-xs text-neutral-500">{user.email}</p>
        </div>
        <nav className="flex gap-2">
          <Link href="/account" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:bg-neutral-100">
            Overview
          </Link>
          <Link href="/account/orders" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:bg-neutral-100">
            Orders
          </Link>
          <Link href="/account/addresses" className="rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:bg-neutral-100">
            Addresses
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
