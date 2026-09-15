import { getPack, type Plate } from "./assets";
import { SCENE_COPY, type SceneCopy } from "./copy";
import { ASSEMBLY_COPY, PART_DEFS, type PartId } from "./parts";

export const CINEMATIC_VH = 2000;

export function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function remap(v: number, a: number, b: number) {
  if (b === a) return 0;
  return clamp01((v - a) / (b - a));
}

export function smoothstep(e0: number, e1: number, x: number) {
  const t = remap(x, e0, e1);
  return t * t * (3 - 2 * t);
}

export function holdFade(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) {
  if (p <= inStart || p >= outEnd) return 0;
  if (p < inEnd) return smoothstep(inStart, inEnd, p);
  if (p > outStart) return 1 - smoothstep(outStart, outEnd, p);
  return 1;
}

export type BeatId =
  | "landing"
  | "awaken"
  | "assembly"
  | "build"
  | "activate"
  | "launch"
  | "beyond"
  | "arrival"
  | "observation"
  | "vision";

export const BEATS: Record<BeatId, { in0: number; in1: number; out0: number; out1: number }> =
  {
    landing: { in0: -0.02, in1: 0.0, out0: 0.03, out1: 0.055 },
    awaken: { in0: 0.03, in1: 0.055, out0: 0.09, out1: 0.12 },
    assembly: { in0: 0.09, in1: 0.12, out0: 0.52, out1: 0.56 },
    build: { in0: 0.515, in1: 0.55, out0: 0.60, out1: 0.635 },
    activate: { in0: 0.61, in1: 0.645, out0: 0.72, out1: 0.755 },
    launch: { in0: 0.73, in1: 0.765, out0: 0.82, out1: 0.85 },
    beyond: { in0: 0.825, in1: 0.85, out0: 0.885, out1: 0.91 },
    arrival: { in0: 0.89, in1: 0.915, out0: 0.94, out1: 0.96 },
    observation: { in0: 0.94, in1: 0.96, out0: 0.985, out1: 0.995 },
    vision: { in0: 0.98, in1: 0.992, out0: 1.05, out1: 1.08 },
  };

export const BEAT_ORDER: BeatId[] = [
  "landing",
  "awaken",
  "assembly",
  "build",
  "activate",
  "launch",
  "beyond",
  "arrival",
  "observation",
  "vision",
];

export type LayerState = {
  id: string;
  src: string;
  objectPosition: string;
  opacity: number;
  scale: number;
  y: number;
  armed: boolean;
};

export type PartState = {
  id: PartId;
  opacity: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

export function computeParts(t: number): PartState[] {
  return PART_DEFS.map((def) => {
    const k = smoothstep(def.in0, def.in1, t);
    const visible = def.id === "head" ? 1 : t >= def.in0 - 0.02 ? k : 0;
    return {
      id: def.id,
      opacity: visible,
      x: def.x * (1 - k),
      y: def.y * (1 - k),
      rotate: def.rotate * (1 - k),
      scale: 1,
    };
  });
}

export type FrameState = {
  layers: LayerState[];
  copy: Record<string, number>;
  landingOpacity: number;
  scrollHint: number;
  eyesGlow: number;
  railIndex: number;
  progress: number;
  hangarOpacity: number;
  parts: PartState[];
  assembledOpacity: number;
  assemblyT: number;
  cameraScale: number;
  cameraY: number;
  assemblyCopy: number;
  assemblyCopyLines: readonly string[];
};

function ken(local: number, reduced: boolean) {
  if (reduced) return { scale: 1, y: 0 };
  return { scale: 1 + local * 0.055, y: -local * 2.2 };
}

function layer(
  id: string,
  plate: Plate,
  opacity: number,
  local: number,
  reduced: boolean,
  extra: { scale?: number; y?: number } = {},
): LayerState {
  const kb = ken(local, reduced);
  return {
    id,
    src: plate.src,
    objectPosition: plate.objectPosition,
    opacity,
    scale: kb.scale * (extra.scale ?? 1),
    y: kb.y + (extra.y ?? 0),
    armed: opacity > 0.001,
  };
}

function beatOpacity(p: number, id: BeatId) {
  const b = BEATS[id];
  return holdFade(p, b.in0, b.in1, b.out0, b.out1);
}

export function computeFrame(p: number, reduced: boolean): FrameState {
  const pack = getPack();
  const layers: LayerState[] = [];

  const landOp = beatOpacity(p, "landing");
  layers.push(layer("landing", pack.landing, landOp, remap(p, 0, 0.09), reduced));

  const awakenOp = beatOpacity(p, "awaken");
  layers.push(layer("awaken", pack.awaken, awakenOp, remap(p, 0.035, 0.15), reduced));

  const assemblyOp = beatOpacity(p, "assembly");
  const assemblyT = remap(p, BEATS.assembly.in0, BEATS.assembly.out0);
  const t = reduced ? 1 : assemblyT;
  const parts = computeParts(t).map((part) => ({
    ...part,
    opacity: part.opacity * assemblyOp,
  }));
  const assembledOpacity = assemblyOp * smoothstep(0.8, 0.93, t);
  const cameraScale = 1.52 - 0.52 * smoothstep(0.05, 0.92, t);
  const cameraY = (1 - smoothstep(0.0, 0.88, t)) * 16;
  let assemblyCopyLines: readonly string[] = ASSEMBLY_COPY[0].lines;
  for (const block of ASSEMBLY_COPY) {
    if (t >= block.at) assemblyCopyLines = block.lines;
  }
  const assemblyEyes = assemblyOp * smoothstep(0.88, 0.97, t);

  const buildOp = beatOpacity(p, "build");
  layers.push(
    layer("build", pack.build, buildOp, remap(p, 0.515, 0.635), reduced, {
      y: reduced ? 0 : remap(p, 0.515, 0.635) * -1.5,
    }),
  );

  const actOp = beatOpacity(p, "activate");
  const actLocal = remap(p, BEATS.activate.in0, BEATS.activate.out1);
  const eyes = smoothstep(0.28, 0.62, actLocal);
  layers.push(
    layer("activate-dark", pack.activateDark, actOp * (1 - eyes) + actOp * 0.08, actLocal, reduced, {
      scale: 1 + actLocal * 0.04,
    }),
  );
  layers.push(
    layer("activate", pack.activate, actOp * eyes, actLocal, reduced, {
      scale: 1 + actLocal * 0.04,
    }),
  );

  const launchOp = beatOpacity(p, "launch");
  const launchLocal = remap(p, BEATS.launch.in0, BEATS.launch.out1);
  layers.push(
    layer("launch", pack.launch, launchOp, launchLocal, reduced, {
      scale: 1 + launchLocal * 0.08,
      y: reduced ? 0 : -launchLocal * 6,
    }),
  );

  const beyondOp = beatOpacity(p, "beyond");
  layers.push(layer("beyond", pack.beyond, beyondOp, remap(p, 0.825, 0.91), reduced));

  const arrivalOp = beatOpacity(p, "arrival");
  const arrivalLocal = remap(p, BEATS.arrival.in0, BEATS.arrival.out1);
  layers.push(
    layer("arrival", pack.arrival, arrivalOp, arrivalLocal, reduced, {
      scale: 1 + arrivalLocal * 0.05,
    }),
  );

  const obsOp = beatOpacity(p, "observation");
  layers.push(layer("observation", pack.observation, obsOp, remap(p, 0.94, 0.995), reduced));

  const visOp = beatOpacity(p, "vision");
  layers.push(layer("vision", pack.vision, visOp, remap(p, 0.98, 1), reduced));

  const copy: Record<string, number> = {};
  for (const scene of SCENE_COPY) {
    const beat = BEATS[scene.id as BeatId];
    if (!beat) {
      copy[scene.id] = 0;
      continue;
    }
    copy[scene.id] = holdFade(
      p,
      beat.in0 + 0.012,
      beat.in1 + 0.008,
      beat.out0 - 0.008,
      beat.out1 - 0.008,
    );
  }
  copy.assembly = 0;

  let railIndex = 0;
  let best = -1;
  BEAT_ORDER.forEach((id, i) => {
    const op = beatOpacity(p, id);
    if (op > best) {
      best = op;
      railIndex = i;
    }
  });

  return {
    layers,
    copy,
    landingOpacity: holdFade(p, -0.02, 0, 0.028, 0.07),
    scrollHint: holdFade(p, -0.02, 0, 0.012, 0.05),
    eyesGlow: Math.max(actOp * eyes, assemblyEyes),
    railIndex,
    progress: p,
    hangarOpacity: assemblyOp,
    parts,
    assembledOpacity,
    assemblyT: t,
    cameraScale: reduced ? 1 : cameraScale,
    cameraY: reduced ? 0 : cameraY,
    assemblyCopy: assemblyOp,
    assemblyCopyLines,
  };
}

export function copyFor(id: string): SceneCopy | undefined {
  return SCENE_COPY.find((c) => c.id === id);
}

export function progressForBeat(id: BeatId) {
  const b = BEATS[id];
  return (b.in1 + b.out0) / 2;
}

export function scrollYForProgress(track: HTMLElement, p: number) {
  const total = track.offsetHeight - window.innerHeight;
  return track.offsetTop + clamp01(p) * Math.max(0, total);
}
