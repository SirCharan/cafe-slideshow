import React from "react";
import type { ComponentProps } from "./index";
import { outlinePaths, hachurePaths, RPaths, kalam, win, typed, P } from "./shared";

interface Peak { from: number; to: number; label: string }
interface ClockProps { peaks: Peak[] }

const hourAngle = (hour: number) => (hour / 24) * 360 - 90; // degrees, 0 = 24/0 at top

export const RushClock: React.FC<ComponentProps> = ({ el, progress, localFrame, fps, seed }) => {
  const { x, y, w = 600, h = 600 } = el;
  const props = (el.props as unknown) as ClockProps;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.min(w, h) / 2 - 20;

  const dialOutline = outlinePaths(seed, P.ink, (g) => g.ellipse(cx, cy, r * 2, r * 2));
  const dialProgress = win(localFrame, 0, Math.round(0.8 * fps));

  const ticks = Array.from({ length: 24 }).map((_, i) => {
    const a = (hourAngle(i) * Math.PI) / 180;
    return outlinePaths(seed + 1 + i, P.ink, (g) =>
      g.line(cx + Math.cos(a) * r, cy + Math.sin(a) * r, cx + Math.cos(a) * (r - 16), cy + Math.sin(a) * (r - 16)),
    );
  });

  const numerals = [6, 12, 18, 24];

  const peaks = props.peaks ?? [];
  const peakStart = Math.round(0.9 * fps);

  const sweepStart = Math.round(1.1 * fps);
  const needleDeg = 360 * progress;
  const na = ((needleDeg - 90) * Math.PI) / 180;
  const needle = outlinePaths(seed + 90, P.accent, (g) => g.line(cx, cy, cx + Math.cos(na) * (r - 30), cy + Math.sin(na) * (r - 30)));

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <RPaths paths={dialOutline} progress={dialProgress} />
      {ticks.map((t, i) => (
        <RPaths key={i} paths={t} progress={win(localFrame, i * 2, 6)} />
      ))}
      {numerals.map((n) => {
        const a = (hourAngle(n % 24) * Math.PI) / 180;
        const nx = cx + Math.cos(a) * (r + 30);
        const ny = cy + Math.sin(a) * (r + 30);
        return (
          <text key={n} x={nx} y={ny + 10} textAnchor="middle" style={kalam(30, P.ink)}>
            {n}
          </text>
        );
      })}
      {peaks.map((peak, i) => {
        const a0 = (hourAngle(peak.from) * Math.PI) / 180;
        const a1 = (hourAngle(peak.to) * Math.PI) / 180;
        const arcPaths = hachurePaths(seed + 40 + i, P.accent, (g) => g.arc(cx, cy, r * 2, r * 2, a0, a1, false));
        const start = peakStart + i * 20;
        const arcProgress = win(localFrame, start, 24);
        const labelAngle = (a0 + a1) / 2;
        const lx = cx + Math.cos(labelAngle) * (r + 70);
        const ly = cy + Math.sin(labelAngle) * (r + 70);
        return (
          <g key={i}>
            <RPaths paths={arcPaths} progress={arcProgress} />
            <text x={lx} y={ly} textAnchor="middle" style={kalam(28, P.accent)}>
              {typed(peak.label, localFrame - (start + 24), fps)}
            </text>
          </g>
        );
      })}
      <RPaths paths={needle} progress={localFrame >= sweepStart ? 1 : 0} />
    </svg>
  );
};
