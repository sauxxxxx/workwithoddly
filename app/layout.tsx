import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SiteNav } from "@/components/nav/SiteNav";
import { StageHost } from "@/components/scene/StageHost";
import { site } from "@/content/site";
import "./globals.css";
import "lenis/dist/lenis.css";
import { ScrollRuntime } from "@/components/motion/ScrollRuntime";

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
  title: {
    default: `${site.legalName} — ${site.positioning}, ${site.location.city}`,
    template: `%s — ${site.legalName}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.legalName} — ${site.positioning}`,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E7E4F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jakarta.variable} ${inter.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteNav />
        <ScrollRuntime />
        <StageHost />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
