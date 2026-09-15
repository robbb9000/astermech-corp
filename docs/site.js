const FRAME_COUNT = 108;
const frameSrc = (i) =>
  `./cinematic/v1/seq/frame_${String(Math.max(0, Math.min(FRAME_COUNT - 1, i))).padStart(3, "0")}.jpg`;

function clamp01(n) { return n < 0 ? 0 : n > 1 ? 1 : n; }
function remap(v, a, b) { return b === a ? 0 : clamp01((v - a) / (b - a)); }
function smooth(e0, e1, x) { const t = remap(x, e0, e1); return t * t * (3 - 2 * t); }
function hold(p, a, b, c, d) {
  if (p <= a || p >= d) return 0;
  if (p < b) return smooth(a, b, p);
  if (p > c) return 1 - smooth(c, d, p);
  return 1;
}

function buildAssembly() {
  const canvas = document.getElementById("seqCanvas");
  const track = document.getElementById("assembly");
  const ctx = canvas.getContext("2d");
  const bitmaps = new Map();
  const loading = new Set();
  let current = 0;
  let target = 0;
  let drawn = -1;
  const WINDOW = 10;

  function load(index) {
    const i = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    if (bitmaps.has(i) || loading.has(i)) return;
    loading.add(i);
    fetch(frameSrc(i))
      .then((r) => r.blob())
      .then((b) => createImageBitmap(b))
      .then((bmp) => {
        bitmaps.set(i, bmp);
        loading.delete(i);
      })
      .catch(() => loading.delete(i));
  }

  function prune(center) {
    for (const [k, bmp] of bitmaps) {
      if (Math.abs(k - center) > WINDOW) {
        bmp.close();
        bitmaps.delete(k);
      }
    }
  }

  function nearest(want) {
    if (bitmaps.has(want)) return want;
    let best = -1, dist = 999;
    for (const k of bitmaps.keys()) {
      const d = Math.abs(k - want);
      if (d < dist) { dist = d; best = k; }
    }
    return best;
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = innerWidth, h = innerHeight;
    const maxW = w <= 800 ? 960 : 1280;
    const scale = Math.min(1, maxW / Math.max(1, w));
    canvas.width = Math.round(w * dpr * scale);
    canvas.height = Math.round(h * dpr * scale);
    drawn = -1;
  }

  function draw(bmp) {
    const cw = canvas.width, ch = canvas.height;
    const ir = bmp.width / bmp.height, cr = cw / ch;
    let dw = cw, dh = ch;
    if (cr > ir) dh = cw / ir;
    else dw = ch * ir;
    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function tick() {
    const total = track.offsetHeight - innerHeight;
    const t = total <= 0 ? 0 : clamp01(-track.getBoundingClientRect().top / total);
    target = t * (FRAME_COUNT - 1);
    current += (target - current) * 0.22;
    if (Math.abs(target - current) < 0.02) current = target;
    const want = Math.round(current);
    for (let i = want - 4; i <= want + 6; i++) load(i);
    prune(want);
    const have = nearest(want);
    if (have >= 0 && have !== drawn) {
      draw(bitmaps.get(have));
      drawn = have;
    }
    requestAnimationFrame(tick);
  }

  resize();
  for (let i = 0; i < 12; i++) load(i);
  addEventListener("resize", resize);
  requestAnimationFrame(tick);
}

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

function copyHtml(id) {
  const c = COPY[id];
  if (!c) return "";
  return `<div class="copy" data-copy="${id}">
    ${c.kicker ? `<p class="kicker">${c.kicker}</p>` : ""}
    <h2>${c.lines.map((l) => `<span>${l}</span><br/>`).join("")}</h2>
    <span class="rule"></span>
  </div>`;
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
