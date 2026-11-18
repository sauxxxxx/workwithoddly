import { ImageResponse } from "next/og";
import { WORDMARK } from "@/components/Wordmark";
import { ogImage } from "@/components/seo/meta";
import { projectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";

/* /projects/<slug>/og.png: the picture shown when a project page is shared —
   its name and headline on the studio's ground, signed with the wordmark.
   Rendered once per project at build time. */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return new Response("Not found", { status: 404 });
  const name = p.name.toUpperCase();
  // Long names step down so they stay on two lines at most.
  const size = name.length > 22 ? 84 : name.length > 14 ? 104 : 128;
  const host = new URL(site.url).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#E7E4F4",
          color: "#0F172A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24, letterSpacing: 3, color: "rgba(15, 23, 42, 0.64)" }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: "#FF7A59" }} />
          {(p.headline ?? p.category).toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: size, lineHeight: 0.95, letterSpacing: -1, fontWeight: 600, maxWidth: 1050 }}>{name}</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <svg width={300} height={60} viewBox={WORDMARK.viewBox}>
            <path d={WORDMARK.O} fill="#0F172A" fillRule="evenodd" />
            <path d={WORDMARK.D} fill="#0F172A" fillRule="evenodd" />
            <path d={WORDMARK.bowl} fill="#0F172A" fillRule="evenodd" />
            <path d={WORDMARK.L} fill="#0F172A" />
            <path d={WORDMARK.Y} fill="#0F172A" />
            <circle cx={WORDMARK.dot.cx} cy={WORDMARK.dot.cy} r={WORDMARK.dot.r} fill="#FF7A59" />
          </svg>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, color: "rgba(15, 23, 42, 0.64)" }}>{host.toUpperCase()}</div>
        </div>
      </div>
    ),
    { width: ogImage.width, height: ogImage.height },
  );
}
