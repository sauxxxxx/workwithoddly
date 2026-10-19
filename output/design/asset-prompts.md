# Original assets and prompts

The initial direction assets were generated with the built-in ImageGen tool on 15 October 2026. The studio image is a visual direction reference. The coastal image is fictional concept photography and is no longer displayed in the opening sequence; confirmed project media replaces it.

The exact submitted prompts are saved in [generation-prompts.txt](generation-prompts.txt).

## Studio frame

Reference: the approved ODDLY hero. Warm cream #F8F6EF, navy #0F172A, coral #FF7A59, lavender #A78BFA, sage #7BA894. Extremely heavy condensed typography. Large tactile matte ceramic coral loop cropped through the right and top edges, a smaller sage knot lower right, a lavender ring partly cropped lower left. Soft natural shadows. Headline: ONE STUDIO. / MANY WAYS / FORWARD. Short supporting copy below. No diagrams, connecting lines, cards, metrics, or invented proof.

Saved direction: `frames/02-studio-direction.png`.

## Coastal concept

Original wide photographic concept for a hospitality portfolio scene. View from a limestone overlook onto an unbranded tropical cove at late afternoon; dark teal rippled sea, pale sand, sage foliage, warm cream light, lavender-grey clouds, and warm coral sunlight. Horizon near upper third, dark open water for white editorial typography, foliage to the right. Physically believable detail and subtle grain. No recognizable hotel, actual property, buildings, people, logos, UI, or lettering.

Source: `assets/coast-concept-source.png`. Production assets: `/public/art/coast-concept.webp` and `/public/art/coast-concept-960.webp`.

The concept has now been replaced through `content/projects.ts` with media from the studio-confirmed project URL.

## Production studio stills

`public/art/studio-desktop.webp` and `public/art/studio-mobile.webp` are transparent browser renders of the existing ODDLY sculpture geometry, captured at the studio pose. These are used for reduced motion and unavailable WebGL. The generated direction screenshot is not used as a website background.

## Confirmed project media

The studio supplied and confirmed [thebeachpark.vercel.app](https://thebeachpark.vercel.app/). Desktop, accommodation-section, and mobile screenshots were captured directly in a real browser after dismissing the analytics prompt using Essential only. No interface was invented or redesigned in the captures.

- `public/work/the-beach-park-hadsan/desktop.webp`, `detail.webp`, and `mobile.webp`: optimized captures. Original PNG captures are in `assets/beach-park-desktop.png`, `beach-park-detail.png`, and `beach-park-mobile.png`.
- `public/work/the-beach-park-hadsan/cover.mp4`: silent 16-second excerpt from the confirmed site's `/media/hero-hadsan-last.mp4`, encoded at 1280×720, 24fps, about 3MB.
- `public/work/the-beach-park-hadsan/cover.webp`: poster extracted at 0.5 seconds from that source.

The earlier `thebeachpark.com` screenshot is retained only as a research artifact and is not used as project evidence. The user explicitly identified the Vercel site as the version to feature.
