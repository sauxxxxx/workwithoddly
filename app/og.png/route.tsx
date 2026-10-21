import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { WORDMARK } from "@/components/Wordmark";
import { ogImage } from "@/components/seo/meta";
import { site } from "@/content/site";

/* /og.png, the picture shown when a page is shared or previewed: the opening
   still (the studio's sculptures), the wordmark, and what the studio is.
   Rendered once at build time. A route rather than the opengraph-image file
   convention, so the static export writes a real .png file. */

export const dynamic = "force-static";

export async function GET() {
  const background = await readFile(join(process.cwd(), "app/_og/background.jpg"));
  const src = `data:image/jpeg;base64,${background.toString("base64")}`;
  const host = new URL(site.url).host;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#E7E4F4" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={ogImage.width} height={ogImage.height} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ogImage.width,
            height: ogImage.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <svg width={560} height={112} viewBox={WORDMARK.viewBox}>
            <path d={WORDMARK.O} fill="#0F172A" fillRule="evenodd" />
            <path d={WORDMARK.D} fill="#0F172A" fillRule="evenodd" />
            <path d={WORDMARK.bowl} fill="#0F172A" fillRule="evenodd" />
            <path d={WORDMARK.L} fill="#0F172A" />
            <path d={WORDMARK.Y} fill="#0F172A" />
            <circle cx={WORDMARK.dot.cx} cy={WORDMARK.dot.cy} r={WORDMARK.dot.r} fill="#FF7A59" />
          </svg>
          <div style={{ display: "flex", fontSize: 40, color: "#0F172A", letterSpacing: -0.5 }}>{site.positioning}</div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(15, 23, 42, 0.64)", letterSpacing: 2, textTransform: "uppercase" }}>
            {site.location.city}, {site.location.country} · {host}
          </div>
        </div>
      </div>
    ),
    { width: ogImage.width, height: ogImage.height },
  );
}
