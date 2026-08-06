import type { Metadata } from "next";
import { buildPageMetadata, noIndexMetadata } from "../lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Track Order",
    description: "Look up your Patril Appliances order status.",
  }),
  ...noIndexMetadata,
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
