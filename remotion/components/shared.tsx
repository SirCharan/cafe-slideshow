import React from "react";
import { roughGen, pathLength, dashFor, type RoughPath } from "../board/rough";
import { PALETTE, STROKE } from "../board/types";
import { FONT_FAMILIES } from "../fonts";

export const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** 0..1 progress of a frame within a [start, start+len) window. */
export const win = (frame: number, start: number, len: number): number => clamp01((frame - start) / Math.max(1, len));

/** Estimate the element's total draw-on duration in frames from progress + localFrame (pure, no state). */
export const estDurFrames = (localFrame: number, progress: number): number =>
  progress > 0 && progress < 0.999 ? localFrame / progress : Math.max(localFrame, 1);

/** A rough shape's outline only (no fill option → no hachure lines produced). */
export const outlinePaths = (seed: number, color: string, fn: (g: ReturnType<typeof roughGen>) => RoughPath[]): RoughPath[] =>
  fn(roughGen(seed, color));

/** A rough shape's hachure lines only (outline stroke set to "none" so it stays invisible). */
export const hachurePaths = (seed: number, color: string, fn: (g: ReturnType<typeof roughGen>) => RoughPath[], gap = 9): RoughPath[] =>
  fn(roughGen(seed, "none", { fill: color, fillStyle: "hachure", hachureGap: gap }));

/** Renders a batch of rough paths, each drawing on via stroke-dashoffset at the same `progress`. */
export const RPaths: React.FC<{ paths: RoughPath[]; progress: number }> = ({ paths, progress }) => (
  <>
    {paths.map((p, i) => {
      const len = pathLength(p.d) || 1;
      const dash = dashFor(len, progress);
      return (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={dash as React.CSSProperties}
        />
      );
    })}
  </>
);

export const kalam = (size: number, color: string, weight = 700): React.CSSProperties => ({
  fontFamily: FONT_FAMILIES.kalam,
  fontSize: size,
  color,
  fontWeight: weight,
  whiteSpace: "pre",
});

/** Typewriter-visible slice of text, `localFrame` frames after this text started. */
export const typed = (text: string, localFrame: number, fps: number, cps = 24): string =>
  text.slice(0, Math.max(0, Math.min(text.length, Math.floor((Math.max(0, localFrame) / fps) * cps))));

export const STROKE_W = STROKE;
export const P = PALETTE;
