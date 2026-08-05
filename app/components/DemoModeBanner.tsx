import { SITE } from "../config/site";

type DemoModeBannerProps = {
  className?: string;
};

export default function DemoModeBanner({ className = "" }: DemoModeBannerProps) {
  if (!SITE.demoMode) return null;

  return (
    <div
      role="status"
      className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950 ${className}`}
    >
      <span className="font-bold">Staging demo.</span> Checkout is simulated — no real
      payments are taken. Saved orders may not persist on Vercel until the backend is
      connected.
    </div>
  );
}
