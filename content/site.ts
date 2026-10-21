/**
 * Site-wide facts. Everything marked PLACEHOLDER must be replaced with the
 * studio's real details before launch — nothing here is invented proof.
 */
export const site = {
  name: "ODDLY",
  legalName: "ODDLY®",
  /** The production address: canonical URLs, the sitemap and social previews all build on it. */
  url: "https://workwithoddly.com",
  /**
   * Google Search Console's HTML-tag verification token (the `content` value of
   * the meta tag it gives you). Not needed when the domain is verified by DNS.
   */
  googleSiteVerification: null as string | null,
  positioning: "Creative Technology Studio",
  statement: ["Different by design.", "Built for better."],
  location: { city: "Cebu", country: "Philippines", timeZone: "Asia/Manila" },
  description:
    "ODDLY® is a creative technology studio in Cebu, Philippines, bringing technology, automation, and creative services together to help businesses build digital products, improve operations, and communicate more effectively.",

  contact: {
    email: "info@workwithoddly.com",
    phone: "+63 908 300 5368" as string | null,
  },

  // PLACEHOLDER — add real profile URLs; entries with a null url are not rendered.
  social: [
    { label: "Instagram", url: null as string | null },
    { label: "LinkedIn", url: null as string | null },
    { label: "Facebook", url: null as string | null },
  ],

  nav: [
    { label: "Work", href: "/projects/" },
    { label: "Services", href: "/services/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
};

export type Site = typeof site;

export const hasContactEmail = !site.contact.email.endsWith(".example");
export const contactHref = hasContactEmail ? `mailto:${site.contact.email}` : "/contact/";
