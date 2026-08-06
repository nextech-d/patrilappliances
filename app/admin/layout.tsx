import AdminNav from "../components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-px min-h-[70vh] bg-neutral-50">
      <AdminNav />
      {children}
    </div>
  );
}
