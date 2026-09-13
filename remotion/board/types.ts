// v2 whiteboard storyboard contract. A slide's `board` is a list of drawn elements,
// each triggered by a sentence index (`at`) plus an optional delay in seconds.
// Coordinates are on the 1920x1080 board. Every animation is a pure function of frame.

export type InkColor = "ink" | "accent" | "green" | "red";

export interface ElBase {
  id: string;
  at: number; // sentence index that triggers the draw-on (clamped to the slide's sentence count)
  delay?: number; // seconds after that sentence starts
  x: number;
  y: number;
  w?: number;
  h?: number;
  rot?: number; // degrees
  color?: InkColor;
  duration?: number; // seconds for the draw-on; default derived from size / path length
}

export type ElKind =
  | { kind: "sketch"; src: string } // public/assets/sketch/<src>.png (transparent marker sketch)
  | { kind: "icon"; name: string } // @iconify-json/tabler icon name, e.g. "coffee"
  | { kind: "shape"; shape: "rect" | "ellipse" | "arrow" | "line" | "underline" | "circle"; to?: [number, number]; fill?: boolean }
  | { kind: "label"; text: string; size?: number } // hand-lettered 2–4 words, typewriter
  | { kind: "number"; text: string; size?: number; box?: "circle" | "rect" } // big ₹ figure, boxed half a beat later
  | { kind: "coins"; count: number } // stacked ₹ coins
  | { kind: "bar"; value: number; max: number; label: string } // hatched bar growing to value/max of w
  | { kind: "figure"; who: "owner" | "customer" | "landlord"; pose: "idle" | "point" | "shrug" | "armsUp"; say?: string }
  | { kind: "photo"; src: string; caption?: string } // public/assets/<src>, taped inside a drawn frame, desaturated
  | { kind: "highlight"; target: string } // yellow swipe over another element's box
  | { kind: "erase"; region?: [number, number, number, number] } // wipe everything drawn earlier (in region, or all)
  | { kind: "component"; name: "map" | "flip" | "calendar" | "gauge" | "blueprint" | "scale" | "clock"; props: Record<string, unknown> };

export type El = ElBase & ElKind;

export interface Board {
  elements: El[];
  camera?: { zoom?: number; focus?: [number, number] }; // optional slow push-in on a region
}

/** Props every element renderer receives. */
export interface ElementRenderProps<E extends El = El> {
  el: E;
  frame: number; // frames since the slide started
  localFrame: number; // frames since this element's start (can be negative before it starts)
  progress: number; // 0..1 draw-on progress
  seed: number; // deterministic per element
  sentenceStartFrames: number[]; // local to the slide, for elements that stage internally
  fps: number;
}

export type ElementRenderer<E extends El = El> = React.FC<ElementRenderProps<E>>;

/** Palette — the only colours allowed on the board (plus paper). */
export const PALETTE = {
  paper: "#F5F1EA",
  ink: "#141414",
  accent: "#C45C26",
  green: "#2F7D4F",
  red: "#B8322F",
  highlight: "#F2C94C",
} as const;

export const inkColor = (c: InkColor | undefined): string => PALETTE[c ?? "ink"];

export const STROKE = 5.5; // marker width in px on the 1920 board
export const DRAW_SECONDS_PER_1000PX = 0.6; // draw-on speed for paths
export const TYPE_CHARS_PER_SECOND = 24; // typewriter speed for labels
