import { site } from "@/content/site";

/** Structured data for search engines, rendered as a JSON-LD script (`<` escaped, per the Next.js guide). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** An absolute URL on the site, for structured data. */
export const absolute = (path: string) => new URL(path, site.url).toString();

/** The studio, described once for the whole site. */
export const studio = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": absolute("/#studio"),
      name: site.legalName,
      alternateName: site.name,
      description: site.description,
      url: absolute("/"),
      logo: absolute("/icon.svg"),
      image: absolute("/og.png"),
      email: site.contact.email,
      ...(site.contact.phone && { telephone: site.contact.phone.replace(/\s/g, "") }),
      address: {
        "@type": "PostalAddress",
        addressLocality: site.location.city,
        addressCountry: "PH",
      },
      areaServed: "Worldwide",
      knowsAbout: ["Website development", "Custom software", "Business automation", "UI/UX design", "Creative services"],
      sameAs: site.social.map((x) => x.url).filter((url): url is string => !!url),
    },
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      name: site.legalName,
      url: absolute("/"),
      publisher: { "@id": absolute("/#studio") },
      inLanguage: "en",
    },
  ],
};
