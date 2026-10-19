# ODDLY: reference study and experience script

Reviewed 15 October 2026. The complete ten-scene storyboard is now implemented. The three-frame script below is retained as design history; the current delivery is described here.

## Current implementation

The approved hero leads into the studio close-up, Beach Park website introduction and responsive detail, three distinct capability chapters, a seven-project interactive index, About, and Contact. The rejected resort-film homepage feature has been replaced by actual website captures and an interface recording.

Lenis and GSAP share scroll position with the persistent sculpture stage. Chapter-specific sculpture poses and turns, transform-only title departures, settling interface captures, layered creative studies, and a scroll-linked illustrative workflow carry the sequence. Mobile touch scrolling stays native; the canvas pauses after the opening/studio and subsequent chapters use composed still renders. Reduced motion and unavailable WebGL preserve readable finished layouts.

Confirmed product sources are `joynoadmin.tech`, `joynosync.web.app`, and `app.casatoon.com`. Public sign-in captures are identified as entry views; no authenticated product interiors are implied. Creative uses original ODDLY studio studies until client assets are supplied. Contact saves a local project brief until a real studio email is configured.

See [the implemented page review](output/implementation/index.html) for actual desktop/mobile frames and complete-page recordings. Build and interaction checks do not establish reference-site parity; composition and motion remain visual review judgments.

## Review method

Reviewed the live homepages, their accessible content, desktop compositions, scroll sequences, and selected interactions. Opened Lusion's menu and entered Unseen without audio to inspect its environment. Took mobile spot checks of Noomo and Psychoactive. Screenshots are in `output/playwright/references/`.

These are observations of the pages as they rendered during the review. Recommendations below are our proposed implementation, not claims about the sites' internal code or measured performance. Some remote assets produced browser errors, so the captures are references rather than a complete audit of each site.

## Reference breakdowns

### Lusion

Source: [lusion.co](https://lusion.co/)

Sequence observed: a concise introduction above a large framed 3D scene; an oversized studio statement; supporting copy and reel; a media-led featured-project grid. Persistent navigation opens a compact panel beside the page. The composition pairs restrained page furniture with visually rich media.

Useful for ODDLY: make selected projects feel like the main event, keep captions short, and use a disciplined visual frame around expressive content.

Evidence: [opening](output/playwright/references/lusion-hero.png), [featured work](output/playwright/references/lusion-featured-work.png), [menu](output/playwright/references/lusion-menu.png).

### Psychoactive

Source: [psychoactive.co.nz](https://www.psychoactive.co.nz/)

Sequence observed: a dark atmospheric opening with contrasting type sizes, technical-looking markers, and a central reel; a larger reel view on scrolling; a composition of floating project thumbnails around studio information; further work and a prominent closing invitation. Background treatment and graphic details maintain continuity between sections.

Useful for ODDLY: establish a consistent motion language, vary the scale of each scene, and make transitions feel directed. ODDLY can retain its cream palette while applying that continuity.

Evidence: [opening](output/playwright/references/psychoactive-hero.png), [reel](output/playwright/references/psychoactive-intro.png), [closing](output/playwright/references/psychoactive-closing.png).

### Noomo

Source: [noomoagency.com](https://noomoagency.com/)

Sequence observed: expansive typography over a pale atmospheric ground, with 3D forms passing through the composition; successive project scenes with short supporting descriptions and clear project links; later studio, testimonial, and contact sections. The objects, type, and background act as parts of one visual story.

Useful for ODDLY: use the existing sculptures as recurring participants in the page, give each discipline a memorable visual moment, and keep readable text alongside the spectacle. This is the closest overall reference for ODDLY's existing identity.

Evidence: [opening](output/playwright/references/noomo-hero.png), [project scene](output/playwright/references/noomo-work.png), [lower composition](output/playwright/references/noomo-lower.png).

### Unseen

Source: [unseen.co](https://unseen.co/)

Sequence observed: a branded entry with an option to continue without audio; an immersive architectural setting with water, soft light, and large centered typography; pointer/drag interaction within the setting; persistent links to projects and contact. The environment creates a recognizable place for the brand.

Useful for ODDLY: create a cohesive sense of space through materials, lighting, depth, and subtle interaction. A complete explorable world would be a separate, more involved scope; the main ODDLY page can gain atmosphere without requiring visitors to explore one.

Evidence: [entry](output/playwright/references/unseen-entry.png), [environment](output/playwright/references/unseen-world.png), [interaction](output/playwright/references/unseen-drag.png).

## Current direction

Noomo is the primary reference for the relationship between typography, sculpture, and generous space. Lusion informs the scale and clarity of project presentation. ODDLY retains its own cream ground, condensed Archivo typography, coral signal, and tactile ceramic forms.

The unsuccessful connected-shape diagram and flat coastal illustration have been removed. The current implementation was composed as still frames before adding decorative scroll motion.

## Archived three-frame script

| Frame | Composition at rest | Transition |
| --- | --- | --- |
| 1. Approved opening | Original centered headline, materials, lighting, and peripheral sculptures. | The headline widens and parts as the coral loop moves closer. |
| 2. Studio close-up | Three large lines on the left: ONE STUDIO. / MANY WAYS / FORWARD. A gallery-scale coral loop occupies the right; lavender and sage are cropped into the lower corners. Supporting copy sits below the headline. | The sculpture pose holds through the reading moment, then clears before the project becomes the primary view. |
| 3. First project | Edge-to-edge film from the confirmed Beach Park project, large white title low left, description and project links at right. A small film pause/play control remains available above. | The film opens from an inset frame to the viewport edges with a small scale change. |

All three sections use normal document scroll. There is no scroll lock, extended pinning, or delay before essential content becomes readable. Phone compositions use separate sculpture poses, smaller framing changes, and a single-column project caption.

## Assets and review

The studio uses the existing procedural ODDLY sculptures and materials. Its fallback images are actual transparent renders of those sculptures, captured from the browser for desktop and mobile.

The studio confirmed [thebeachpark.vercel.app](https://thebeachpark.vercel.app/) as the project source. The featured film is an optimized, silent 16-second excerpt of its hero media. The case study includes actual desktop, accommodation-section, and mobile screenshots, plus the live-site link. The generated coastal concept is no longer displayed in the sequence.

- [Three-frame review board](output/design/index.html)
- [Scroll recording](output/design/oddly-scroll.mp4)
- [Asset provenance](output/design/asset-prompts.md)
- [Exact generation prompts](output/design/generation-prompts.txt)

## Accessibility and verification

Reduced motion removes the decorative scroll effects, preserves a composed static studio scene, and prevents film autoplay. Unavailable WebGL uses pre-rendered opening and studio imagery. The canvas and its wrappers do not intercept pointer input; project links and keyboard navigation remain usable. The film pauses offscreen and has a manual pause/play control; case-study films use native controls.

The opening slice has been checked from 320px to 1440px, including phone compositions, project navigation, menu Escape behavior, reduced motion, and unavailable WebGL. The production static export and lint checks pass. These are functional and layout checks, not a claim of reference-site parity or a device performance benchmark.

## Previous review boundary (superseded)

The earlier delivery stopped after the opening sequence. The current implementation extends the complete approved storyboard through Contact; use the current review linked above. Authenticated product media, client creative assets, remaining project imagery, and real contact details are still pending.
