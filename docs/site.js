const PACK = {
  landing: { src: "./cinematic/v1/landing.jpg", pos: "center 80%" },
  awaken: { src: "./cinematic/v1/awaken.jpg", pos: "center 40%" },
  hangar: { src: "./cinematic/v1/hangar.jpg", pos: "center 42%" },
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
  arrival: { lines: ["NEW IDEAS", "FURTHER"] },
  observation: { lines: ["EXPLORE", "CREATE", "BUILD FURTHER"] },
  vision: {
    kicker: "OUR VISION",
    lines: ["PEOPLE.", "TECHNOLOGY.", "A BRIGHTER TOMORROW."],
  },
};

const BEATS = {
  landing: [-0.02, 0, 0.03, 0.06],
  awaken: [0.035, 0.065, 0.11, 0.145],
  assembly: [0.11, 0.145, 0.50, 0.545],
  build: [0.515, 0.55, 0.60, 0.635],
  activate: [0.61, 0.645, 0.72, 0.755],
  launch: [0.73, 0.765, 0.82, 0.85],
  beyond: [0.825, 0.85, 0.885, 0.91],
  arrival: [0.89, 0.915, 0.94, 0.96],
  observation: [0.94, 0.96, 0.985, 0.995],
  vision: [0.98, 0.992, 1.05, 1.08],
};

function clamp01(n) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
function remap(v, a, b) {
  return b === a ? 0 : clamp01((v - a) / (b - a));
}
function smooth(e0, e1, x) {
  const t = remap(x, e0, e1);
  return t * t * (3 - 2 * t);
}
function hold(p, a, b, c, d) {
  if (p <= a || p >= d) return 0;
  if (p < b) return smooth(a, b, p);
  if (p > c) return 1 - smooth(c, d, p);
  return 1;
}
function enter(t, start, dur) {
  return smooth(start, start + dur, t);
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
  const layers = [
    ["landing", PACK.landing],
    ["awaken", PACK.awaken],
    ["build", PACK.build],
    ["activate-dark", PACK.activateDark],
    ["activate", PACK.activate],
    ["launch", PACK.launch],
    ["beyond", PACK.beyond],
    ["arrival", PACK.arrival],
    ["observation", PACK.observation],
    ["vision", PACK.vision],
  ];
  const partIds = ["head", "chest", "armL", "armR", "legs"];
  stage.innerHTML =
    layers.map(([id, plate]) => imgEl(id, plate)).join("") +
    `<img data-hangar src="${PACK.hangar.src}" alt="" style="object-position:${PACK.hangar.pos};opacity:0"/>` +
    partIds
      .map(
        (id) =>
          `<div class="assemble-part" data-part="${id}">
            <img src="${PACK.activate.src}" alt="" style="object-position:${PACK.activate.pos}"/>
          </div>`,
      )
      .join("") +
    `<img data-assembled src="${PACK.activate.src}" alt="" style="object-position:${PACK.activate.pos};opacity:0"/>
     <div class="vignette"></div>
     <div class="hero" data-copy="landing" id="landingCopy">
       <svg viewBox="0 0 32 32" width="56" height="56" aria-hidden="true">
         <path fill="currentColor" fill-rule="evenodd" d="M16 5 L28 27 H4 Z M16 12.5 L21.2 23 H10.8 Z"/>
       </svg>
       <h1>ASTERMECH CORP</h1>
       <p class="kicker">Independent software studio</p>
     </div>
     <div class="hint" id="hint">Scroll<b></b></div>
     <ol class="rail">${Object.keys(BEATS)
       .map((id, i) => `<li data-i="${i}">${String(i + 1).padStart(2, "0")}</li>`)
       .join("")}</ol>` +
    Object.keys(COPY)
      .map((id) => copyHtml(id))
      .join("");

  const imgs = Object.fromEntries(
    [...stage.querySelectorAll("img[data-layer]")].map((el) => [el.dataset.layer, el]),
  );
  const copies = Object.fromEntries(
    [...stage.querySelectorAll("[data-copy]")].map((el) => [el.dataset.copy, el]),
  );
  const parts = Object.fromEntries(
    [...stage.querySelectorAll(".assemble-part")].map((el) => [el.dataset.part, el]),
  );
  const hangar = stage.querySelector("[data-hangar]");
  const assembled = stage.querySelector("[data-assembled]");
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
    const head = enter(t, 0.0, 0.16);
    const chest = enter(t, 0.14, 0.16);
    const arms = enter(t, 0.32, 0.18);
    const legs = enter(t, 0.52, 0.2);
    const locked = smooth(0.78, 0.96, t) * assemblyOp;
    hangar.style.opacity = String(assemblyOp * (1 - locked * 0.35));
    assembled.style.opacity = String(locked);
    const applyPart = (id, op, x, y, s) => {
      const el = parts[id];
      el.style.opacity = String(op * assemblyOp);
      el.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${s})`;
    };
    applyPart("head", head, 0, (1 - head) * -34, 1);
    applyPart("chest", chest, 0, (1 - chest) * 16, 0.84 + 0.16 * chest);
    applyPart("armL", arms, (1 - arms) * -48, 0, 1);
    applyPart("armR", arms, (1 - arms) * 48, 0, 1);
    applyPart("legs", legs, 0, (1 - legs) * 36, 1);

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
      copies[id].style.opacity = String(beat(id));
    });
    let railIndex = 0;
    order.forEach((id, i) => {
      if (p >= BEATS[id][0]) railIndex = i;
    });
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

document.getElementById("deskFilm").hidden = false;
document.getElementById("phoneFilm").hidden = true;
buildFilm();
