import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SiteNav } from "@/components/nav/SiteNav";
import { StageHost } from "@/components/scene/StageHost";
import { site } from "@/content/site";
import "./globals.css";
import "lenis/dist/lenis.css";
import { ScrollRuntime } from "@/components/motion/ScrollRuntime";
import { LogoReveal } from "@/components/intro/LogoReveal";
import { PageTransition } from "@/components/motion/PageTransition";
import { JsonLd, studio } from "@/components/seo/JsonLd";
import { ogImage, ogShared } from "@/components/seo/meta";

/* Decides before first paint whether the entrance reveal plays: first visit of
   the session, home page, motion allowed. A failsafe releases the page if the
   reveal never runs. */
const INTRO = `try{var d=document.documentElement;if(location.pathname==="/"&&!sessionStorage.getItem("oddly-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="play";d.style.overflow="hidden";setTimeout(function(){if(d.dataset.intro!=="done"){d.dataset.intro="done";d.style.overflow="";}},7000);}}catch(e){}`;

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} — ${site.positioning}, ${site.location.city}`,
    template: `%s — ${site.legalName}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    ...ogShared,
    title: `${site.legalName} — ${site.positioning}`,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", images: [ogImage.url] },
  ...(site.googleSiteVerification && { verification: { google: site.googleSiteVerification } }),
};

export const viewport: Viewport = {
  themeColor: "#E7E4F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <LogoReveal />
        <SiteNav />
        <ScrollRuntime />
        <StageHost />
        <main id="main">{children}</main>
        <PageTransition />
        <JsonLd data={studio} />
      </body>
    </html>
  );
}
