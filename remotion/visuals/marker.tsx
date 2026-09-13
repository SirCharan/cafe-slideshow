import React from "react";
import type { Theme } from "../types";

// Hand-drawn primitives. `progress` is 0..1, a pure function of the caller's frame.
// Length estimates are fixed heuristics (no DOM measurement) — good enough for
// dash-offset animation, which only needs an upper bound.

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

const wobbleFilterId = "cafe-marker-wobble";

export const MarkerFilterDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <defs>
      <filter id={wobbleFilterId} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={1} seed={4} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={2} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);

export const Stroke: React.FC<{
  d: string;
  length: number; // fixed estimate of the path length
  progress: number;
  theme: Theme;
  color?: string;
  width?: number;
}> = ({ d, length, progress, theme, color, width }) => {
  const marker = theme.strokeStyle === "marker";
  const p = clamp01(progress);
  const strokeWidth = width ?? (marker ? 6 : 2.5);
  return (
    <path
      d={d}
      fill="none"
      stroke={color ?? theme.ink}
      strokeWidth={strokeWidth}
      strokeLinecap={marker ? "round" : "butt"}
      strokeLinejoin="round"
      strokeDasharray={length}
      strokeDashoffset={length * (1 - p)}
      filter={marker ? `url(#${wobbleFilterId})` : undefined}
    />
  );
};

export const Underline: React.FC<{
  x: number;
  y: number;
  width: number;
  progress: number;
  theme: Theme;
  color?: string;
}> = ({ x, y, width, progress, theme, color }) => (
  <Stroke
    d={`M ${x} ${y} L ${x + width} ${y}`}
    length={width}
    progress={progress}
    theme={theme}
    color={color}
  />
);

export const Circle: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  progress: number;
  theme: Theme;
  color?: string;
}> = ({ cx, cy, w, h, progress, theme, color }) => {
  const rx = w / 2;
  const ry = h / 2;
  const marker = theme.strokeStyle === "marker";
  // Slightly open ellipse (gap at the end) for the marker look; a closed ring for clean.
  const startAngle = marker ? 8 : 0;
  const endAngle = marker ? 352 : 360;
  const pts: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const a = ((startAngle + (endAngle - startAngle) * (i / steps)) * Math.PI) / 180;
    pts.push(`${cx + rx * Math.cos(a)} ${cy + ry * Math.sin(a)}`);
  }
  const d = `M ${pts.join(" L ")}`;
  const length = Math.PI * (rx + ry); // ellipse circumference estimate
  return <Stroke d={d} length={length} progress={progress} theme={theme} color={color} />;
};

export const Arrow: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number;
  theme: Theme;
  color?: string;
}> = ({ from, to, progress, theme, color }) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const headLen = 14;
  const headAngle = (28 * Math.PI) / 180;
  const rot = (a: number) => ({
    x: -ux * Math.cos(a) + uy * Math.sin(a),
    y: -uy * Math.cos(a) - ux * Math.sin(a),
  });
  const left = rot(headAngle);
  const right = rot(-headAngle);
  const d = `M ${from.x} ${from.y} L ${to.x} ${to.y} M ${to.x} ${to.y} L ${to.x + left.x * headLen} ${
    to.y + left.y * headLen
  } M ${to.x} ${to.y} L ${to.x + right.x * headLen} ${to.y + right.y * headLen}`;
  const length = len + headLen * 2;
  return <Stroke d={d} length={length} progress={progress} theme={theme} color={color} />;
};

export const Check: React.FC<{
  cx: number;
  cy: number;
  size: number;
  progress: number;
  theme: Theme;
  color?: string;
}> = ({ cx, cy, size, progress, theme, color }) => {
  const s = size / 2;
  const d = `M ${cx - s} ${cy} L ${cx - s * 0.25} ${cy + s * 0.7} L ${cx + s} ${cy - s * 0.7}`;
  const length = s * 2.2;
  return <Stroke d={d} length={length} progress={progress} theme={theme} color={color ?? theme.accent} width={6} />;
};
