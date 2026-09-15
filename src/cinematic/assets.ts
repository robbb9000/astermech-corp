/**
 * ASTERMECH visual pack
 *
 * Current mech is V1 (canonical hero locked to the user reference).
 * To ship V2 without rebuilding the site:
 *   1. Add public/cinematic/v2/ using the same filenames as v1
 *   2. Duplicate the `v1` pack below as `v2`
 *   3. Set MECH_VERSION = "v2"
 */

export const MECH_VERSION = "v1" as const;

export type MechVersion = "v1" | "v2";

export type Plate = {
  src: string;
  objectPosition: string;
};

const bust = "v6";

const v1 = {
  landing: {
    src: `/cinematic/v1/landing.jpg?${bust}`,
    objectPosition: "center 80%",
  },
  awaken: {
    src: `/cinematic/v1/awaken.jpg?${bust}`,
    objectPosition: "center 40%",
  },
  hangar: {
    src: `/cinematic/v1/hangar.jpg?${bust}`,
    objectPosition: "center 42%",
  },
  assembly: [
    {
      src: `/cinematic/v1/assembly-01.jpg?${bust}`,
      objectPosition: "center 42%",
    },
    {
      src: `/cinematic/v1/assembly-02.jpg?${bust}`,
      objectPosition: "center 38%",
    },
    {
      src: `/cinematic/v1/assembly-03.jpg?${bust}`,
      objectPosition: "center 42%",
    },
    {
      src: `/cinematic/v1/assembly-04.jpg?${bust}`,
      objectPosition: "center 42%",
    },
  ] as const satisfies readonly Plate[],
  build: {
    src: `/cinematic/v1/build.jpg?${bust}`,
    objectPosition: "center 30%",
  },
  activateDark: {
    src: `/cinematic/v1/activate-dark.jpg?${bust}`,
    objectPosition: "center 42%",
  },
  activate: {
    src: `/cinematic/v1/activate.jpg?${bust}`,
    objectPosition: "center 42%",
  },
  launch: {
    src: `/cinematic/v1/launch.jpg?${bust}`,
    objectPosition: "center 42%",
  },
  beyond: {
    src: `/cinematic/v1/beyond.jpg?${bust}`,
    objectPosition: "center 50%",
  },
  arrival: {
    src: `/cinematic/v1/arrival.jpg?${bust}`,
    objectPosition: "center 48%",
  },
  observation: {
    src: `/cinematic/v1/observation.jpg?${bust}`,
    objectPosition: "center 50%",
  },
  vision: {
    src: `/cinematic/v1/vision.jpg?${bust}`,
    objectPosition: "center 42%",
  },
  finale: {
    src: `/cinematic/v1/final.jpg?${bust}`,
    objectPosition: "center 84%",
  },
} as const;

const packs: Record<MechVersion, typeof v1> = {
  v1,
  v2: v1,
};

export function getPack(version: MechVersion = MECH_VERSION) {
  return packs[version] ?? packs.v1;
}

export const PRELOAD_SRCS = [v1.landing.src, v1.awaken.src, v1.activate.src] as const;
