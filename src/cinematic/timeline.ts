import { getPack, type Plate } from "./assets";
import { SCENE_COPY, type SceneCopy } from "./copy";

export const CINEMATIC_VH = 1400;

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
  | "build"
  | "activate"
  | "launch"
  | "beyond"
  | "arrival"
  | "observation"
  | "vision";

export const BEATS: Record<BeatId, { in0: number; in1: number; out0: number; out1: number }> =
  {
    build: { in0: -0.02, in1: 0.0, out0: 0.12, out1: 0.16 },
    activate: { in0: 0.12, in1: 0.16, out0: 0.32, out1: 0.37 },
    launch: { in0: 0.33, in1: 0.38, out0: 0.52, out1: 0.57 },
    beyond: { in0: 0.53, in1: 0.57, out0: 0.68, out1: 0.73 },
    arrival: { in0: 0.69, in1: 0.74, out0: 0.82, out1: 0.86 },
    observation: { in0: 0.83, in1: 0.87, out0: 0.93, out1: 0.96 },
    vision: { in0: 0.94, in1: 0.97, out0: 1.05, out1: 1.08 },
  };

export const BEAT_ORDER: BeatId[] = [
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

export type FrameState = {
  layers: LayerState[];
  copy: Record<string, number>;
  eyesGlow: number;
  railIndex: number;
  progress: number;
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

  const buildOp = beatOpacity(p, "build");
  layers.push(layer("build", pack.build, buildOp, remap(p, 0, 0.16), reduced));

  const actOp = beatOpacity(p, "activate");
  const actLocal = remap(p, BEATS.activate.in0, BEATS.activate.out1);
  const eyes = smoothstep(0.2, 0.55, actLocal);
  layers.push(
    layer("activate-dark", pack.activateDark, actOp * (1 - eyes) + actOp * 0.08, actLocal, reduced),
  );
  layers.push(layer("activate", pack.activate, actOp * eyes, actLocal, reduced));

  const launchOp = beatOpacity(p, "launch");
  const launchLocal = remap(p, BEATS.launch.in0, BEATS.launch.out1);
  layers.push(
    layer("launch", pack.launch, launchOp, launchLocal, reduced, {
      scale: 1 + launchLocal * 0.08,
      y: reduced ? 0 : -launchLocal * 6,
    }),
  );

  layers.push(layer("beyond", pack.beyond, beatOpacity(p, "beyond"), remap(p, 0.53, 0.73), reduced));
  layers.push(layer("arrival", pack.arrival, beatOpacity(p, "arrival"), remap(p, 0.69, 0.86), reduced));
  layers.push(
    layer("observation", pack.observation, beatOpacity(p, "observation"), remap(p, 0.83, 0.96), reduced),
  );
  layers.push(layer("vision", pack.vision, beatOpacity(p, "vision"), remap(p, 0.94, 1), reduced));

  const copy: Record<string, number> = {};
  for (const scene of SCENE_COPY) {
    const beat = BEATS[scene.id as BeatId];
    if (!beat) {
      copy[scene.id] = 0;
      continue;
    }
    copy[scene.id] = holdFade(
      p,
      beat.in0 + 0.01,
      beat.in1 + 0.008,
      beat.out0 - 0.008,
      beat.out1 - 0.008,
    );
  }

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
    eyesGlow: actOp * eyes,
    railIndex,
    progress: p,
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
