import type { Metadata } from "next";
import { buildPageMetadata, noIndexMetadata } from "../lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Shopping Cart",
    description: "Review items in your Patril Appliances cart.",
  }),
  ...noIndexMetadata,
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
