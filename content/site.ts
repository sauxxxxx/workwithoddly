/**
 * Site-wide facts. Everything marked PLACEHOLDER must be replaced with the
 * studio's real details before launch — nothing here is invented proof.
 */
export const site = {
  name: "ODDLY",
  legalName: "ODDLY®",
  positioning: "Creative Technology Studio",
  statement: ["Different by design.", "Built for better."],
  location: { city: "Cebu", country: "Philippines", timeZone: "Asia/Manila" },
  description:
    "ODDLY® is a creative technology studio in Cebu, Philippines, bringing technology, automation, and creative services together to help businesses build digital products, improve operations, and communicate more effectively.",

  contact: {
    // PLACEHOLDER — the .example domain is reserved and will never deliver mail.
    email: "hello@oddly.example",
    // PLACEHOLDER — set to a string like "+63 900 000 0000" to publish a phone number.
    phone: null as string | null,
  },

  // PLACEHOLDER — add real profile URLs; entries with a null url are not rendered.
  social: [
    { label: "Instagram", url: null as string | null },
    { label: "LinkedIn", url: null as string | null },
    { label: "Facebook", url: null as string | null },
  ],

  nav: [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/services/" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
};

export type Site = typeof site;

export const hasContactEmail = !site.contact.email.endsWith(".example");
export const contactHref = hasContactEmail ? `mailto:${site.contact.email}` : "/#contact";
