import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { PALETTE, STROKE } from "./types";

export type RoughPath = { d: string; stroke: string; strokeWidth: number; fill?: string };

/** Stable 32-bit hash so the same element id always draws the same wobble. */
export const seedFrom = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 2147483647 || 1;
};

const base = (seed: number, stroke: string, extra?: Options): Options => ({
  seed,
  roughness: 1.2,
  bowing: 1,
  stroke,
  strokeWidth: STROKE,
  fillStyle: "hachure",
  hachureGap: 9,
  fillWeight: 2.2,
  ...extra,
});

/** Seeded generator; call the shape methods then `toPaths`. */
export const roughGen = (seed: number, stroke: string = PALETTE.ink, extra?: Options) => {
  const g = rough.generator({ options: base(seed, stroke, extra) });
  return {
    rect: (x: number, y: number, w: number, h: number, o?: Options) => g.toPaths(g.rectangle(x, y, w, h, o)) as RoughPath[],
    ellipse: (cx: number, cy: number, w: number, h: number, o?: Options) => g.toPaths(g.ellipse(cx, cy, w, h, o)) as RoughPath[],
    line: (x1: number, y1: number, x2: number, y2: number, o?: Options) => g.toPaths(g.line(x1, y1, x2, y2, o)) as RoughPath[],
    curve: (pts: [number, number][], o?: Options) => g.toPaths(g.curve(pts, o)) as RoughPath[],
    polygon: (pts: [number, number][], o?: Options) => g.toPaths(g.polygon(pts, o)) as RoughPath[],
    path: (d: string, o?: Options) => g.toPaths(g.path(d, o)) as RoughPath[],
    arc: (cx: number, cy: number, w: number, h: number, start: number, stop: number, closed = false, o?: Options) =>
      g.toPaths(g.arc(cx, cy, w, h, start, stop, closed, o)) as RoughPath[],
  };
};

/** Approximate length of an SVG path (M/L/C/Q/Z absolute commands, as rough.js emits). No DOM needed. */
export const pathLength = (d: string): number => {
  const tokens = d.match(/[MLCQZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  let i = 0;
  let cmd = "";
  let cx = 0, cy = 0, sx = 0, sy = 0, len = 0;
  const num = () => parseFloat(tokens[i++]);
  const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(bx - ax, by - ay);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MLCQZ]/i.test(t)) { cmd = t.toUpperCase(); i++; if (cmd === "Z") { len += dist(cx, cy, sx, sy); cx = sx; cy = sy; } continue; }
    if (cmd === "M") { cx = num(); cy = num(); sx = cx; sy = cy; cmd = "L"; }
    else if (cmd === "L") { const x = num(), y = num(); len += dist(cx, cy, x, y); cx = x; cy = y; }
    else if (cmd === "C") {
      const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
      let px = cx, py = cy;
      for (let k = 1; k <= 8; k++) { const u = k / 8, v = 1 - u; const bx = v*v*v*cx + 3*v*v*u*x1 + 3*v*u*u*x2 + u*u*u*x; const by = v*v*v*cy + 3*v*v*u*y1 + 3*v*u*u*y2 + u*u*u*y; len += dist(px, py, bx, by); px = bx; py = by; }
      cx = x; cy = y;
    } else if (cmd === "Q") {
      const x1 = num(), y1 = num(), x = num(), y = num();
      let px = cx, py = cy;
      for (let k = 1; k <= 6; k++) { const u = k / 6, v = 1 - u; const bx = v*v*cx + 2*v*u*x1 + u*u*x; const by = v*v*cy + 2*v*u*y1 + u*u*y; len += dist(px, py, bx, by); px = bx; py = by; }
      cx = x; cy = y;
    } else { i++; }
  }
  return len;
};

/** stroke-dasharray/offset pair for a draw-on at `progress` 0..1. */
export const dashFor = (length: number, progress: number) => ({
  strokeDasharray: `${length} ${length}`,
  strokeDashoffset: length * (1 - Math.max(0, Math.min(1, progress))),
});
