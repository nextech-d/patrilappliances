import type { Metadata } from "next";
import { buildPageMetadata, noIndexMetadata } from "../lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Checkout",
    description: "Complete your Patril Appliances order.",
  }),
  ...noIndexMetadata,
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
