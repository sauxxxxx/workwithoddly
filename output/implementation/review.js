const frames = [
  [
    "hero",
    "01 / The approved opening",
    "Original material and type foundation",
  ],
  ["studio", "02 / The studio close-up", "The coral form moves closer"],
  [
    "work",
    "03 / The Beach Park",
    "Actual website interface and responsive capture",
  ],
  ["detail", "04 / A closer look", "Website recording and mobile experience"],
  ["technology", "05 / Technology", "Sage sculpture and five capabilities"],
  [
    "automation",
    "06 / Automation",
    "Lavender sculpture and illustrative workflow",
  ],
  ["creative", "07 / Creative", "Original ODDLY studies and six capabilities"],
  ["more-work", "08 / More Oddly", "Seven projects with interactive previews"],
  ["about", "09 / A shared direction", "The sculpture family reunites"],
  ["contact", "10 / Let’s make it Oddly", "A clear project invitation"],
];
const list = document.getElementById("frame-list");
function render(mode) {
  document.body.dataset.mode = mode;
  list.replaceChildren(
    ...frames.map(([id, title, note]) => {
      const figure = document.createElement("figure"),
        caption = document.createElement("figcaption"),
        image = document.createElement("img");
      caption.append(document.createTextNode(title));
      const context = document.createElement("span");
      context.textContent = note;
      caption.append(context);
      image.src = `${mode}-${id}.webp`;
      image.alt = `${title}: actual ${mode} browser capture`;
      image.width = mode === "desktop" ? 1440 : 390;
      image.height = mode === "desktop" ? 900 : 844;
      image.loading = "lazy";
      figure.append(caption, image);
      return figure;
    }),
  );
  document.querySelectorAll("[data-mode]").forEach((button) => {
    if (button.tagName === "BUTTON")
      button.setAttribute("aria-pressed", String(button.dataset.mode === mode));
  });
}
document
  .querySelectorAll("button[data-mode]")
  .forEach((button) =>
    button.addEventListener("click", () => render(button.dataset.mode)),
  );
render("desktop");
