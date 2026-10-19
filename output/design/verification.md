# Opening sequence verification

15 October 2026. Actual browser captures and recording are included alongside this file.

- Composed and inspected the hero, studio close-up, and project reveal as stills before adding the new decorative scroll effects.
- Reviewed a recording through a sequence of extracted frames for framing, sculpture continuity, heading position, and the project transition. `oddly-scroll.mp4` is the trimmed 16-second review recording; the original capture is `oddly-scroll.webm`.
- Browser layout checks at 320, 390, 768, 1024, and 1440px: no horizontal page overflow; studio and project heading boxes remain within the viewport. Phone frames were inspected visually.
- All 16 service headings remain present below the opening slice.
- Project link reaches `/work/the-beach-park-hadsan/`. Menu opens, closes with Escape, and restores focus.
- Fixed an interaction defect found during these checks: React Three Fiber's inline wrapper pointer events were intercepting the project link. The entire decorative canvas subtree now ignores pointer input.
- Reduced motion: decorative GSAP transforms revert, studio uses its static sculpture render. A browser screenshot is saved as `frames/02-studio-reduced-motion.png`.
- WebGL disabled in a fresh browser context: no live canvas, static studio composition visible. Screenshot: `frames/02-studio-no-webgl.png`.
- `npm run lint` and `npm run build` pass; build includes TypeScript validation and all seven statically exported case-study routes.
- The studio subsequently confirmed `https://thebeachpark.vercel.app/`. The featured film and three real interface screenshots now use this source. Verified pause/play, offscreen pause, reduced-motion pause, mobile overflow, the live-site link, case-study video controls, and all three gallery images.

These checks establish functional behavior and responsive composition. They are not a measured performance audit on physical mobile devices.
