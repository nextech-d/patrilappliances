import { SITE } from "../config/site";

type DemoModeBannerProps = {
  className?: string;
  variant?: "default" | "track-order" | "checkout-success";
};

export default function DemoModeBanner({
  className = "",
  variant = "default",
}: DemoModeBannerProps) {
  if (!SITE.demoMode) return null;

  const copy =
    variant === "track-order"
      ? "Online payment is not enabled yet — we'll contact you to arrange payment. Order tracking works with your reference below."
      : variant === "checkout-success"
        ? "Your order is saved. Payment is arranged manually — we'll contact you to confirm delivery and payment."
        : "Orders are saved to our database, but online payment is not enabled yet — we'll contact you to arrange payment and delivery.";

  return (
    <div
      role="status"
      className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-950 ${className}`}
    >
      <span className="font-bold">Demo mode.</span> {copy}
    </div>
  );
}
