const PACK = {
  landing: { src: "./cinematic/v1/landing.jpg", pos: "center 80%" },
  awaken: { src: "./cinematic/v1/awaken.jpg", pos: "center 40%" },
  a1: { src: "./cinematic/v1/assembly-01.jpg", pos: "center 42%" },
  a2: { src: "./cinematic/v1/assembly-02.jpg", pos: "center 38%" },
  a3: { src: "./cinematic/v1/assembly-03.jpg", pos: "center 42%" },
  a4: { src: "./cinematic/v1/assembly-04.jpg", pos: "center 42%" },
  build: { src: "./cinematic/v1/build.jpg", pos: "center 30%" },
  activateDark: { src: "./cinematic/v1/activate-dark.jpg", pos: "center 42%" },
  activate: { src: "./cinematic/v1/activate.jpg", pos: "center 42%" },
  launch: { src: "./cinematic/v1/launch.jpg", pos: "center 42%" },
  beyond: { src: "./cinematic/v1/beyond.jpg", pos: "center 50%" },
  arrival: { src: "./cinematic/v1/arrival.jpg", pos: "center 48%" },
  observation: { src: "./cinematic/v1/observation.jpg", pos: "center 50%" },
  vision: { src: "./cinematic/v1/vision.jpg", pos: "center 42%" },
};

const COPY = {
  awaken: { lines: ["IDEAS", "TAKE", "SHAPE"] },
  assembly: { lines: ["SMALL PIECES", "BIG", "POSSIBILITIES"] },
  build: { lines: ["FOCUSED.", "PRACTICAL.", "REAL IMPACT."] },
  activate: { lines: ["BUILT FOR", "A BRIGHTER", "TOMORROW"] },
  launch: { lines: ["FROM IDEAS", "TO REALITY"] },
  beyond: { lines: ["A PLATFORM", "FOR", "WHAT'S NEXT"] },
  arrival: { lines: ["NEW IDEAS", "GO FURTHER"] },
  observation: { lines: ["LOOKING", "FORWARD"] },
  vision: {
    kicker: "OUR VISION",
    lines: ["SMALL TEAM.", "FOCUSED PRODUCTS.", "BIG IDEAS."],
    body: "AsterMech Corp is an independent technology company focused on creating simple, useful digital products.",
  },
};

const BEATS = {
  landing: [ -0.02, 0, 0.04, 0.08 ],
  awaken: [ 0.045, 0.085, 0.13, 0.17 ],
  assembly: [ 0.13, 0.17, 0.34, 0.385 ],
  build: [ 0.345, 0.385, 0.445, 0.485 ],
  activate: [ 0.45, 0.49, 0.58, 0.62 ],
  launch: [ 0.585, 0.625, 0.69, 0.73 ],
  beyond: [ 0.695, 0.735, 0.79, 0.825 ],
  arrival: [ 0.795, 0.83, 0.875, 0.905 ],
  observation: [ 0.88, 0.91, 0.955, 0.98 ],
  vision: [ 0.95, 0.978, 1.05, 1.08 ],
};

function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }
function remap(v, a, b) { return b === a ? 0 : clamp01((v - a) / (b - a)); }
function smooth(e0, e1, x) { const t = remap(x, e0, e1); return t * t * (3 - 2 * t); }
function hold(p, a, b, c, d) {
  if (p <= a || p >= d) return 0;
  if (p < b) return smooth(a, b, p);
  if (p > c) return 1 - smooth(c, d, p);
  return 1;
}

function copyHtml(id) {
  const c = COPY[id];
  if (!c) return "";
  return `<div class="copy" data-copy="${id}">
    ${c.kicker ? `<p class="kicker">${c.kicker}</p>` : ""}
    <h2>${c.lines.map((l) => `<span>${l}</span><br/>`).join("")}</h2>
    <span class="rule"></span>
    ${c.body ? `<p class="body">${c.body}</p>` : ""}
  </div>`;
}

function imgEl(id, plate, extra = "") {
  return `<img data-layer="${id}" src="${plate.src}" alt="" style="object-position:${plate.pos}" ${extra}/>`;
}

function buildPhone() {
  const root = document.getElementById("phoneFilm");
  const panels = [
    { id: "awaken", plate: PACK.awaken, copy: "awaken" },
    { id: "assembly-start", plate: PACK.a1 },
    { id: "assembly", plate: PACK.a2, copy: "assembly" },
    { id: "activate", plate: PACK.activate, copy: "activate" },
    { id: "build", plate: PACK.build, copy: "build" },
    { id: "launch", plate: PACK.launch, copy: "launch" },
    { id: "observation", plate: PACK.observation, copy: "observation" },
    { id: "vision", plate: PACK.vision, copy: "vision" },
  ];
  root.innerHTML =
    `<section class="film is-in">
      ${imgEl("landing", PACK.landing, 'class="ken"')}
      <div class="vignette"></div>
      <div class="hero">
        <svg viewBox="0 0 32 32" width="48" height="48" aria-hidden="true">
          <path fill="currentColor" fill-rule="evenodd" d="M16 5 L28 27 H4 Z M16 12.5 L21.2 23 H10.8 Z"/>
        </svg>
        <h1>ASTERMECH CORP</h1>
        <p class="kicker">Independent software studio</p>
      </div>
      <div class="hint">Scroll<b></b></div>
    </section>` +
    panels
      .map(
        (p) =>
          `<section class="film" id="${p.id}">
            ${imgEl(p.id, p.plate)}
            <div class="vignette"></div>
            ${p.copy ? copyHtml(p.copy) : ""}
          </section>`,
      )
      .join("");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          const img = e.target.querySelector("img");
          if (img) img.classList.add("ken");
        }
      });
    },
    { threshold: 0.28 },
  );
  root.querySelectorAll(".film").forEach((el) => io.observe(el));
}

function buildDesk() {
  const stage = document.getElementById("stage");
  const layers = [
    ["landing", PACK.landing],
    ["awaken", PACK.awaken],
    ["assembly-0", PACK.a1],
    ["assembly-1", PACK.a2],
    ["assembly-2", PACK.a3],
    ["assembly-3", PACK.a4],
    ["build", PACK.build],
    ["activate-dark", PACK.activateDark],
    ["activate", PACK.activate],
    ["launch", PACK.launch],
    ["beyond", PACK.beyond],
    ["arrival", PACK.arrival],
    ["observation", PACK.observation],
    ["vision", PACK.vision],
  ];
  stage.innerHTML =
    layers.map(([id, plate]) => imgEl(id, plate)).join("") +
    `<div class="vignette"></div>
     <div class="hero" data-copy="landing" id="landingCopy">
       <svg viewBox="0 0 32 32" width="56" height="56" aria-hidden="true">
         <path fill="currentColor" fill-rule="evenodd" d="M16 5 L28 27 H4 Z M16 12.5 L21.2 23 H10.8 Z"/>
       </svg>
       <h2 style="font-family:var(--display);letter-spacing:.42em;text-transform:none;font-weight:500">ASTERMECH CORP</h2>
       <p class="kicker">Independent software studio</p>
     </div>
     <div class="hint" id="hint">Scroll<b></b></div>
     <ol class="rail" id="rail">${Object.keys(BEATS).map((id, i) => `<li data-i="${i}">${String(i + 1).padStart(2, "0")}</li>`).join("")}</ol>` +
    Object.keys(COPY).map((id) => copyHtml(id)).join("");

  const imgs = Object.fromEntries(
    [...stage.querySelectorAll("img[data-layer]")].map((el) => [el.dataset.layer, el]),
  );
  const copies = Object.fromEntries(
    [...stage.querySelectorAll("[data-copy]")].map((el) => [el.dataset.copy, el]),
  );
  const rail = [...stage.querySelectorAll(".rail li")];
  const hint = document.getElementById("hint");
  const track = document.getElementById("track");
  const order = Object.keys(BEATS);

  function paint() {
    const total = track.offsetHeight - innerHeight;
    const p = total <= 0 ? 0 : clamp01(-track.getBoundingClientRect().top / total);
    const set = (id, op, y = 0, s = 1) => {
      const el = imgs[id];
      if (!el) return;
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translate3d(0, ${y}%, 0) scale(${s})`;
    };
    const beat = (id) => hold(p, ...BEATS[id]);
    const land = beat("landing");
    set("landing", land, -land * 2, 1 + land * 0.04);
    set("awaken", beat("awaken"));
    const a = remap(p, 0.13, 0.34);
    set("assembly-0", hold(p, 0.13, 0.17, 0.18, 0.22) * (1 - a));
    set("assembly-1", hold(p, 0.18, 0.22, 0.24, 0.28));
    set("assembly-2", hold(p, 0.24, 0.28, 0.3, 0.34));
    set("assembly-3", hold(p, 0.3, 0.34, 0.34, 0.385));
    set("build", beat("build"));
    const act = beat("activate");
    set("activate-dark", act * (1 - remap(p, 0.5, 0.54)));
    set("activate", act * remap(p, 0.5, 0.54));
    set("launch", beat("launch"), -remap(p, 0.585, 0.73) * 4, 1.02);
    set("beyond", beat("beyond"));
    set("arrival", beat("arrival"));
    set("observation", beat("observation"));
    set("vision", beat("vision"));
    copies.landing.style.opacity = land.toFixed(3);
    hint.style.opacity = land.toFixed(3);
    Object.keys(COPY).forEach((id) => {
      copies[id].style.opacity = beat(id).toFixed(3);
    });
    let railIndex = 0;
    order.forEach((id, i) => { if (p >= BEATS[id][0]) railIndex = i; });
    rail.forEach((el, i) => el.classList.toggle("on", i === railIndex));
    document.getElementById("mark").classList.toggle("is-on", scrollY > 80);
  }

  addEventListener("scroll", () => requestAnimationFrame(paint), { passive: true });
  addEventListener("resize", paint);
  paint();
}

function go(target) {
  document.getElementById("menu").hidden = true;
  const el = document.getElementById(target);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll("[data-go]").forEach((btn) => {
  btn.addEventListener("click", () => go(btn.dataset.go));
});
document.getElementById("menuBtn").addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.hidden = !menu.hidden;
});

const desktop = matchMedia("(min-width: 768px)").matches;
if (desktop) {
  document.getElementById("deskFilm").hidden = false;
  document.getElementById("phoneFilm").hidden = true;
  buildDesk();
} else {
  buildPhone();
  document.getElementById("mark").classList.add("is-on");
}
