import type { Metadata } from "next";
import AdminNav from "../components/AdminNav";
import { noIndexMetadata } from "../lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = noIndexMetadata;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-px min-h-[70vh] bg-neutral-50">
      <AdminNav />
      {children}
    </div>
  );
}
