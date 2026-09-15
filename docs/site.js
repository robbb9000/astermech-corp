const PACK = {
  landing: { src: "./cinematic/v1/landing.jpg", pos: "center 80%" },
  awaken: { src: "./cinematic/v1/awaken.jpg", pos: "center 40%" },
  hangar: { src: "./cinematic/v1/parts/hangar.jpg", pos: "center center" },
  body: { src: "./cinematic/v1/parts/body.jpg", pos: "center center" },
  build: { src: "./cinematic/v1/build.jpg", pos: "center 30%" },
  activateDark: { src: "./cinematic/v1/activate-dark.jpg", pos: "center 42%" },
  activate: { src: "./cinematic/v1/activate.jpg", pos: "center 42%" },
  launch: { src: "./cinematic/v1/launch.jpg", pos: "center 42%" },
  beyond: { src: "./cinematic/v1/beyond.jpg", pos: "center 50%" },
  arrival: { src: "./cinematic/v1/arrival.jpg", pos: "center 48%" },
  observation: { src: "./cinematic/v1/observation.jpg", pos: "center 50%" },
  vision: { src: "./cinematic/v1/vision.jpg", pos: "center 42%" },
};

const PARTS = [
  { id: "head", src: "./cinematic/v1/parts/head.png", in0: 0.0, in1: 0.08, x: 0, y: -6, r: 0 },
  { id: "torso", src: "./cinematic/v1/parts/torso.png", in0: 0.1, in1: 0.24, x: 0, y: 42, r: 0 },
  { id: "hip", src: "./cinematic/v1/parts/hip.png", in0: 0.2, in1: 0.3, x: 0, y: 28, r: 0 },
  { id: "armUpperL", src: "./cinematic/v1/parts/armUpperL.png", in0: 0.25, in1: 0.36, x: -46, y: -6, r: 22 },
  { id: "armUpperR", src: "./cinematic/v1/parts/armUpperR.png", in0: 0.25, in1: 0.36, x: 46, y: -6, r: -22 },
  { id: "forearmL", src: "./cinematic/v1/parts/forearmL.png", in0: 0.33, in1: 0.42, x: -54, y: 16, r: 18 },
  { id: "forearmR", src: "./cinematic/v1/parts/forearmR.png", in0: 0.33, in1: 0.42, x: 54, y: 16, r: -18 },
  { id: "handL", src: "./cinematic/v1/parts/handL.png", in0: 0.4, in1: 0.5, x: -38, y: 24, r: 12 },
  { id: "handR", src: "./cinematic/v1/parts/handR.png", in0: 0.4, in1: 0.5, x: 38, y: 24, r: -12 },
  { id: "legUpperL", src: "./cinematic/v1/parts/legUpperL.png", in0: 0.5, in1: 0.6, x: -10, y: 38, r: 8 },
  { id: "legUpperR", src: "./cinematic/v1/parts/legUpperR.png", in0: 0.5, in1: 0.6, x: 10, y: 38, r: -8 },
  { id: "legLowerL", src: "./cinematic/v1/parts/legLowerL.png", in0: 0.58, in1: 0.68, x: -8, y: 46, r: 6 },
  { id: "legLowerR", src: "./cinematic/v1/parts/legLowerR.png", in0: 0.58, in1: 0.68, x: 8, y: 46, r: -6 },
  { id: "footL", src: "./cinematic/v1/parts/footL.png", in0: 0.7, in1: 0.8, x: -6, y: 36, r: 0 },
  { id: "footR", src: "./cinematic/v1/parts/footR.png", in0: 0.7, in1: 0.8, x: 6, y: 36, r: 0 },
];

const ASM_COPY = [
  { at: 0, lines: ["IDEAS", "TAKE", "SHAPE"] },
  { at: 0.28, lines: ["PIECE", "BY PIECE"] },
  { at: 0.55, lines: ["BUILT", "WITH PURPOSE"] },
  { at: 0.88, lines: ["READY."] },
];

const COPY = {
  awaken: { lines: ["IDEAS", "TAKE", "SHAPE"] },
  build: { lines: ["FOCUSED.", "PRACTICAL.", "REAL IMPACT."] },
  activate: { lines: ["BUILT FOR", "A BRIGHTER", "TOMORROW"] },
  launch: { lines: ["FROM IDEAS", "TO REALITY"] },
  beyond: { lines: ["A PLATFORM", "FOR", "WHAT'S NEXT"] },
  arrival: { lines: ["NEW IDEAS", "FURTHER"] },
  observation: { lines: ["EXPLORE", "CREATE", "BUILD FURTHER"] },
  vision: { kicker: "OUR VISION", lines: ["PEOPLE.", "TECHNOLOGY.", "A BRIGHTER TOMORROW."] },
};

const BEATS = {
  landing: [-0.02, 0, 0.03, 0.055],
  awaken: [0.03, 0.055, 0.09, 0.12],
  assembly: [0.09, 0.12, 0.52, 0.56],
  build: [0.515, 0.55, 0.60, 0.635],
  activate: [0.61, 0.645, 0.72, 0.755],
  launch: [0.73, 0.765, 0.82, 0.85],
  beyond: [0.825, 0.85, 0.885, 0.91],
  arrival: [0.89, 0.915, 0.94, 0.96],
  observation: [0.94, 0.96, 0.985, 0.995],
  vision: [0.98, 0.992, 1.05, 1.08],
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
  </div>`;
}

function imgEl(id, plate) {
  return `<img data-layer="${id}" src="${plate.src}" alt="" style="object-position:${plate.pos};opacity:0"/>`;
}

function buildFilm() {
  const stage = document.getElementById("stage");
  const layers = ["landing","awaken","build","activate-dark","activate","launch","beyond","arrival","observation","vision"];
  stage.innerHTML =
    layers.map((id) => imgEl(id, PACK[id] || PACK.activate)).join("") +
    `<img data-hangar src="${PACK.hangar.src}" alt="" style="opacity:0"/>
     <div class="assemble-rig" data-rig>
       ${PARTS.map((p) => `<div class="assemble-part" data-part="${p.id}"><img src="${p.src}" alt=""/></div>`).join("")}
       <img data-assembled src="${PACK.body.src}" alt="" style="opacity:0"/>
     </div>
     <div class="vignette"></div>
     <div class="hero" data-copy="landing" id="landingCopy">
       <svg viewBox="0 0 32 32" width="56" height="56" aria-hidden="true">
         <path fill="currentColor" fill-rule="evenodd" d="M16 5 L28 27 H4 Z M16 12.5 L21.2 23 H10.8 Z"/>
       </svg>
       <h1>ASTERMECH CORP</h1>
       <p class="kicker">Independent software studio</p>
     </div>
     <div class="copy" data-asm-copy style="opacity:0">
       <h2 data-asm-lines></h2>
       <span class="rule"></span>
     </div>
     <div class="hint" id="hint">Scroll<b></b></div>
     <ol class="rail">${Object.keys(BEATS).map((id, i) => `<li>${String(i + 1).padStart(2, "0")}</li>`).join("")}</ol>` +
    Object.keys(COPY).map((id) => copyHtml(id)).join("");

  const imgs = Object.fromEntries([...stage.querySelectorAll("img[data-layer]")].map((el) => [el.dataset.layer, el]));
  const copies = Object.fromEntries([...stage.querySelectorAll("[data-copy]")].map((el) => [el.dataset.copy, el]));
  const partEls = Object.fromEntries([...stage.querySelectorAll(".assemble-part")].map((el) => [el.dataset.part, el]));
  const hangar = stage.querySelector("[data-hangar]");
  const assembled = stage.querySelector("[data-assembled]");
  const rig = stage.querySelector("[data-rig]");
  const asmCopy = stage.querySelector("[data-asm-copy]");
  const asmLines = stage.querySelector("[data-asm-lines]");
  const rail = [...stage.querySelectorAll(".rail li")];
  const hint = document.getElementById("hint");
  const track = document.getElementById("track");
  const order = Object.keys(BEATS);

  function setLayer(id, op, y = 0, s = 1) {
    const el = imgs[id];
    if (!el) return;
    el.style.opacity = String(Math.max(0, Math.min(1, op)));
    el.style.transform = `translate3d(0, ${y}%, 0) scale(${s})`;
  }

  function paint() {
    const total = track.offsetHeight - innerHeight;
    const p = total <= 0 ? 0 : clamp01(-track.getBoundingClientRect().top / total);
    const beat = (id) => hold(p, ...BEATS[id]);
    const land = beat("landing");
    setLayer("landing", land, -land * 2, 1 + land * 0.04);
    setLayer("awaken", beat("awaken"));

    const assemblyOp = beat("assembly");
    const t = remap(p, BEATS.assembly[0], BEATS.assembly[2]);
    hangar.style.opacity = String(assemblyOp);
    rig.style.opacity = assemblyOp > 0.01 ? "1" : "0";
    const camS = 1.52 - 0.52 * smooth(0.05, 0.92, t);
    const camY = (1 - smooth(0, 0.88, t)) * 16;
    rig.style.transform = `translate3d(0, ${camY}%, 0) scale(${camS})`;
    assembled.style.opacity = String(assemblyOp * smooth(0.8, 0.93, t));
    PARTS.forEach((def) => {
      const k = smooth(def.in0, def.in1, t);
      const op = (def.id === "head" ? 1 : t >= def.in0 - 0.02 ? k : 0) * assemblyOp;
      const el = partEls[def.id];
      el.style.opacity = String(op);
      el.style.transform = `translate3d(${def.x * (1 - k)}%, ${def.y * (1 - k)}%, 0) rotate(${def.r * (1 - k)}deg)`;
    });
    let lines = ASM_COPY[0].lines;
    ASM_COPY.forEach((c) => { if (t >= c.at) lines = c.lines; });
    asmLines.innerHTML = lines.map((l) => `<span>${l}</span><br/>`).join("");
    asmCopy.style.opacity = String(assemblyOp);

    setLayer("build", beat("build"));
    const act = beat("activate");
    const eyes = smooth(0.28, 0.62, remap(p, BEATS.activate[0], BEATS.activate[3]));
    setLayer("activate-dark", act * (1 - eyes));
    setLayer("activate", act * eyes);
    const launchT = remap(p, BEATS.launch[0], BEATS.launch[3]);
    setLayer("launch", beat("launch"), -launchT * 6, 1 + launchT * 0.08);
    setLayer("beyond", beat("beyond"));
    setLayer("arrival", beat("arrival"));
    setLayer("observation", beat("observation"));
    setLayer("vision", beat("vision"));

    copies.landing.style.opacity = String(land);
    hint.style.opacity = String(land);
    Object.keys(COPY).forEach((id) => {
      if (copies[id]) copies[id].style.opacity = String(beat(id));
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
document.querySelectorAll("[data-go]").forEach((btn) => btn.addEventListener("click", () => go(btn.dataset.go)));
document.getElementById("menuBtn").addEventListener("click", () => {
  const menu = document.getElementById("menu");
  menu.hidden = !menu.hidden;
});
document.getElementById("deskFilm").hidden = false;
document.getElementById("phoneFilm").hidden = true;
buildFilm();
