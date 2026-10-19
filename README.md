# ODDLY® — Creative Technology Studio website

Next.js 16 (App Router, static export) · React Three Fiber + Drei · GSAP ScrollTrigger + Lenis.

Current visual milestone (16 October 2026): [A different perspective](output/perspective/index.html). A living sculpted background and GPU sculpture-to-frame morph connect the approved hero to the Beach Park reveal. This focused sequence replaces the earlier studio transition and project introduction; the rest of the page remains available for review.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in /out (deploy to Vercel or any static host)
npm run lint
npm run typecheck
```

The development launcher resolves the checkout's real path before starting Next.js. This keeps Turbopack and its page-generation workers on the same path when the project is opened through a Windows junction or drive alias. Extra flags still work, for example `npm run dev -- --port 3210`.

The postbuild step adds equivalent dot-separated filenames for Next 16's nested segment payloads. This allows project prefetch/navigation to work on a basic static host without custom rewrite rules.

## Where things live

| What | Where |
| --- | --- |
| Contact details, socials, nav | `content/site.ts` |
| Services (three disciplines) | `content/services.ts` |
| Projects and case studies | `content/projects.ts` |
| Team (empty until real people are added) | `content/team.ts` |
| Design tokens (colour, type, spacing, motion) | `app/globals.css` |
| 3D poses per scroll scene | `components/scene/choreography.ts` |
| Procedural sculpture geometry | `components/scene/geometry.ts` |
| Materials, lights, wires, render loop | `components/scene/Installation.tsx` |
| Studio composition and first-project reveal | `components/home/experience/` |
| Reference breakdown and prototype status | `REFERENCE-STUDY.md` |
| Reference script (Lusion, Noomo, Psychoactive, Unseen) | `output/reference-script/README.md` |
| Project scenes (one word + one piece per project) | `components/home/scenes/` — word and piece per project in `content/projects.ts → art.word / art.sculpture` |
| Project sculptures (stack, wave, chain, spring, lens, rosette) | `components/scene/geometry.ts → COMPOUNDS`, registered in `sculptures.ts` |
| Coral ribbon threading the project scenes | `components/scene/Ribbon.tsx` |
| Optional sound (off by default, synthesised) | `components/sound/` |
| Services page (full service descriptions) | `app/services/` |
| DOM scroll choreography | `components/home/HomeMotion.tsx` + `components/home/motion/` |
| Shared smooth scroll clock | `components/motion/ScrollRuntime.tsx` |
| WebGL-fallback stills | `public/stills/` |
| Studio and chapter fallback renders | `public/art/` |
| Complete page storyboard | `output/storyboard/index.html` |
| Implemented page review and recordings | `output/implementation/index.html` |

## Before launch: replace placeholders

- **Email.** Set the real address in `content/site.ts → contact.email`. Until then, contact links lead to the brief dialog, which saves a local text brief without sending an enquiry. A configured address enables a prepared email enquiry.
- **Phone and socials.** These render only when set in `content/site.ts`.
- **Project media.** Put files in `public/work/<slug>/`. Then set `media.cover.src` and `media.gallery[].src` in `content/projects.ts`, e.g. `"/work/casatoon/cover.jpg"`. Use `kind: "video"` for mp4/webm. Until a `src` is set, the site shows a placeholder plate labelled "Imagery in preparation".
- **Case-study text.** Fill `context`, `problem`, `solution`, `results`, `year` and `url` in `content/projects.ts`. Empty fields stay hidden. Add only verified facts: no invented metrics or quotes.
- **Team.** Add real people to `content/team.ts`; the About section shows them automatically.

## Replacing a project sculpture with a real 3D model

Each project scene shows a code-generated clay piece until a modelled one is supplied:

1. Export the model as `.glb` (Draco compression is fine; it is decoded locally from `public/draco/`).
2. Put it in `public/models/`, e.g. `public/models/joyno-accounting.glb`.
3. In `components/scene/sculptures.ts`, add `model: "/models/joyno-accounting.glb"` to that piece (`stack` = Joyno Accounting, `wave` = Shark's Tail, `chain` = JoynoSync, `spring` = CasaToon, `lens` = NxOne DC, `rosette` = Marketing & Content).

The model is centred and scaled to the piece's footprint, keeps its own materials, sits on the plinth, and passes behind the scene word like the code shape. Keep each file small (under ~1.5 MB; ~30–80k triangles).

## How the 3D works

- One persistent `<canvas>` sits between two layers of HTML type. Elements with the `front` class render above the sculptures, and elements with `back` render beneath them.
- Every element with `data-scene="<id>"` marks a scene. While its section fills the viewport, the sculptures hold that scene's pose from `choreography.ts`. Between sections they travel from one pose to the next.
- To change a composition, edit the poses. Positions are fractions of the viewport, so a composition holds at any screen size. Phones have their own pose set.
- The canvas loads after the page has painted, renders only while something on screen changes, and lowers resolution on slow devices. Context loss switches to still imagery. Phones pause the canvas after the opening/studio and use chapter stills.
- With `prefers-reduced-motion`, the canvas shows only the opening. The studio uses a static sculpture composition and decorative scroll effects are disabled.
- Without WebGL, every sculpture composition has a pre-rendered still.
- Lenis runs only for fine pointers with motion allowed; touch scrolling remains native. GSAP and the stage read the same scroll position. Menu and dialog locks stop and resume Lenis.
- After the hero, a three-line statement leads into The Beach Park: the coral loop becomes a frame, the site's own hero opens inside it and then fills the screen. The full screen recording plays only on request ("Watch the site") and pauses offscreen. Phones and reduced motion show the same content unpinned.
- Confirmed sources: `thebeachpark.vercel.app`, `joynoadmin.tech`, `joynosync.web.app`, and `app.casatoon.com`. The latter three captures show public entry views. Authenticated workspaces were not accessed.
- Creative imagery consists of clearly identified original ODDLY typography studies. Client creative assets and verified project outcomes remain pending.
