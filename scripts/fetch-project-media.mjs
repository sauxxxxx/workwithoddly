// Downloads project screenshots from the team's portfolio sites into
// public/work/<slug>/ as WebP (max 2400px wide), and prints each file's size
// for the `ratio` in content/projects.ts.
//
//   node scripts/fetch-project-media.mjs           only what is missing
//   node scripts/fetch-project-media.mjs --force   everything again
//
// Needs ffmpeg on PATH (or FFMPEG=/path/to/ffmpeg). Add new projects to MEDIA.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REMAR = "https://remarugsimar.com";
const ZHYRONNE = "https://zhyronne-batican.vercel.app/images/projects";

/** [slug, file name (without .webp), source URL] */
const MEDIA = [
  // remarugsimar.com
  ["scout", "screen", `${REMAR}/_next/static/media/scout.7c825c52.png`],
  ["scout", "laptop", `${REMAR}/v2/scout-laptop-v1.png`],
  ["joyno-accounting", "screen", `${REMAR}/_next/static/media/joyno-accounting.9e324f23.png`],
  ["joyno-accounting", "monitor", `${REMAR}/v2/joyno-accounting-monitor-v1.png`],
  ["joynosync", "screen", `${REMAR}/_next/static/media/joynosync-dashboard.06d19a8b.webp`],
  ["joynosync", "tablet", `${REMAR}/v2/joynosync-ipad-left-alpha-v5.webp`],
  ["casatoon", "screen", `${REMAR}/_next/static/media/roarly-dashboard.b12ef88a.webp`],
  ["casatoon", "laptop", `${REMAR}/v2/roarly-laptop-real-screen-v6.png`],
  ["the-beach-park-hadsan", "screen", `${REMAR}/_next/static/media/hadsan.5808fbf8.png`],
  ["the-beach-park-hadsan", "tablet", `${REMAR}/v2/hadsan-tablet-v1.png`],
  ["nxone-dc", "screen", `${REMAR}/_next/static/media/nxone-home.e624a22f.webp`],
  ["nxone-dc", "monitor", `${REMAR}/v2/nxone-monitor-left-alpha-v3.webp`],
  ["shukey-philippines", "screen", `${REMAR}/_next/static/media/shukey-home.e7710050.jpg`],
  ["sharks-tail", "screen", `${REMAR}/_next/static/media/sharks-tail-home.91aefa65.webp`],
  ["roarly-website", "screen", `${REMAR}/_next/static/media/roarly-website-home.cdd4566d.webp`],
  ["joyno-inc", "screen", `${REMAR}/_next/static/media/joyno-inc-home.7bb9f3d9.webp`],
  // zhyronne-batican.vercel.app
  ["joyno-hr", "screen", `${ZHYRONNE}/hr.png`],
  ["localaid", "screen", `${ZHYRONNE}/localaid.png`],
  ["streetkings-ph", "screen", `${ZHYRONNE}/street.png`],
  ["bw-furniture", "screen", `${ZHYRONNE}/bw.png`],
  ["bookvoice", "screen", `${ZHYRONNE}/book.png`],
  ["roarly", "screen", `${ZHYRONNE}/roarly.png`],
  ["ccr", "screen", `${ZHYRONNE}/ccr.png`],
  ["lifedesk-crm", "screen", `${ZHYRONNE}/lifedesk-crm.png`],
  ["lifedesk", "screen", `${ZHYRONNE}/lifedesk-home.png`],
  ["lifedesk", "wallet", `${ZHYRONNE}/lifedesk-wallet.png`],
  ["lifedesk", "tasks", `${ZHYRONNE}/lifedesk-tasks.png`],
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const force = process.argv.includes("--force");
const work = mkdtempSync(join(tmpdir(), "oddly-media-"));

const size = (file) => {
  const out = execFileSync(ffmpeg.replace(/ffmpeg(\.exe)?$/, "ffprobe$1"), [
    "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file,
  ]).toString().trim();
  return out.replace(",", "/");
};

let failed = 0;
try {
  for (const [slug, name, url] of MEDIA) {
    const out = join(root, "public", "work", slug, `${name}.webp`);
    const rel = `/work/${slug}/${name}.webp`;
    if (existsSync(out) && !force) {
      console.log(`kept   ${rel}  ${size(out)}`);
      continue;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) throw new Error(`not an image (${type})`);
      const src = join(work, `${slug}-${name}`);
      writeFileSync(src, Buffer.from(await res.arrayBuffer()));
      mkdirSync(dirname(out), { recursive: true });
      // Keeps transparency (the device mockups are cut out).
      execFileSync(ffmpeg, [
        "-v", "error", "-y", "-i", src,
        "-vf", "scale='min(2400,iw)':-2", "-c:v", "libwebp", "-quality", "82", "-pix_fmt", "yuva420p",
        out,
      ]);
      console.log(`saved  ${rel}  ${size(out)}`);
    } catch (error) {
      failed++;
      console.error(`FAILED ${rel}  ${url}  ${error.message}`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
if (failed) process.exitCode = 1;
