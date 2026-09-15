export const ASSEMBLY_VH = 720;

export type PartId =
  | "head"
  | "torso"
  | "hip"
  | "armUpperL"
  | "armUpperR"
  | "forearmL"
  | "forearmR"
  | "handL"
  | "handR"
  | "legUpperL"
  | "legUpperR"
  | "legLowerL"
  | "legLowerR"
  | "footL"
  | "footR"
  | "visor";

export type SpriteDef = {
  id: PartId;
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  origin: string;
  in0: number;
  in1: number;
  fromX: number;
  fromY: number;
  fromR: number;
  z: number;
};

const bust = "v9";
const S = (name: string) => `/cinematic/v1/sprites/${name}.png?${bust}`;

export const HANGAR_SRC = `/cinematic/v1/sprites/hangar.jpg?${bust}`;

export const SPRITES: SpriteDef[] = [
  { id: "head", src: S("head"), left: 26, top: 0, width: 48, height: 17, origin: "50% 100%", in0: 0, in1: 0.06, fromX: 0, fromY: -12, fromR: 0, z: 8 },
  { id: "visor", src: S("visor"), left: 38, top: 8, width: 24, height: 4, origin: "50% 50%", in0: 0.88, in1: 0.97, fromX: 0, fromY: 0, fromR: 0, z: 9 },
  { id: "torso", src: S("torso"), left: 20, top: 15, width: 60, height: 20, origin: "50% 0%", in0: 0.08, in1: 0.22, fromX: 0, fromY: 58, fromR: 0, z: 5 },
  { id: "hip", src: S("hip"), left: 30, top: 33, width: 40, height: 10, origin: "50% 0%", in0: 0.18, in1: 0.28, fromX: 0, fromY: 42, fromR: 0, z: 4 },
  { id: "armUpperL", src: S("armUpperL"), left: -4, top: 16, width: 30, height: 18, origin: "88% 12%", in0: 0.26, in1: 0.38, fromX: -70, fromY: -8, fromR: 28, z: 6 },
  { id: "armUpperR", src: S("armUpperR"), left: 74, top: 16, width: 30, height: 18, origin: "12% 12%", in0: 0.26, in1: 0.38, fromX: 70, fromY: -8, fromR: -28, z: 6 },
  { id: "forearmL", src: S("forearmL"), left: -8, top: 32, width: 26, height: 16, origin: "80% 8%", in0: 0.36, in1: 0.46, fromX: -78, fromY: 18, fromR: 18, z: 6 },
  { id: "forearmR", src: S("forearmR"), left: 82, top: 32, width: 26, height: 16, origin: "20% 8%", in0: 0.36, in1: 0.46, fromX: 78, fromY: 18, fromR: -18, z: 6 },
  { id: "handL", src: S("handL"), left: -6, top: 46, width: 22, height: 12, origin: "80% 0%", in0: 0.44, in1: 0.54, fromX: -62, fromY: 28, fromR: 10, z: 7 },
  { id: "handR", src: S("handR"), left: 84, top: 46, width: 22, height: 12, origin: "20% 0%", in0: 0.44, in1: 0.54, fromX: 62, fromY: 28, fromR: -10, z: 7 },
  { id: "legUpperL", src: S("legUpperL"), left: 26, top: 41, width: 22, height: 17, origin: "50% 0%", in0: 0.52, in1: 0.64, fromX: -10, fromY: 55, fromR: 8, z: 3 },
  { id: "legUpperR", src: S("legUpperR"), left: 52, top: 41, width: 22, height: 17, origin: "50% 0%", in0: 0.52, in1: 0.64, fromX: 10, fromY: 55, fromR: -8, z: 3 },
  { id: "legLowerL", src: S("legLowerL"), left: 27, top: 56, width: 20, height: 17, origin: "50% 0%", in0: 0.62, in1: 0.72, fromX: -6, fromY: 62, fromR: 6, z: 2 },
  { id: "legLowerR", src: S("legLowerR"), left: 53, top: 56, width: 20, height: 17, origin: "50% 0%", in0: 0.62, in1: 0.72, fromX: 6, fromY: 62, fromR: -6, z: 2 },
  { id: "footL", src: S("footL"), left: 25, top: 72, width: 24, height: 12, origin: "50% 0%", in0: 0.7, in1: 0.8, fromX: -4, fromY: 48, fromR: 0, z: 1 },
  { id: "footR", src: S("footR"), left: 51, top: 72, width: 24, height: 12, origin: "50% 0%", in0: 0.7, in1: 0.8, fromX: 4, fromY: 48, fromR: 0, z: 1 },
];

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
function remap(v: number, a: number, b: number) {
  return b === a ? 0 : clamp01((v - a) / (b - a));
}
function smooth(e0: number, e1: number, x: number) {
  const t = remap(x, e0, e1);
  return t * t * (3 - 2 * t);
}

export type SpriteState = {
  id: PartId;
  opacity: number;
  x: number;
  y: number;
  rotate: number;
};

export type AssemblyFrame = {
  t: number;
  cameraScale: number;
  cameraY: number;
  sprites: SpriteState[];
  eyes: number;
};

export function computeAssembly(tRaw: number, reduced: boolean): AssemblyFrame {
  const t = reduced ? 1 : clamp01(tRaw);
  const sprites: SpriteState[] = SPRITES.map((def) => {
    const k = smooth(def.in0, def.in1, t);
    const started = t >= def.in0;
    const isHead = def.id === "head";
    const isVisor = def.id === "visor";
    let opacity = 0;
    if (isHead) opacity = 1;
    else if (isVisor) opacity = k;
    else if (started) opacity = 1;
    return {
      id: def.id,
      opacity,
      x: def.fromX * (1 - k),
      y: def.fromY * (1 - k),
      rotate: def.fromR * (1 - k),
    };
  });
  return {
    t,
    cameraScale: 2.05 - 1.05 * smooth(0.02, 0.82, t),
    cameraY: (1 - smooth(0.0, 0.8, t)) * 18,
    sprites,
    eyes: smooth(0.88, 0.97, t),
  };
}

export function readTrackProgress(track: HTMLElement) {
  const total = track.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(1, -track.getBoundingClientRect().top / total));
}
