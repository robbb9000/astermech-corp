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
  | "footR";

export type PartDef = {
  id: PartId;
  src: string;
  /** Assembly progress window [start, end] in 0–1. */
  in0: number;
  in1: number;
  /** Resting offset before the part docks. */
  x: number;
  y: number;
  rotate: number;
};

const bust = "v8";

export const PART_DEFS: PartDef[] = [
  { id: "head", src: `/cinematic/v1/parts/head.png?${bust}`, in0: 0.0, in1: 0.08, x: 0, y: -6, rotate: 0 },
  { id: "torso", src: `/cinematic/v1/parts/torso.png?${bust}`, in0: 0.1, in1: 0.24, x: 0, y: 42, rotate: 0 },
  { id: "hip", src: `/cinematic/v1/parts/hip.png?${bust}`, in0: 0.2, in1: 0.3, x: 0, y: 28, rotate: 0 },
  { id: "armUpperL", src: `/cinematic/v1/parts/armUpperL.png?${bust}`, in0: 0.25, in1: 0.36, x: -46, y: -6, rotate: 22 },
  { id: "armUpperR", src: `/cinematic/v1/parts/armUpperR.png?${bust}`, in0: 0.25, in1: 0.36, x: 46, y: -6, rotate: -22 },
  { id: "forearmL", src: `/cinematic/v1/parts/forearmL.png?${bust}`, in0: 0.33, in1: 0.42, x: -54, y: 16, rotate: 18 },
  { id: "forearmR", src: `/cinematic/v1/parts/forearmR.png?${bust}`, in0: 0.33, in1: 0.42, x: 54, y: 16, rotate: -18 },
  { id: "handL", src: `/cinematic/v1/parts/handL.png?${bust}`, in0: 0.4, in1: 0.5, x: -38, y: 24, rotate: 12 },
  { id: "handR", src: `/cinematic/v1/parts/handR.png?${bust}`, in0: 0.4, in1: 0.5, x: 38, y: 24, rotate: -12 },
  { id: "legUpperL", src: `/cinematic/v1/parts/legUpperL.png?${bust}`, in0: 0.5, in1: 0.6, x: -10, y: 38, rotate: 8 },
  { id: "legUpperR", src: `/cinematic/v1/parts/legUpperR.png?${bust}`, in0: 0.5, in1: 0.6, x: 10, y: 38, rotate: -8 },
  { id: "legLowerL", src: `/cinematic/v1/parts/legLowerL.png?${bust}`, in0: 0.58, in1: 0.68, x: -8, y: 46, rotate: 6 },
  { id: "legLowerR", src: `/cinematic/v1/parts/legLowerR.png?${bust}`, in0: 0.58, in1: 0.68, x: 8, y: 46, rotate: -6 },
  { id: "footL", src: `/cinematic/v1/parts/footL.png?${bust}`, in0: 0.7, in1: 0.8, x: -6, y: 36, rotate: 0 },
  { id: "footR", src: `/cinematic/v1/parts/footR.png?${bust}`, in0: 0.7, in1: 0.8, x: 6, y: 36, rotate: 0 },
];

export const PART_ORDER = PART_DEFS.map((p) => p.id);

export const HANGAR_SRC = `/cinematic/v1/parts/hangar.jpg?${bust}`;
export const BODY_SRC = `/cinematic/v1/parts/body.jpg?${bust}`;

export const ASSEMBLY_COPY = [
  { at: 0.0, lines: ["IDEAS", "TAKE", "SHAPE"] },
  { at: 0.28, lines: ["PIECE", "BY PIECE"] },
  { at: 0.55, lines: ["BUILT", "WITH PURPOSE"] },
  { at: 0.88, lines: ["READY."] },
] as const;
