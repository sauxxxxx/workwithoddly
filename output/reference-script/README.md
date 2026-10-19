# Reference script: Lusion · Noomo · Psychoactive · Unseen

This is the second pass, captured 16 October 2026. The first pass, `REFERENCE-STUDY.md`, recorded what each site looks like. This pass adds two things: the sequence of each homepage, frame by frame, and the technology each one loads, as observed in a live browser.

**Method.** I ran `refscan.mjs` in headless Chrome (GPU, 1440×900, audio muted). It loads the page, waits for the preloader, and clicks any "enter without audio" gate. It then records the runtime globals and the libraries found in the loaded scripts, and takes 12 frames, scrolling about 0.9 of a screen with the mouse wheel between frames.

| Site | Storyboard | Raw data |
| --- | --- | --- |
| Lusion | [lusion-sheet.png](lusion-sheet.png) | [lusion/lusion.json](lusion/lusion.json) |
| Noomo | [noomo-sheet.png](noomo-sheet.png) | [noomo/noomo.json](noomo/noomo.json) |
| Psychoactive | [psychoactive-sheet.png](psychoactive-sheet.png) | [psychoactive/psychoactive.json](psychoactive/psychoactive.json) |
| Unseen | [unseen-sheet.png](unseen-sheet.png) | [unseen/unseen.json](unseen/unseen.json) |

The full-size frames are in each site's folder.

**Limits.** These are observations, not their source code.
- "Uses X" means X was found running or in loaded scripts. It doesn't mean that's how every effect is built.
- Motion between frames is inferred from consecutive stills.
- The "pixi" and "webgpu" signature matches were analytics or library false positives, so they are ignored.

---

## 1. Lusion: one canvas, one camera, everything in it

**Observed stack**

| Area | What was found |
| --- | --- |
| Framework | Astro (`hoisted.*.js` bundles) |
| 3D | Three.js r158, running in the page |
| Animation library | No GSAP found |
| Canvas | One full-screen, fixed WebGL2 canvas |
| Scrolling | The document never scrolls (`overflow: hidden`, height 900px, `scrollY` stays 0). The wheel drives a custom virtual scroll that moves the page and the 3D scene together. |
| Media | Vimeo reel; `cinematic_*.ogg` sound design; a `matcap.exr` material |
| Type | Aeonik, IBM Plex Mono, and a custom LusionMono |

**Script**

| # | Frame | What happens |
|---|---|---|
| 1 | Opening | A one-line intro top-left. Below it, a framed 3D box of interlocking blue, white and black cross shapes. "Scroll to explore". |
| 2 | Statement | "Bold Ideas, Brought to Life" at 144px. A blue 3D ribbon enters from the left edge. |
| 3 | Reel | A framed reel with a big "PLAY ● REEL" overlaid. It grows toward full screen as you scroll. |
| 4–6 | Featured work | A two-column grid of media cards. Each card has a tiny tag line (`WEB · DESIGN · 3D`) and the title. The header stays fixed. |
| 7–8 | Philosophy | "Where creative ideas become immersive experiences". A cyan 3D tube snakes across the page, through and behind the text. An iPad frame shows an astronaut. |
| 9 | World | The page turns dark and a 3D astronaut floats free. |
| 10–11 | Finale | "STEP INTO A NEW WORLD AND LET YOUR IMAGINATION RUN WILD" wraps in perspective around the astronaut, over a rainbow halo. |

**Signature moves**
- **A continuous 3D ribbon that threads through every section.** The page reads as one object.
- **Frames that grow.** A box becomes the reel, and the reel becomes the screen.
- **Restrained furniture** (tiny labels, fixed header pills) around very rich media.

## 2. Noomo: one word, one object, one project per screen

**Observed stack**

| Area | What was found |
| --- | --- |
| Framework | Nuxt 3 (Vue) with the Prismic content system |
| 3D | Three.js r156 |
| Animation library | GSAP ScrollTrigger, ScrollSmoother and ScrollToPlugin |
| Models | One glTF/Draco model per project: `Jellyfish.glb`, `CoinbaseBall2.glb`, `Cards2Anim.glb`, `Dendy3.glb`, plus `Clouds.glb` and `BG2.glb` for atmosphere |
| Page | About 24,350px tall, roughly 27 screens: long pinned scenes |
| Type | NeueMachina (display), NeueRoman |
| Ground | Periwinkle (`rgb(201,210,231)`) with soft warm light pools |

**Script**

| # | Frame | What happens |
|---|---|---|
| 1 | Opening | "DESIGN THAT ELEVATES YOUR DIGITAL PRESENCE" in big caps, left. Grey pixel blocks float in front of and behind the letters. A tiny paragraph sits right. "SCROLL". |
| 2 | Release | The headline drifts and scales off as the blocks fly past the camera. |
| 3–4 | Project 1 | **IMMERSIVE** fills the width. A magenta jellyfish model on a pixel plinth swims *through* the word. At the bottom: category tags (left), project name and 3 lines (right), "View project" pill (centre). |
| 5–6 | Project 2 | **INTERACTIVE**, with a gold basketball (Coinbase × Golden State Warriors). Same layout. |
| 7–8 | Project 3 | **ENTERPRISE**, with stacked app cards (Salesforce 360). |
| 9–11 | Project 4 | **BESPOKE**, with a dental scanner (Dandy). The object grows to fill the frame as the next scene arrives. |
| 12 | About | "AT NOOMO, WE CREATE 3D STORYTELLING WEBSITES…" in caps, with a small paragraph right. |

**Signature moves**
- **One giant word plus one bespoke 3D object per project**, the object passing between the letters. A repeatable scene grammar where only the word, object and colour change.
- **Copy kept tiny and peripheral.** Meta sits at the bottom edge, with one pill as the action.
- **An atmosphere layer** (the clouds model and coloured light pools), not a flat background.

## 3. Psychoactive: a dense, dark, media-everywhere agency

**Observed stack**

| Area | What was found |
| --- | --- |
| Framework | Vue (Vite-chunked) |
| 3D | Three.js r185 |
| Animation library | GSAP ScrollTrigger |
| Smooth scroll | Lenis |
| Sound | Howler UI sound design: `home-load.mp3`, `frog-new.mp3`, `contact-response-short.mp3` |
| Video | Mux streaming: **97 video requests**. Almost every card is a video. |
| Canvases | **36 canvases**: a separate WebGL canvas per media card for hover and reveal effects |
| Ground and type | `#101012`; Roobert and RoobertMono, with service words at 210px |
| Errors | 974 errors logged during the run, mostly null-canvas errors from those per-card effects |

**Script**

| # | Frame | What happens |
|---|---|---|
| 1 | Opening | A dark starfield with crosshair markers and coordinates. "innovate" top-right (a word that cycles), "Imagine scale" bottom-left. A small reel thumbnail with a play button in the centre. |
| 2 | Reel | The thumbnail expands into a large reel frame. |
| 3 | Clients | The page flips to white. Floating thumbnails orbit "…ambitious brands", with a "See our clients" button. |
| 4–5 | Work | Project cards (SuperAI, Blackbird, Summer Game Fest), with 3D balloons drifting over them. |
| 6 | Positioning | Dark again: "WE DESIGN AND BUILD WEBSITES FOR: sold-out global events / brands launching / game studios / tech companies". |
| 7–8 | Featured | One huge feature (World of WearableArt), then pairs (Hellboy, BurgerFuel), "View all work", and a client logo strip. |
| 9 | Tool | **A working "AI Audit"**: enter a URL and get a score out of 100. Content-hub cards beside it. |
| 10 | Proof | "50+" awards and an awards table. |
| 11–12 | Close | "Brief our AI agent" as a giant CTA, the email, a row of world clocks, and partner badges. |

**Signature moves**
- **Proof by volume:** every surface is real moving work.
- **An interactive tool on the homepage** that proves capability, not just claims it.
- **Sound design and world clocks** make the studio feel alive.

## 4. Unseen: the homepage is a place, not a page

**Observed stack**

| Area | What was found |
| --- | --- |
| 3D | Three.js r143 |
| Animation library | GSAP |
| Sound | Howler ambient soundtrack (`audio.webm`) |
| Models | glTF with Draco and Basis/KTX2 textures: `room-1.glb`, `room-2.glb`, `chair.glb`, `rocks.glb`, `table-3.glb`, `land-group.glb`, `pillows.glb`, `grass-simple.glb` |
| Scrolling | None. Height 900px; the wheel does nothing on the homepage. |
| Type | Saol Display (serif italic) and Neue Montreal |

**Script**

| # | Frame | What happens |
|---|---|---|
| 0 | Gate | "Enter with / without audio". |
| 1 | The room | A pastel adobe room: arches, stairs into a reflecting pool, a boulder, lavender hills and sky through the openings. Centred "*Creating the* unexpected" (serif italic over sans), with a "View our work" pill. |
| — | Interaction | Pointer and drag shift the view. The water ripples. The scene stays one place. |
| — | Navigation | Index, Projects, Contact; an "Our 2025 Wrapped" pill; a UI toggle (eye icon); ©2026. |

**Signature moves**
- **A brand world with physical materials and light.** You remember the place, not the layout.
- **The entry ritual** (the audio choice).
- **Almost no copy.** The space carries the identity.

---

## What all four share

1. **One persistent full-screen WebGL canvas**, with the HTML layered on top. ODDLY already has this.
2. **One idea per screen.** Big type and one object. Copy is tiny, placed at the edges.
3. **Real work as the payoff.** Lusion and Psychoactive are wall-to-wall project media. Noomo gives each project its own object.
4. **Directed scroll.** A virtual scroll (Lusion), GSAP ScrollSmoother (Noomo) or Lenis (Psychoactive). ODDLY already has Lenis and GSAP.
5. **Atmosphere, never a flat background.** Light pools, starfields, an environment.
6. **A ritual moment.** An entry gate, preloader, reel or sound. Three of the four use sound, always optional.
7. **Distinctive type.** Aeonik, NeueMachina, Roobert and Saol are commercial fonts. ODDLY keeps its own brand fonts and does not copy these.

We take techniques, never code, models, footage or fonts.

## Re-running the capture

`refscan.mjs` (in this folder) needs `puppeteer-core` and a local Chrome:

```bash
npm i -D puppeteer-core
node output/reference-script/refscan.mjs noomo https://noomoagency.com/ output/reference-script/noomo 12
```
