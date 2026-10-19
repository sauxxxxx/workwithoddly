// Reference-site teardown: stack fingerprint + scroll storyboard frames.
// usage: node refscan.mjs <name> <url> <outDir> [frames=12] [w=1440] [h=900]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const [name, url, outDir, framesArg = "12", wArg = "1440", hArg = "900"] = process.argv.slice(2);
const FRAMES = +framesArg;
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--hide-scrollbars", "--autoplay-policy=no-user-gesture-required", "--mute-audio"],
});
const page = await browser.newPage();
await page.setViewport({ width: +wArg, height: +hArg, deviceScaleFactor: 1 });
await page.setUserAgent(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
);

const resources = [];
page.on("response", async (r) => {
  const t = r.request().resourceType();
  if (!["script", "stylesheet", "font", "media", "image", "fetch", "xhr", "other"].includes(t)) return;
  const len = +(r.headers()["content-length"] || 0);
  resources.push({ type: t, url: r.url(), status: r.status(), bytes: len, mime: r.headers()["content-type"] || "" });
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));

const t0 = Date.now();
try {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
} catch (e) {
  errors.push("goto: " + e.message.slice(0, 120));
}
const loadMs = Date.now() - t0;
await new Promise((r) => setTimeout(r, 6000)); // let preloaders finish

// Click through common "enter" gates (sound prompts, intros).
const gate = await page.evaluate(() => {
  const words = /^(enter( site)?|start|continue|skip( intro)?|(enter |continue )?without (sound|audio)|sound off|no sound|mute)$/i;
  const els = [...document.querySelectorAll("button, a, [role=button], div, span")].filter((e) => {
    const t = (e.innerText || "").trim();
    const r = e.getBoundingClientRect();
    return t && t.length < 40 && words.test(t) && r.width > 0 && r.height > 0;
  });
  // prefer a "without sound" option
  els.sort((a, b) => (/without|no sound|off/i.test(b.innerText) ? 1 : 0) - (/without|no sound|off/i.test(a.innerText) ? 1 : 0));
  const el = els[0];
  if (!el) return null;
  el.click();
  return el.innerText.trim();
});
if (gate) await new Promise((r) => setTimeout(r, 5000));
await page.screenshot({ path: path.join(outDir, `${name}-00-open.png`) });

// Runtime fingerprint (observed in the page, not inferred).
const fp = await page.evaluate(() => {
  const w = window;
  const canvases = [...document.querySelectorAll("canvas")].map((c) => {
    let ctx = "none";
    try {
      if (c.getContext("webgl2")) ctx = "webgl2";
    } catch {}
    const r = c.getBoundingClientRect();
    return { ctx, w: Math.round(r.width), h: Math.round(r.height), pos: getComputedStyle(c).position, z: getComputedStyle(c).zIndex };
  });
  const fonts = [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`))];
  const html = document.documentElement;
  const cls = (html.className + " " + document.body.className).slice(0, 300);
  const sample = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const cs = getComputedStyle(e);
    return { font: cs.fontFamily.slice(0, 80), size: cs.fontSize, weight: cs.fontWeight, color: cs.color, bg: cs.backgroundColor };
  };
  const biggestText = [...document.querySelectorAll("h1,h2,h3,p,span,div,a")]
    .filter((e) => e.childElementCount === 0 && (e.innerText || "").trim().length > 1)
    .map((e) => ({ t: e.innerText.trim().slice(0, 50), px: parseFloat(getComputedStyle(e).fontSize), f: getComputedStyle(e).fontFamily.split(",")[0] }))
    .sort((a, b) => b.px - a.px)
    .slice(0, 8);
  return {
    title: document.title,
    globals: {
      THREE: !!w.THREE ? w.THREE.REVISION || "yes" : w.__THREE__ || false,
      gsap: w.gsap ? w.gsap.version : false,
      ScrollTrigger: !!w.ScrollTrigger,
      Lenis: !!w.Lenis || !!w.lenis,
      LocomotiveScroll: !!w.LocomotiveScroll,
      barba: !!w.barba,
      PIXI: !!w.PIXI,
      Webflow: !!w.Webflow,
      next: !!w.__NEXT_DATA__ || !!w.next,
      nuxt: !!w.__NUXT__ || !!w.$nuxt,
      vue: !!w.__VUE__,
      react: !!document.querySelector("[data-reactroot]") || !!w.React,
      Howler: !!w.Howler,
    },
    htmlClasses: cls,
    canvases,
    fonts: fonts.slice(0, 14),
    body: sample("body"),
    biggestText,
    scrollHeight: document.documentElement.scrollHeight,
    bodyOverflow: getComputedStyle(document.body).overflow,
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    videos: [...document.querySelectorAll("video")].length,
    links: [...document.querySelectorAll("a")].map((a) => (a.innerText || "").trim()).filter(Boolean).slice(0, 30),
  };
});

// Scroll storyboard: wheel events (works with smooth-scroll libraries and hijacked scroll).
const frames = [];
const steps = FRAMES - 1;
const vh = +hArg;
for (let i = 1; i <= steps; i++) {
  for (let k = 0; k < 6; k++) {
    await page.mouse.move(+wArg / 2, vh / 2);
    await page.mouse.wheel({ deltaY: (vh * 0.9) / 6 });
    await new Promise((r) => setTimeout(r, 90));
  }
  await new Promise((r) => setTimeout(r, 1600));
  const y = await page.evaluate(() => window.scrollY);
  const file = `${name}-${String(i).padStart(2, "0")}.png`;
  await page.screenshot({ path: path.join(outDir, file) });
  frames.push({ file, scrollY: Math.round(y) });
}

// Library signatures from script URLs and response bodies (first 400KB of each JS).
const scriptUrls = resources.filter((r) => r.type === "script").map((r) => r.url);
const sigs = { three: /REVISION\s*=\s*"?\d+|three\.module|THREE\./, gsap: /gsap|GreenSock/, scrolltrigger: /ScrollTrigger/, lenis: /lenis/i, ogl: /\bOGL\b|ogl\.js/, pixi: /pixi/i, theatre: /@theatre|theatre\.js/i, barba: /barba/i, swup: /swup/i, locomotive: /locomotive-scroll/i, howler: /howler/i, spline: /spline/i, rive: /rive\.wasm|@rive-app/i, draco: /draco/i, basis: /basis_transcoder|ktx2/i, gltf: /GLTFLoader|\.glb/i, webgpu: /navigator\.gpu|WebGPU/ };
const found = {};
for (const u of scriptUrls.slice(0, 60)) {
  try {
    const body = await page.evaluate(async (src) => {
      try {
        const r = await fetch(src);
        const t = await r.text();
        return t.slice(0, 400000);
      } catch {
        return "";
      }
    }, u);
    for (const [k, re] of Object.entries(sigs)) if (re.test(body) || re.test(u)) (found[k] ||= []).push(u.split("/").pop().slice(0, 60));
  } catch {}
}
const threeRev = found.three
  ? await page.evaluate(async (srcs) => {
      for (const s of srcs) {
        try {
          const t = await (await fetch(s)).text();
          const m = t.match(/REVISION\s*=\s*"(\d+[a-z]*)"/) || t.match(/"(1\d\d)"\s*;?\s*const\s+\w+\s*=\s*0/);
          if (m) return m[1];
        } catch {}
      }
      return null;
    }, scriptUrls)
  : null;

const assets = {
  models: resources.filter((r) => /\.(glb|gltf|drc|ktx2|basis|hdr|exr)(\?|$)/i.test(r.url)).map((r) => r.url.split("/").pop().slice(0, 70)),
  videos: resources.filter((r) => /video|\.mp4|\.webm|\.m3u8/i.test(r.mime + r.url)).map((r) => r.url.split("/").pop().slice(0, 70)),
  audio: resources.filter((r) => /audio|\.mp3|\.ogg|\.wav/i.test(r.mime + r.url)).map((r) => r.url.split("/").pop().slice(0, 70)),
  fonts: resources.filter((r) => r.type === "font").map((r) => r.url.split("/").pop().slice(0, 70)),
  scriptCount: scriptUrls.length,
  hosts: [...new Set(resources.map((r) => new URL(r.url).host))].slice(0, 15),
};

const report = { name, url, loadMs, gateClicked: gate, fingerprint: fp, libsByScriptSignature: Object.fromEntries(Object.entries(found).map(([k, v]) => [k, [...new Set(v)].slice(0, 4)])), threeRevision: threeRev, assets, frames, errors: errors.slice(0, 8) };
fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ name, loadMs, gate, globals: fp.globals, libs: Object.keys(found), threeRev, canvases: fp.canvases.length, frames: frames.length, errors: errors.length }));
await browser.close();
