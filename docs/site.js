const PACK = {
  build: { src: "./cinematic/v1/build.jpg", pos: "center 30%" },
  activateDark: { src: "./cinematic/v1/activate-dark.jpg", pos: "center 42%" },
  activate: { src: "./cinematic/v1/activate.jpg", pos: "center 42%" },
  launch: { src: "./cinematic/v1/launch.jpg", pos: "center 42%" },
  beyond: { src: "./cinematic/v1/beyond.jpg", pos: "center 50%" },
  arrival: { src: "./cinematic/v1/arrival.jpg", pos: "center 48%" },
  observation: { src: "./cinematic/v1/observation.jpg", pos: "center 50%" },
  vision: { src: "./cinematic/v1/vision.jpg", pos: "center 42%" },
};

const SPRITES = [
  { id: "head", src: "./cinematic/v1/sprites/head.png", l: 26, t: 0, w: 48, h: 17, o: "50% 100%", in0: 0, in1: 0.06, x: 0, y: -12, r: 0, z: 8 },
  { id: "visor", src: "./cinematic/v1/sprites/visor.png", l: 38, t: 8, w: 24, h: 4, o: "50% 50%", in0: 0.88, in1: 0.97, x: 0, y: 0, r: 0, z: 9 },
  { id: "torso", src: "./cinematic/v1/sprites/torso.png", l: 20, t: 15, w: 60, h: 20, o: "50% 0%", in0: 0.08, in1: 0.22, x: 0, y: 58, r: 0, z: 5 },
  { id: "hip", src: "./cinematic/v1/sprites/hip.png", l: 30, t: 33, w: 40, h: 10, o: "50% 0%", in0: 0.18, in1: 0.28, x: 0, y: 42, r: 0, z: 4 },
  { id: "armUpperL", src: "./cinematic/v1/sprites/armUpperL.png", l: -4, t: 16, w: 30, h: 18, o: "88% 12%", in0: 0.26, in1: 0.38, x: -70, y: -8, r: 28, z: 6 },
  { id: "armUpperR", src: "./cinematic/v1/sprites/armUpperR.png", l: 74, t: 16, w: 30, h: 18, o: "12% 12%", in0: 0.26, in1: 0.38, x: 70, y: -8, r: -28, z: 6 },
  { id: "forearmL", src: "./cinematic/v1/sprites/forearmL.png", l: -8, t: 32, w: 26, h: 16, o: "80% 8%", in0: 0.36, in1: 0.46, x: -78, y: 18, r: 18, z: 6 },
  { id: "forearmR", src: "./cinematic/v1/sprites/forearmR.png", l: 82, t: 32, w: 26, h: 16, o: "20% 8%", in0: 0.36, in1: 0.46, x: 78, y: 18, r: -18, z: 6 },
  { id: "handL", src: "./cinematic/v1/sprites/handL.png", l: -6, t: 46, w: 22, h: 12, o: "80% 0%", in0: 0.44, in1: 0.54, x: -62, y: 28, r: 10, z: 7 },
  { id: "handR", src: "./cinematic/v1/sprites/handR.png", l: 84, t: 46, w: 22, h: 12, o: "20% 0%", in0: 0.44, in1: 0.54, x: 62, y: 28, r: -10, z: 7 },
  { id: "legUpperL", src: "./cinematic/v1/sprites/legUpperL.png", l: 26, t: 41, w: 22, h: 17, o: "50% 0%", in0: 0.52, in1: 0.64, x: -10, y: 55, r: 8, z: 3 },
  { id: "legUpperR", src: "./cinematic/v1/sprites/legUpperR.png", l: 52, t: 41, w: 22, h: 17, o: "50% 0%", in0: 0.52, in1: 0.64, x: 10, y: 55, r: -8, z: 3 },
  { id: "legLowerL", src: "./cinematic/v1/sprites/legLowerL.png", l: 27, t: 56, w: 20, h: 17, o: "50% 0%", in0: 0.62, in1: 0.72, x: -6, y: 62, r: 6, z: 2 },
  { id: "legLowerR", src: "./cinematic/v1/sprites/legLowerR.png", l: 53, t: 56, w: 20, h: 17, o: "50% 0%", in0: 0.62, in1: 0.72, x: 6, y: 62, r: -6, z: 2 },
  { id: "footL", src: "./cinematic/v1/sprites/footL.png", l: 25, t: 72, w: 24, h: 12, o: "50% 0%", in0: 0.7, in1: 0.8, x: -4, y: 48, r: 0, z: 1 },
  { id: "footR", src: "./cinematic/v1/sprites/footR.png", l: 51, t: 72, w: 24, h: 12, o: "50% 0%", in0: 0.7, in1: 0.8, x: 4, y: 48, r: 0, z: 1 },
];

const COPY = {
  build: { lines: ["FOCUSED.", "PRACTICAL.", "REAL IMPACT."] },
  activate: { lines: ["BUILT FOR", "A BRIGHTER", "TOMORROW"] },
  launch: { lines: ["FROM IDEAS", "TO REALITY"] },
  beyond: { lines: ["A PLATFORM", "FOR", "WHAT'S NEXT"] },
  arrival: { lines: ["NEW IDEAS", "FURTHER"] },
  observation: { lines: ["EXPLORE", "CREATE", "BUILD FURTHER"] },
  vision: { kicker: "OUR VISION", lines: ["PEOPLE.", "TECHNOLOGY.", "A BRIGHTER TOMORROW."] },
};

const BEATS = {
  build: [-0.02, 0, 0.12, 0.16],
  activate: [0.12, 0.16, 0.32, 0.37],
  launch: [0.33, 0.38, 0.52, 0.57],
  beyond: [0.53, 0.57, 0.68, 0.73],
  arrival: [0.69, 0.74, 0.82, 0.86],
  observation: [0.83, 0.87, 0.93, 0.96],
  vision: [0.94, 0.97, 1.05, 1.08],
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

function buildAssembly() {
  const rig = document.getElementById("rig");
  rig.innerHTML =
    SPRITES.map(
      (s) =>
        `<div class="assembly-sprite" data-part="${s.id}" style="left:${s.l}%;top:${s.t}%;width:${s.w}%;height:${s.h}%;z-index:${s.z};transform-origin:${s.o};opacity:${s.id === "head" ? 1 : 0}">
          <img src="${s.src}" alt=""/>
        </div>`,
    ).join("") + `<div class="assembly-eyes" data-eyes></div>`;
  const els = Object.fromEntries([...rig.querySelectorAll("[data-part]")].map((el) => [el.dataset.part, el]));
  const eyes = rig.querySelector("[data-eyes]");
  const track = document.getElementById("assembly");
  function paint() {
    const total = track.offsetHeight - innerHeight;
    const t = total <= 0 ? 0 : clamp01(-track.getBoundingClientRect().top / total);
    const camS = 2.05 - 1.05 * smooth(0.02, 0.82, t);
    const camY = (1 - smooth(0, 0.8, t)) * 18;
    rig.style.transform = `translate3d(-50%, ${camY}%, 0) scale(${camS})`;
    SPRITES.forEach((def) => {
      const k = smooth(def.in0, def.in1, t);
      const started = t >= def.in0;
      let op = 0;
      if (def.id === "head") op = 1;
      else if (def.id === "visor") op = k;
      else if (started) op = 1;
      const el = els[def.id];
      el.style.opacity = String(op);
      el.style.transform = `translate3d(${def.x * (1 - k)}%, ${def.y * (1 - k)}%, 0) rotate(${def.r * (1 - k)}deg)`;
    });
    eyes.style.opacity = String(smooth(0.88, 0.97, t));
  }
  addEventListener("scroll", () => requestAnimationFrame(paint), { passive: true });
  addEventListener("resize", paint);
  paint();
}

function buildFilm() {
  const stage = document.getElementById("stage");
  const layers = ["build", "activateDark", "activate", "launch", "beyond", "arrival", "observation", "vision"];
  stage.innerHTML =
    layers
      .map((id) => {
        const plate = PACK[id] || PACK.activate;
        const key = id === "activateDark" ? "activate-dark" : id;
        return `<img data-layer="${key}" src="${plate.src}" alt="" style="object-position:${plate.pos};opacity:0"/>`;
      })
      .join("") +
    `<div class="vignette"></div>
     <ol class="rail">${Object.keys(BEATS).map((id, i) => `<li>${String(i + 1).padStart(2, "0")}</li>`).join("")}</ol>` +
    Object.keys(COPY).map((id) => copyHtml(id)).join("");

  const imgs = Object.fromEntries([...stage.querySelectorAll("img[data-layer]")].map((el) => [el.dataset.layer, el]));
  const copies = Object.fromEntries([...stage.querySelectorAll("[data-copy]")].map((el) => [el.dataset.copy, el]));
  const rail = [...stage.querySelectorAll(".rail li")];
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
    setLayer("build", beat("build"));
    const act = beat("activate");
    const eyes = smooth(0.2, 0.55, remap(p, BEATS.activate[0], BEATS.activate[3]));
    setLayer("activate-dark", act * (1 - eyes));
    setLayer("activate", act * eyes);
    const launchT = remap(p, BEATS.launch[0], BEATS.launch[3]);
    setLayer("launch", beat("launch"), -launchT * 6, 1 + launchT * 0.08);
    setLayer("beyond", beat("beyond"));
    setLayer("arrival", beat("arrival"));
    setLayer("observation", beat("observation"));
    setLayer("vision", beat("vision"));
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

buildAssembly();
buildFilm();
