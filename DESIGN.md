---
name: ODDLY®
description: A hanging installation of three painted sculptures over a cream editorial page; condensed black display type, charcoal hairlines, one coral signal.
colors:
  charcoal: "#0F172A"
  coral: "#FF7A59"
  lavender: "#A78BFA"
  sage: "#7BA894"
  cream: "#F8F6EF"
  paper-deep: "#EFECE2"
  ink-soft: "rgb(15 23 42 / 0.72)"
  ink-mute: "rgb(15 23 42 / 0.62)"
  rule-hair: "rgb(15 23 42 / 0.16)"
  rule-strong: "rgb(15 23 42 / 0.9)"
typography:
  hero:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "min(19.5vh, 13.4vw)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.012em"
    fontVariation: "\"wdth\" 62"
  display:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(3.5rem, 10vw, 9.5rem)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  display-small:
    fontFamily: "Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.84
    letterSpacing: "-0.01em"
    fontVariation: "\"wdth\" 62"
  statement:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.9vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.9vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"ss01\", \"cv11\""
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  micro:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  plate: "2px"
  icon: "0.875rem"
  pill: "999px"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4.5rem"
  s-9: "7rem"
  s-10: "10rem"
  gutter: "clamp(1rem, 2.4vw, 2.25rem)"
  margin: "clamp(1rem, 3.2vw, 3rem)"
  section: "clamp(6rem, 14vh, 11rem)"
  nav-height: "4.5rem"
components:
  button-start-project:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1rem"
  button-start-project-hover:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.charcoal}"
  menu-toggle:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.cream}"
    rounded: "{rounded.icon}"
    size: "2.75rem"
  link-underlined:
    textColor: "{colors.charcoal}"
    typography: "{typography.label}"
    padding: "0.5rem 0"
  nav-bar-scrolled:
    backgroundColor: "{colors.cream}"
    height: "{spacing.nav-height}"
    padding: "0 {spacing.margin}"
  plate:
    backgroundColor: "{colors.paper-deep}"
    rounded: "{rounded.plate}"
  index-row-hover:
    backgroundColor: "{colors.paper-deep}"
    padding: "1rem 0"
---

# Design System: ODDLY®

## Overview

**Creative North Star: "The Hanging Installation"**

ODDLY is a gallery wall with a Calder mobile in front of it. The page is cream paper set with very large, very condensed black capitals and a quiet editorial text voice; in front of and behind that type hang three painted sculptures, one per discipline: a coral matte-ceramic loop (Creative), a charcoal lacquered-metal quatrefoil (Technology), and a lavender/sage pair of clay discs (Automation). As the reader scrolls, the installation re-balances into a new pose per section, and hairline charcoal wires appear when the pieces are shown as a connected system or as a mobile at rest. Type is the architecture; the sculptures are the event.

Density is low and the scale contrast is extreme: display capitals measured against the viewport sit beside 15-17px Inter, with almost nothing in between except a Plus Jakarta lead voice. Structure comes from a 12-column grid, charcoal hairline rules, and generous section padding, never from boxes, cards, or tinted panels. Related content shares a clear layout: all three disciplines use the same readable service rows and related-project links. Variation comes from display type, project compositions, and restrained sculpture placement.

Colour is disciplined: cream ground, charcoal ink, coral as the single loud signal. Lavender and sage belong to the sculpture materials, project art swatches, and small discipline markers; they never become general UI accents.

**Key Characteristics:**
- Cream paper ground, charcoal ink, coral as the only loud signal.
- Archivo black at 62% width, uppercase, line-height 0.84, sized to the viewport.
- Three procedural 3D sculptures in brand materials, posed per scene and layered between "back" and "front" type planes.
- Charcoal hairlines (1px) as the only connective line, on the page and as wires in 3D.
- Flat paper; depth comes from the real-time shadows of the sculptures, not from UI shadows.
- Coral underlines (2px) as the link and call-to-action language.

## Colors

A brand-pinned five-colour palette used as paper, ink, and one signal, with two secondary hues reserved for the Automation discipline.

### Primary
- **Signal Coral** (coral): the only loud colour on a page. The brand full stop, 2px link underlines, the CTA hover fill, text selection, the focus halo, and the Creative sculpture. Never a large flat UI field on the home page.

### Secondary
- **Automation Lavender** (lavender): Automation sculpture disc, workflow nodes (odd steps), the second discipline underline in the studio statement.
- **Automation Sage** (sage): the paired disc, workflow nodes (even steps), the third discipline underline.

### Neutral
- **Ink Charcoal** (charcoal): all primary text, display type, the pill CTA and menu toggle fill, rules, wires, and the quatrefoil sculpture (rendered with a lifted albedo, #18223A, so the form reads in light).
- **Gallery Cream** (cream): the page ground and the browser theme colour; also the knock-out colour that masks type plates over the 3D stage.
- **Deep Paper** (paper-deep): a half-step into the paper for quiet fields: plate backgrounds, index-row hover, scrollbar track.
- **Soft Ink** (ink-soft, 7.9:1 on cream): secondary copy, captions, descriptions.
- **Muted Ink** (ink-mute, 5.6:1 on cream): micro labels, fact terms, metadata. This is the floor for small text; nothing lighter carries words.
- **Hairline** (rule-hair): 1px dividers inside lists and footers.
- **Strong Rule** (rule-strong): 1px structural rules that open an index, a ledger, or a section block.

### Named Rules
**The One Signal Rule.** Coral is the only loud colour on any cream page. It marks endings, links, and the active hover; it does not fill panels or backgrounds on the home page.

**The Discipline Colour Rule.** Lavender and sage belong to Automation (and to project art swatches). They may identify a discipline with a small marker, but never become generic button fills or decorative tints.

**The Five-Swatch Rule.** Project art (case-study title fields, placeholder plates) is set only from the five brand swatches as ground / ink / accent triples. A cream plate on the cream page moves to deeper paper so it never vanishes.

## Typography

**Display Font:** Archivo, variable width axis at 62, weight 900 (fallback Arial Narrow)
**Brand/Text Font:** Plus Jakarta Sans (fallback system-ui)
**UI/Body Font:** Inter with ss01 and cv11 (fallback system-ui)

**Character:** A poster voice and a reading voice. Archivo extra-condensed black capitals carry names and disciplines at architectural scale; Plus Jakarta carries every sentence that has something to say (statements, ledes, project names); Inter handles body, labels, and metadata quietly.

### Hierarchy
- **Hero** (900, min(19.5vh, 13.4vw), 0.84): the three stacked discipline words in the first viewport only. Height-bound so the stack always fits one screen.
- **Display** (900, clamp(3.5rem, 10vw, 9.5rem), 0.84): section names and project names; case-study titles run larger (up to 10rem, or viewport-bound per layout).
- **Display Small** (900, clamp(2.75rem, 6.4vw, 6rem), 0.84): secondary section names (Technology heading, Automation on small screens).
- **Statement** (Jakarta 600, clamp(1.9rem, 3.9vw, 4rem), 1.08, -0.03em): the studio statement and large positioning sentences.
- **Lead** (Jakarta 400, clamp(1.3rem, 1.9vw, 1.75rem), 1.25, -0.015em): section ledes, case-study categories, sub-titles of work blocks (at 600-700).
- **Title** (Jakarta 700, 1-1.25rem, -0.01 to -0.015em): service names, project captions, index names.
- **Body** (Inter 400, 1.0625rem, 1.55): running copy, 30-66ch measures; narrative paragraphs step up to 1.125rem.
- **Label** (Inter 500-600, 0.9375rem): nav links, CTA, "next" links, captions.
- **Micro** (Inter 400, 0.8125rem, tabular numerals, muted ink): fact terms, frame captions, footer, menu headings.

### Named Rules
**The Condensed Capitals Rule.** Display type is always Archivo 900 at width 62, uppercase, line-height 0.84. Display sizes are bound to the viewport (vw and vh), not to a fixed rem ramp.

**The Sentence Voice Rule.** Anything read as a sentence is Plus Jakarta or Inter in sentence case. Capitals belong to display only.

**The Coral Full Stop Rule.** The brand dot is a coral disc (0.2em) that ends a display line or wordmark, used only where a sentence or name ends.

## Layout

A fluid editorial grid uses the shared gutter and outer margin. The opening retains its sculptural composition. The studio introduction places three large display lines on the left and a dramatically enlarged coral loop on the right, with smaller lavender and sage forms cropped into the lower corners. A full-bleed featured-project film follows, with cream display type, scroll-linked framing, project links, and a pause/play control. Its media comes from the studio-confirmed Beach Park site. The page then leads into three flowing service sections: a discipline heading and short introduction on the left, numbered service names and descriptions on the right, and related-project links below. Service sections never pin or depend on scroll animation for visibility. Below 1100px each description sits beneath its service name; below 700px the two main columns stack.

After the featured project and services, More work uses three compact 16:10 previews in a slightly staggered two-column layout, followed by a complete project index. Below 600px previews stack. The About section uses a quieter deep-paper field, a concise display heading, studio context, and location facts. The closing retains its large wordmark and hanging sculptures, with additional mobile clearance above the heading. The hero's width animation is clipped to its section to prevent horizontal overflow.

Layering is a system: z-back (1) for type behind the sculptures, z-stage (2) for the 3D canvas, z-front (3) for type and controls in front, z-nav (20), z-menu (30). Type that must sit in front of the stage is backed with cream where it overlaps.

## Elevation & Depth

The page is flat paper. Depth belongs to the real-time 3D installation: three sculptures under a soft key light from upper left, a warm hemisphere fill, a studio lightformer environment, and a 7.5% charcoal shadow catcher behind them so the pieces float above the page. UI surfaces do not cast shadows, with no shadows on project previews.

### Shadow Vocabulary
- **Scrolled nav rule** (`box-shadow: 0 1px 0 var(--rule)`): a hairline, not a shadow; appears under the cream nav once the page scrolls.
- **Focus halo** (`outline: 2px solid charcoal; outline-offset: 3px; box-shadow: 0 0 0 5px rgb(255 122 89 / 0.55)`): every focusable element.

### Named Rules
**The Paper Is Flat Rule.** Buttons, navigation, and project previews carry no shadow. If something needs to feel lifted, it is a sculpture, not a box.

**The Material Rule.** Coral is matte fired ceramic (roughness 0.66, pitted grain), charcoal is lacquered painted metal (clearcoat 1), lavender and sage are clay (roughness 0.78, fine grain). No glass, chrome, glow, or iridescence.

## Shapes

Square paper with a whisper of corner (2px) on plates and coloured case-study title fields; panorama covers run square to the edge. Two exceptions come from the brand kit: the pill CTA (999px) and the app-icon square menu toggle (0.875rem). Circles appear as the brand pattern (large discs cropped by the plate frame), the coral dot, and the workflow nodes. Lines are 1px charcoal hairlines; links underline at 2px. Icons are authored on a 24px grid with one 1.75px stroke and square caps.

## Components

### Buttons
Charcoal and certain: there is one filled button.
- **Shape:** full pill (999px).
- **Primary ("Start a project"):** charcoal fill, cream text, Inter 600 label, 0.625rem 1rem padding.
- **Hover / Focus:** fill swaps to coral with charcoal text (160ms linear); focus uses the global charcoal outline and coral halo.
- **Text actions:** every other action is an underlined link: label weight 600, a 2px coral bottom border or underline, and an authored arrow icon that nudges 0.15-0.25em in its direction of travel on hover (420ms expo-out).

### Navigation
- **Bar:** fixed, 4.5rem, transparent over the hero; translucent cream with a hairline and a subtle backdrop blur once scrolled, keeping content separate from the controls.
- **Links:** Inter 500 at 0.9375rem; a 2px coral underline draws in left to right on hover.
- **Mobile (<900px):** links and CTA hide behind the charcoal app-icon toggle (2.75rem, 0.875rem corner) whose two bars rotate into a cross; the menu is a full-screen cream sheet with Archivo display links (clamp(3.5rem, 17vw, 8rem)) that turn coral on hover, a Jakarta side list, and a coral-underlined email.

### Plates (signature)
The frame for every piece of project media.
- **Corner Style:** 2px, overflow hidden, aspect ratio from the media.
- **Background:** deep paper until media loads.
- **Placeholder:** until real media exists, the plate is filled from the project's swatch triple with three large cropped brand circles, the project name in Archivo display on a ground-coloured tab, and a mandatory "Imagery in preparation" note (short form "Pending" under 17rem container width).
- **Hover (as a link):** the figure scales to 1.025 inside its clipped frame over 900ms expo-out. Reduced motion disables the transform.

### Index Rows
- **Style:** numbered rows with a Jakarta project name, soft-ink category, and a final arrow, separated by charcoal hairlines and framed by strong opening and closing rules.
- **Hover / Focus:** a subtle deep-paper fill; the row remains stationary.
- **Mobile:** the category sits beneath the project name and the arrow remains at the right.

### Fact Lists
- **Style:** two-column term/value rows separated by hairlines: micro muted-ink terms at a fixed 7.5-8rem column, Jakarta 500 values with tabular numerals; strong rules in ledger layouts.

### Service Lists
- **Style:** numbered native disclosures with hairline dividers and complete descriptions on expansion. Each discipline allows one description open at a time.
- **Related work:** project links follow each discipline's services; decorative imagery does not compete with the list.
- **Sculptures:** expressive chapter-scale forms behind readable foreground content. Phones use composed alpha stills above the main reading area.

### Case-Study Title Field
- **Style:** one information architecture, a different title composition per project (panorama, split, ledger, tide, sheet). Coloured layouts set a field from the project's ground swatch with a 2px corner, inset by the page margin under the nav.

### The Installation (signature)
Three procedural sculptures (coral loop, charcoal quatrefoil, lavender/sage twin discs) posed per scene from a screen-relative choreography (x, y as fractions of the half-viewport; exits leave up-right, down-left, down-right). Poses are damped, never tweened by keyframe; a slow 0.035rad sway keeps the pieces suspended; fine pointers get a small parallax. Wires (charcoal, about 1.2px) link the discs to the other pieces in the system view and hang from the top edge when the mobile comes to rest at the close. Reduced motion holds the opening composition.

## Do's and Don'ts

### Do:
- **Do** set display type in Archivo 900, width 62, uppercase, line-height 0.84, sized to the viewport.
- **Do** keep coral to signals: the full stop, 2px underlines, the CTA hover, selection, and the focus halo.
- **Do** build structure with 1px charcoal rules (rule-hair inside lists, rule-strong to open a block) on the 12-column grid.
- **Do** give every section its own composition on the shared tokens; vary placement, not values.
- **Do** mark every placeholder plate "Imagery in preparation" until real media replaces it.
- **Do** use the authored 24px, 1.75px square-cap arrows for directional links and nudge them in their direction on hover.
- **Do** keep small text at ink-mute (5.6:1) or darker, and keep the charcoal outline plus coral halo on every focusable element.
- **Do** keep service sections in normal document flow at every size and hold the opening pose under reduced motion.

### Don't:
- **Don't** use lavender or sage as general UI accents; they belong to Automation and project art.
- **Don't** put drop shadows on project previews, buttons, or navigation.
- **Don't** wrap content in rounded cards or decorative tinted panels; use rules, whitespace, and the grid. The About section may use a full-width deep-paper ground; a charcoal ground may introduce featured work, and saturated fields are reserved for case-study title fields and project plates.
- **Don't** set sentences in display capitals or set display in anything other than condensed Archivo.
- **Don't** render the sculptures in glass, chrome, glow, or gradients; they are ceramic, lacquered metal, and clay.
- **Don't** introduce colours outside the five brand swatches and their documented ink/paper derivatives.


## Complete page sequence

The approved hero is the material and typographic foundation. Noomo informs the shared composition of type and sculpture; Lusion informs the large project presentation. No reference-site assets or source code are reused.

- The 16 October opening study supersedes the earlier studio close-up and overlapping project captures. `PerspectiveSequence` uses a quieter Jakarta statement and the same coral sculpture, which opens into a lens and becomes the project frame. `#work` lands at the completed reveal. `FeaturedWork` now provides the responsive project detail and actual website walkthrough.
- `RoomHost` renders a continuous displaced 3D surface beneath both HTML type planes. Procedural lighting, smooth normals, restrained ambient movement, and a warm-to-sage project transition give the background dimension. A browser-rendered still supports unavailable WebGL.
- The focused quality-gate artifact is `output/perspective/index.html`. Desktop uses a short sticky stage; touch and reduced motion preserve normal-flow layouts. Project links are inert while visually hidden. The remaining scene direction is retained pending review of this opening study.
- `CapabilityChapters` presents technology with a large sage knot; automation with a lavender form and illustrative three-step workflow; creative with layered original ODDLY typography studies and the coral form. All sixteen service descriptions use native disclosure controls.
- `WorkArchive` provides seven project links with hover/focus previews. Touch users have separate preview buttons. Missing media produces a typographic category preview without invented interfaces.
- About reunites the sculpture family; Contact resolves to charcoal with a close coral form and a project-brief action. Real contact details remain pending; saving a local draft does not imply an enquiry was sent.
- Lenis, ScrollTrigger, and the stage share scroll position. Sculptures travel between measured scenes and turn locally within chapters. Typography leaves with transforms; project interfaces settle and the creative studies move on separate planes. No forced pinning or loading gate is used.
- Small screens retain native touch scrolling, live opening/studio poses, and composed alpha renders after the studio; the hidden canvas pauses. Reduced motion disables decorative GSAP effects and automatic video playback. Unavailable or lost WebGL uses still imagery.
- Confirmed project sources: `thebeachpark.vercel.app`, `joynoadmin.tech`, `joynosync.web.app`, and `app.casatoon.com`. The latter three captures show public entry views, without suggesting authenticated workspace access. Client creative assets and verified case-study outcomes remain pending.
- `output/implementation/index.html` collects actual desktop/mobile browser frames, recordings, and verification notes. Reference-site parity is a visual judgment, not a build-test result.
