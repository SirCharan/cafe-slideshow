import React from "react";
import type { ComponentProps } from "./index";
import { outlinePaths, RPaths, kalam, typed, win, P, STROKE_W } from "./shared";

interface Pin { name: string; tag: string }
interface MapProps { pins: Pin[] }

const FIXED: Record<string, [number, number]> = {
  Indiranagar: [0.62, 0.42],
  Koramangala: [0.58, 0.62],
  "HSR Layout": [0.66, 0.74],
  Whitefield: [0.88, 0.4],
};

const fallbackPos = (i: number): [number, number] => [0.22 + (i % 3) * 0.22, 0.28 + Math.floor(i / 3) * 0.24];

export const MicroMarketMap: React.FC<ComponentProps> = ({ el, localFrame, fps, seed }) => {
  const { x, y, w = 700, h = 600 } = el;
  const props = (el.props as unknown) as MapProps;
  const pins = props.pins ?? [];

  const outlineFrames = Math.round(1 * fps);
  const outlineProgress = win(localFrame, 0, outlineFrames);

  const blob: [number, number][] = [
    [x + w * 0.12, y + h * 0.2],
    [x + w * 0.35, y + h * 0.06],
    [x + w * 0.68, y + h * 0.1],
    [x + w * 0.92, y + h * 0.3],
    [x + w * 0.88, y + h * 0.62],
    [x + w * 0.7, y + h * 0.9],
    [x + w * 0.4, y + h * 0.94],
    [x + w * 0.15, y + h * 0.78],
    [x + w * 0.06, y + h * 0.48],
    [x + w * 0.12, y + h * 0.2],
  ];
  const outline = outlinePaths(seed, P.ink, (g) => g.curve(blob));
  const road1 = outlinePaths(seed + 1, P.ink, (g) => g.curve([[x + w * 0.2, y + h * 0.3], [x + w * 0.5, y + h * 0.5], [x + w * 0.8, y + h * 0.35]]));
  const road2 = outlinePaths(seed + 2, P.ink, (g) => g.curve([[x + w * 0.3, y + h * 0.8], [x + w * 0.55, y + h * 0.6], [x + w * 0.75, y + h * 0.75]]));

  const pinFrames = pins.map((_, i) => outlineFrames + i * 18);
  const positions: [number, number][] = pins.map((p, i) => FIXED[p.name] ?? fallbackPos(i));

  const corridorStart = pinFrames.length ? pinFrames[pinFrames.length - 1] + 18 : outlineFrames;
  const corridorProgress = win(localFrame, corridorStart, 30);
  const corridorPts: [number, number][] = positions.map(([rx, ry]) => [x + rx * w, y + ry * h - 30]);
  const corridor = pinFrames.length > 1 ? outlinePaths(seed + 3, P.accent, (g) => g.curve(corridorPts)) : [];

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <RPaths paths={outline} progress={outlineProgress} />
      <RPaths paths={road1} progress={win(localFrame, outlineFrames * 0.4, outlineFrames * 0.6)} />
      <RPaths paths={road2} progress={win(localFrame, outlineFrames * 0.6, outlineFrames * 0.6)} />
      {corridor.length > 0 && <RPaths paths={corridor} progress={corridorProgress} />}
      {pins.map((pin, i) => {
        const start = pinFrames[i];
        const lf = localFrame - start;
        if (lf < 0) return null;
        const [rx, ry] = positions[i];
        const px = x + rx * w;
        const py = y + ry * h;
        const dropProgress = win(localFrame, start, 12);
        const pinPaths = outlinePaths(seed + 10 + i, P.accent, (g) => [
          ...g.ellipse(px, py - 30, 26, 26),
          ...g.polygon([[px - 12, py - 20], [px + 12, py - 20], [px, py + 4]]),
        ]);
        return (
          <g key={i}>
            <RPaths paths={pinPaths} progress={dropProgress} />
            <text x={px + 20} y={py - 44} style={kalam(34, P.ink)}>
              {typed(pin.name, lf - 14, fps)}
            </text>
            <text x={px + 20} y={py + 30} style={kalam(30, P.accent)}>
              {typed(pin.tag, lf - 34, fps)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
