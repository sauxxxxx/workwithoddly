// Prepares one video for a project page, in public/work/<slug>/:
//
//   <name>.mp4          the whole edit, at most 1280px on its long side, with
//                       sound, streaming from the first byte (gallery, reel)
//   <name>-preview.mp4  a short muted loop, at most 720px (project cards)
//   <name>.webp         a still for posters and reduced motion
//
//   node scripts/encode-project-video.mjs <input> <slug> <name> [--start 2] [--still 3] [--length 8]
//
//   --start   where the card loop begins, in seconds (skip a black or logo intro)
//   --still   where the poster frame is taken, in seconds
//   --length  how long the card loop runs
//
// Prints the size to use as the media `ratio` in content/projects/. Needs
// ffmpeg and ffprobe on PATH (or FFMPEG=/path/to/ffmpeg).

import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const [input, slug, name, ...rest] = process.argv.slice(2);
if (!input || !slug || !name) {
  console.error("usage: node scripts/encode-project-video.mjs <input> <slug> <name> [--start s] [--still s] [--length s]");
  process.exit(1);
}
const option = (flag, fallback) => {
  const i = rest.indexOf(flag);
  return i >= 0 ? Number(rest[i + 1]) : fallback;
};
const start = option("--start", 0);
const still = option("--still", start + 1);
const length = option("--length", 8);

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const ffprobe = ffmpeg.replace(/ffmpeg(\.exe)?$/, "ffprobe$1");
const out = join(root, "public", "work", slug);
mkdirSync(out, { recursive: true });

const run = (args) => execFileSync(ffmpeg, ["-v", "error", "-y", ...args], { stdio: "inherit" });
const probe = (file) =>
  execFileSync(ffprobe, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file])
    .toString()
    .trim()
    .split(",")
    .map(Number);
const hasAudio = execFileSync(ffprobe, ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", input])
  .toString()
  .trim().length > 0;

/** Fit the long side within `max`, never upscaling; even sizes for H.264. */
const fit = (max) => `scale='if(gt(iw,ih),min(${max},iw),-2)':'if(gt(iw,ih),-2,min(${max},ih))'`;

// The whole edit: H.264 + AAC, capped bitrate, moov atom first so it starts at once.
run([
  "-i", input,
  "-vf", fit(1280), "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-maxrate", "1800k", "-bufsize", "3600k",
  "-pix_fmt", "yuv420p", "-profile:v", "high",
  ...(hasAudio ? ["-c:a", "aac", "-b:a", "96k", "-ac", "2"] : ["-an"]),
  "-movflags", "+faststart", join(out, `${name}.mp4`),
]);

// The card loop: short, silent, small.
run([
  "-ss", String(start), "-t", String(length), "-i", input,
  "-vf", fit(720), "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p", "-an",
  "-movflags", "+faststart", join(out, `${name}-preview.mp4`),
]);

// The still.
run(["-ss", String(still), "-i", input, "-frames:v", "1", "-vf", fit(1280), "-c:v", "libwebp", "-quality", "80", join(out, `${name}.webp`)]);

const [w, h] = probe(join(out, `${name}.mp4`));
console.log(`/work/${slug}/${name}.mp4  ratio "${w}/${h}"`);
