export type CopyAlign = "center" | "left";

export type SceneCopy = {
  id: string;
  kicker?: string;
  lines: string[];
  body?: string;
  align: CopyAlign;
};

export const SCENE_COPY: SceneCopy[] = [
  {
    id: "awaken",
    lines: ["IDEAS", "TAKE", "SHAPE"],
    align: "left",
  },
  {
    id: "assembly",
    lines: ["SMALL PIECES", "BIG", "POSSIBILITIES"],
    align: "left",
  },
  {
    id: "build",
    lines: ["FOCUSED.", "PRACTICAL.", "REAL IMPACT."],
    align: "left",
  },
  {
    id: "activate",
    lines: ["BUILT FOR", "A BRIGHTER", "TOMORROW"],
    align: "left",
  },
  {
    id: "launch",
    lines: ["FROM IDEAS", "TO REALITY"],
    align: "left",
  },
  {
    id: "beyond",
    lines: ["A PLATFORM", "FOR", "WHAT'S NEXT"],
    align: "left",
  },
  {
    id: "arrival",
    lines: ["NEW IDEAS", "GO FURTHER"],
    align: "left",
  },
  {
    id: "observation",
    lines: ["LOOKING", "FORWARD"],
    align: "left",
  },
  {
    id: "vision",
    kicker: "OUR VISION",
    lines: ["SMALL TEAM.", "FOCUSED PRODUCTS.", "BIG IDEAS."],
    body: "AsterMech Corp is an independent technology company focused on creating simple, useful digital products.",
    align: "left",
  },
];

export const LANDING_WORDMARK = "ASTERMECH CORP";
export const LANDING_SUBTITLE = "INDEPENDENT SOFTWARE STUDIO";
export const SCROLL_HINT = "SCROLL";

export const PRODUCT = {
  kicker: "OUR PRODUCTS",
  name: "JOURNEY",
  tagline: "Track your journey.",
  description:
    "A simple personal fitness tracker built around routines, daily progress and consistency.",
  cta: "View Journey",
  footnote: "More products coming soon.",
};

export const FINALE = {
  wordmark: "ASTERMECH CORP",
  statement:
    "A small independent technology company creating focused digital products.",
};

export const NAV = [
  { id: "about", label: "About", target: "vision" as const },
  { id: "products", label: "Products", target: "products" as const },
  { id: "contact", label: "Contact", target: "contact" as const },
] as const;
