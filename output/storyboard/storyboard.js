const art = '../../public/work/the-beach-park-hadsan/';
const sculpture = (id, cls = '') => `<img class="sculpture ${cls}" src="assets/${id}.webp" alt="" draggable="false">`;
const dot = '<span class="brand-dot"></span>';
const nav = `<div class="site-nav" aria-hidden="true"><img class="icon-logo" src="assets/icon.svg" alt=""><span class="nav-actions"><span>↗</span><span>☰</span></span></div>`;
const serviceList = (items, cls = '') => `<ul class="capabilities ${cls}">${items.map((item, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${item}</li>`).join('')}</ul>`;
const scenes = [
  {
    id: 'opening', number: '01', name: 'The approved opening', beat: 'Introduce / 1 viewport', cls: 'opening',
    image: `<img class="reference desktop-only" src="../design/frames/01-hero.png" alt="Approved ODDLY desktop hero"><img class="reference mobile-only" src="../design/frames/01-hero-mobile.png" alt="Approved ODDLY mobile hero">`,
    composition: 'Keep the approved headline, lighting, tactile materials, and peripheral sculptures. This is the visual promise the rest of the page must keep.',
    motion: 'On exit, type parts gradually. The coral loop approaches the right edge; sage and lavender travel around the reading area. Each object remains recognisable.',
    mobile: 'Keep the approved compact composition. Retain touch scrolling and direct navigation. Reduced motion presents the opening still.',
    assets: 'Ready: existing hero and sculpture geometry.'
  },
  {
    id: 'studio', number: '02', name: 'A studio, with a shared direction', beat: 'Approach / about 1 viewport', cls: 'studio',
    image: `${nav}<p class="scene-label">The studio / Cebu, Philippines</p><h2 class="display studio-title">One studio${dot}<br>Many ways<br>forward${dot}</h2>${sculpture('loop', 'studio-loop')}${sculpture('twist', 'studio-twist')}${sculpture('knot', 'studio-knot')}<p class="studio-copy">We build the website, the system behind it, and the campaign that brings people to it.</p><span class="small-action">Into the work ↘</span>`,
    composition: 'Type owns the left 60%; the coral close-up owns the right. The two smaller forms crop into the lower corners. One short paragraph sits below the heading.',
    motion: 'The coral loop grows into this pose, holds while the statement is read, then travels out right. The first website capture enters the space it leaves.',
    mobile: 'Coral sits above and right of the heading. Supporting copy follows in normal flow. The first project starts immediately after the statement.',
    assets: 'Ready: original sculpture renders. Proposed headline and copy.'
  },
  {
    id: 'beach-intro', number: '03', name: 'Beach Park: show the website', beat: 'Reveal / about 1.2 viewports', cls: 'project-intro',
    image: `${nav}<p class="scene-label">01 / Selected work</p><div class="project-name"><p class="micro">Hospitality / Website &amp; digital experience</p><h2 class="display">The<br>Beach<br>Park${dot}</h2><p class="project-location">Hadsan, Cebu</p><span class="project-cta">Explore the project ↗</span></div><img class="web-shot desktop-project" src="assets/beach-interface.webp" alt="Actual Beach Park desktop website screenshot"><img class="web-shot phone-project" src="assets/beach-mobile.webp" alt="Actual Beach Park mobile website screenshot"><div class="project-credit">Website design &amp; development<br>Digital experience / SEO</div>`,
    composition: 'Keep the cream ground. Place the project title in the left third and a large, crisp website capture on the right. A smaller mobile capture overlaps its lower edge. Captions sit outside the screenshots.',
    motion: 'The desktop screenshot rises from the lower right and settles level. The mobile capture follows slightly later. The project title stays fixed within its own section rather than being printed across resort footage.',
    mobile: 'Title and role appear above one readable website capture. Mobile detail comes next. Preserve the site’s interface instead of cropping it into an anonymous background.',
    assets: 'Ready: confirmed desktop/mobile captures from thebeachpark.vercel.app. Capture a higher-resolution desktop image for final implementation.'
  },
  {
    id: 'beach-detail', number: '04', name: 'Beach Park: demonstrate the experience', beat: 'Inspect / about 1 viewport', cls: 'project-detail',
    image: `${nav}<p class="scene-label">The Beach Park / A closer look</p><h2 class="display detail-title">A better<br>beach day${dot}</h2><img class="web-shot detail-desktop" src="${art}detail.webp" alt="Actual accommodation section of the Beach Park website"><img class="web-shot detail-phone" src="assets/beach-mobile.webp" alt="Actual responsive Beach Park homepage"><p class="detail-copy">From the first impression<br>to the details of a stay.</p><div class="detail-bottom"><span>Website / Responsive experience</span><span>View case study ↗ &nbsp; Visit live site ↗</span></div>`,
    composition: 'Enlarge an actual interface detail on the left, with the mobile screen on the right. A short line of copy explains the relationship. Maintain cream around the media and clear project links.',
    motion: 'On desktop, a brief scrub can advance an actual website recording from the homepage to accommodation content while the mobile view remains readable. Then both media elements leave upward into Technology.',
    mobile: 'Use a vertical screenshot sequence and a user-started recording. No horizontal dragging or pinned scroll is required to understand the work.',
    assets: 'Ready: still captures. Needed: an 8–12-second recording of the website interface; the resort’s background film alone does not demonstrate the design.'
  },
  {
    id: 'technology', number: '05', name: 'Technology: build with purpose', beat: 'Build / about 1.3 viewports', cls: 'technology',
    image: `${nav}<p class="scene-label">01 / Technology</p>${sculpture('knot', 'tech-knot')}<h2 class="display tech-title">Built to<br>do more${dot}</h2><p class="chapter-copy tech-copy">Websites, applications, and the software<br>a business actually runs on.</p>${serviceList(['Website development', 'Application development', 'Custom software', 'UI/UX design', 'Digital products & business systems'], 'tech-services')}<span class="chapter-action">Explore technology ↗</span>`,
    composition: 'A monumental sage knot pushes through the right edge. Strong left-aligned type opens the chapter. Five capabilities form a concise two-column reading band below, with full descriptions available in normal flow.',
    motion: 'The sage form approaches from the edge and turns through one controlled quarter-turn. A subsequent real product screen can enter beside it, giving the chapter evidence once Joyno Accounting media is supplied.',
    mobile: 'Place the sculpture above the heading, then the statement and five capabilities. Each description is available by tap and keyboard; the reading order follows the visible order.',
    assets: 'Ready: sage sculpture and all capability copy. Needed: a real Joyno Accounting product screen/clip for the chapter’s evidence beat. This frame shows the opening composition only.'
  },
  {
    id: 'automation', number: '06', name: 'Automation: give the work momentum', beat: 'Flow / about 1.3 viewports', cls: 'automation',
    image: `${nav}<p class="scene-label">02 / Automation</p>${sculpture('twist', 'automation-twist')}<h2 class="display automation-title">Less work.<br>More flow${dot}</h2><div class="workflow-line"><span class="micro">Illustrative workflow / First state</span><p>Enquiry received<span>↗</span></p></div>${serviceList(['AI solutions', 'Workflow automation', 'CRM systems', 'Internal business tools', 'AI products & integrations'], 'automation-services')}<span class="chapter-action">Explore automation ↗</span>`,
    composition: 'Switch the balance: a large lavender form occupies the left while the statement and a single workflow state sit on the right. Five capabilities stay separate from the demonstration.',
    motion: 'Rotate the lavender form through a slow, continuous gesture. Advance one clear example through “Enquiry received”, “Record organised”, and “Follow-up queued”. Use actual JoynoSync interactions when supplied; the proposed example is not a client outcome.',
    mobile: 'Stack the three example states vertically or provide a labelled next-state control. Keep the five capabilities and their descriptions accessible without waiting for motion.',
    assets: 'Ready: lavender sculpture and capability copy. Needed: sanitized JoynoSync screens or a recording of a real workflow. No connected-shape diagram or fabricated dashboard is proposed.'
  },
  {
    id: 'creative', number: '07', name: 'Creative: make the page expressive', beat: 'Express / about 1.4 viewports', cls: 'creative',
    image: `${nav}<p class="scene-label">03 / Creative</p><div class="poster poster-one"><span class="micro">ODDLY / Direction study 01</span><strong class="display">Different<br>by design${dot}</strong><span class="poster-word"><img src="assets/wordmark-light.svg" alt="ODDLY"></span></div><div class="poster poster-two"><span class="micro">ODDLY / Direction study 02</span><strong class="display">Built<br>for<br>better${dot}</strong></div>${sculpture('loop', 'creative-loop')}<h2 class="display creative-title">Made to<br>be felt${dot}</h2>${serviceList(['Digital marketing', 'Search engine optimization', 'Content creation', 'Video editing', 'Social media graphics', 'Campaign design & production'], 'creative-services')}<span class="chapter-action">Explore creative ↗</span>`,
    composition: 'Use an offset editorial arrangement of image and poster formats, balanced by right-aligned display type. The coral form frames the artwork from behind. These two ODDLY graphics are original direction studies created for this storyboard.',
    motion: 'One or two media pieces slide into alignment as the coral loop turns behind them. A short real creative clip can replace a still. All media settles while the visitor reads the capability list.',
    mobile: 'Show one principal artwork first, followed by a second piece and the six capabilities. Provide explicit video playback controls. Avoid an endless automatic carousel.',
    assets: 'Direction studies are ready, but they are not client campaigns. Needed: final NxOne DC or Marketing & Content pieces before presenting this as evidence of delivered creative work.'
  },
  {
    id: 'more-work', number: '08', name: 'More work: a useful archive', beat: 'Browse / about 1.1 viewports', cls: 'more-work',
    image: `${nav}<p class="scene-label">The project index</p><h2 class="display index-title">More<br>Oddly${dot}</h2><ul class="project-index">${['The Beach Park — Hadsan', 'CasaToon', 'Joyno Accounting', 'JoynoSync', 'Shark’s Tail', 'NxOne DC', 'Marketing & Content'].map((name,i)=>`<li class="${i===0?'active':''}"><span>${String(i+1).padStart(2,'0')}</span>${name}<i>↗</i></li>`).join('')}</ul><img class="web-shot index-preview" src="assets/beach-desktop.webp" alt="Actual Beach Park website preview for the active project"><p class="index-caption">The Beach Park — Hadsan<br>Website / Digital experience / SEO</p>`,
    composition: 'Create one large editorial index with a reserved preview area, rather than seven repeated project cards. All seven project names remain discoverable; Beach Park is the active preview shown here.',
    motion: 'Hover or keyboard focus changes the preview where real media exists. Link activation opens the case study. On touch, an explicit preview control and a separate project link prevent ambiguous tap behaviour.',
    mobile: 'Use a vertical index. The active preview expands inline beneath its project name. Every project remains a normal link; visitors are never required to swipe through hidden work.',
    assets: 'Beach Park preview is available. Other project previews depend on supplied media; show text and categories until then, without invented product interfaces.'
  },
  {
    id: 'about', number: '09', name: 'About: let the page breathe', beat: 'Settle / about 1 viewport', cls: 'about',
    image: `${nav}<p class="scene-label">The studio / Cebu, Philippines</p><h2 class="display about-title">One studio.<br>A shared<br>direction${dot}</h2><p class="about-copy">Based in Cebu. Working across the things your customers see and the systems your team depends on.</p><div class="sculpture-group">${sculpture('knot', 'about-knot')}${sculpture('twist', 'about-twist')}${sculpture('loop', 'about-loop')}</div><div class="about-bottom"><span>Technology / Automation / Creative</span><span>Cebu, Philippines</span></div>`,
    composition: 'Return to a quiet cream composition: concise studio language at left and the three forms gathered at right. Give their scale and depth enough space to read. Use verified location and discipline facts.',
    motion: 'The forms settle into a shared arrangement as the archive leaves. Movement slows to a very small response, allowing a deliberate reading interval before the closing.',
    mobile: 'Place the sculpture group after the studio statement, then the location. Keep a natural reading order. Team imagery can be added later if genuine material is supplied.',
    assets: 'Ready: sculpture family, location, and studio positioning. No invented team portraits, client logos, awards, or metrics.'
  },
  {
    id: 'contact', number: '10', name: 'Contact: resolve the journey', beat: 'Invite / about 1 viewport', cls: 'contact',
    image: `${nav}<p class="scene-label">Have something in mind?</p><h2 class="display contact-title">Let’s make<br>it Oddly${dot}</h2>${sculpture('loop', 'contact-loop')}<span class="contact-action">Start a project <b>↗</b></span><p class="contact-copy">Tell us what you’re building,<br>fixing, or launching.</p><div class="contact-footer"><strong><img src="assets/wordmark-light.svg" alt="ODDLY"></strong><span>Work &nbsp; Services &nbsp; About</span><span>Cebu, Philippines</span></div>`,
    composition: 'End on charcoal with cream typography and a large coral sculpture entering from the right. Place one clear project-start action beneath the heading and a compact footer at the bottom.',
    motion: 'The cream ground gives way to charcoal through one controlled transition. The coral form reaches its final pose and rests; the contact action is immediately available.',
    mobile: 'Reduce the sculpture so it frames the invitation without covering it. Keep the action at least 44px high. All footer links and contact details remain in document flow.',
    assets: 'Ready: brand materials and proposed copy. Required before launch: real studio contact email; the current .example address must not become a working contact action.'
  }
];

document.getElementById('journey').innerHTML = scenes.map(s => `<a href="#${s.id}"><span>${s.number}</span>${s.name.split(':')[0]}</a>`).join('');
document.getElementById('scenes').innerHTML = scenes.map(s => `
  <section class="scene" id="${s.id}" aria-labelledby="title-${s.id}">
    <div class="scene-heading"><div><span class="eyebrow">${s.number} / ${s.beat}</span><h2 id="title-${s.id}">${s.name}</h2></div><a href="#journey" aria-label="Back to scene index">↑</a></div>
    <div class="scene-body"><div class="frame ${s.cls}" aria-label="Proposed ${s.name.toLowerCase()} composition">${s.image}</div>
    <div class="scene-notes"><div><h3>Composition</h3><p>${s.composition}</p></div><div><h3>Transition</h3><p>${s.motion}</p></div><div><h3>Mobile</h3><p>${s.mobile}</p></div><p class="asset-note">${s.assets}</p></div></div>
  </section>`).join('');

const buttons = document.querySelectorAll('[data-view-button]');
buttons.forEach(button => button.addEventListener('click', () => {
  const view = button.dataset.viewButton;
  document.body.dataset.view = view;
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
if (window.innerWidth < 700) document.querySelector('[data-view-button="mobile"]').click();
