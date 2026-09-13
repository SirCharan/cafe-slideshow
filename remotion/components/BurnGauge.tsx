import React from "react";
import { spring } from "remotion";
import type { ComponentProps } from "./index";
import { outlinePaths, hachurePaths, RPaths, kalam, win, P } from "./shared";

interface Zone { from: number; to: number; color: "green" | "red" }
interface GaugeProps { label: string; value: number; max: number; unit: string; zones?: Zone[] }

const angleFor = (frac: number) => -180 + 180 * frac; // -180 (left) .. 0 (right), semicircle top half

export const BurnGauge: React.FC<ComponentProps> = ({ el, localFrame, fps, seed }) => {
  const { x, y, w = 640, h = 420 } = el;
  const props = (el.props as unknown) as GaugeProps;
  const cx = x + w / 2;
  const cy = y + h * 0.85;
  const r = Math.min(w / 2, h) * 0.85;

  const arcOutline = outlinePaths(seed, P.ink, (g) => g.arc(cx, cy, r * 2, r * 2, Math.PI, 2 * Math.PI, false));
  const arcProgress = win(localFrame, 0, Math.round(0.7 * fps));

  const ticks = Array.from({ length: 11 }).map((_, i) => {
    const a = (angleFor(i / 10) * Math.PI) / 180;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a) * (r - 18);
    const y2 = cy + Math.sin(a) * (r - 18);
    return outlinePaths(seed + 1 + i, P.ink, (g) => g.line(x1, y1, x2, y2));
  });

  const zones = props.zones ?? [];
  const zoneStart = Math.round(0.7 * fps);

  const needleTrigger = Math.round(0.9 * fps);
  const s = spring({ frame: Math.max(0, localFrame - needleTrigger), fps, config: { damping: 12, mass: 0.6 } });
  const valueFrac = Math.max(0, Math.min(1, props.value / props.max));
  const needleAngle = (angleFor(s * valueFrac) * Math.PI) / 180;
  const needle = outlinePaths(seed + 50, P.accent, (g) => g.line(cx, cy, cx + Math.cos(needleAngle) * (r - 24), cy + Math.sin(needleAngle) * (r - 24)));

  const labelStart = Math.round(1.1 * fps);

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <text x={cx} y={y + 20} textAnchor="middle" style={kalam(34, P.ink)}>
        {props.label}
      </text>
      <RPaths paths={arcOutline} progress={arcProgress} />
      {ticks.map((t, i) => (
        <RPaths key={i} paths={t} progress={win(localFrame, zoneStart * (i / 11), 6)} />
      ))}
      {zones.map((z, i) => {
        const a0 = (angleFor(z.from / 100) * Math.PI) / 180;
        const a1 = (angleFor(z.to / 100) * Math.PI) / 180;
        const paths = hachurePaths(seed + 60 + i, P[z.color], (g) => g.arc(cx, cy, r * 1.7, r * 1.7, a0, a1, false));
        return <RPaths key={i} paths={paths} progress={win(localFrame, zoneStart + i * 8, 20)} />;
      })}
      <RPaths paths={needle} progress={localFrame >= needleTrigger ? 1 : 0} />
      <text x={cx} y={cy + 90} textAnchor="middle" style={kalam(96, P.accent)}>
        {localFrame >= labelStart ? `${props.value}${props.unit}` : ""}
      </text>
    </svg>
  );
};
