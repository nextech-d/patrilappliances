import type { Metadata } from "next";
import { buildPageMetadata, noIndexMetadata } from "../lib/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Search",
    description: "Search kitchen and gym appliances at HomeVibe.",
  }),
  ...noIndexMetadata,
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
