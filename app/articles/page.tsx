import type { Metadata } from "next";
import ContentPostList from "../components/ContentPostList";
import { buildPageMetadata } from "../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Guides & Articles",
  description:
    "Buying guides and how-to articles for kitchen appliances and gym equipment from Patril Appliances.",
  path: "/articles",
});

export default function ArticlesIndexPage() {
  return (
    <ContentPostList
      type="article"
      title="Guides & Articles"
      description="Evergreen guides to help you choose, install, and get the most from your appliances and gym gear."
    />
  );
}
