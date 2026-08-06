import { SITE } from "../config/site";
import { absoluteUrl, getSiteUrl } from "../lib/seo";

export default function SiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${getSiteUrl()}/#organization`,
        name: SITE.name,
        url: getSiteUrl(),
        email: SITE.email,
        telephone: SITE.phone,
        areaServed: SITE.region,
      },
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl()}/#website`,
        url: getSiteUrl(),
        name: SITE.name,
        description: SITE.tagline,
        publisher: { "@id": `${getSiteUrl()}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/search")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
