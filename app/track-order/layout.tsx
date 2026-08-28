import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Track Your Order",
  description:
    "Look up your HomeVibe order status with your order reference (e.g. PTL-123456).",
  path: "/track-order",
});

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
