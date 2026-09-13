import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import type { Theme } from "../types";

export const Range: React.FC<{
  title: string;
  sub?: string;
  min: number;
  max: number;
  unit: string;
  markers: { label: string; value: number }[];
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ title, min, max, unit, markers, theme, frame, width, height }) => {
  const { fps } = useVideoConfig();
  const bandW = width - 100;
  const bandX = 50;
  const bandY = height / 2;
  const span = max - min || 1;
  const fill = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pos = (v: number) => bandX + ((v - min) / span) * bandW;

  return (
    <div style={{ width, height, fontFamily: theme.fontBody, position: "relative" }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>

      <div style={{ position: "absolute", left: bandX, top: bandY - 10, width: bandW, height: 20, background: theme.paper2, borderRadius: theme.radius }}>
        <div style={{ width: bandW * fill, height: 20, background: theme.accent2, borderRadius: theme.radius }} />
      </div>

      {markers.map((m, i) => {
        const start = 28 + i * 8;
        const local = Math.max(0, frame - start);
        const drop = spring({ frame: local, fps, config: { damping: 14 } });
        const y = interpolate(drop, [0, 1], [-30, 0]);
        const opacity = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = pos(m.value);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: bandY - 46, transform: `translate(-50%, ${y}px)`, opacity, textAlign: "center" }}>
            <div style={{ fontSize: 22, color: theme.mute }}>{m.label}</div>
            <div style={{ width: 3, height: 20, background: theme.ink, margin: "4px auto" }} />
            <div style={{ fontFamily: theme.fontMono, fontSize: 26, color: theme.ink, fontVariantNumeric: "tabular-nums" }}>
              {m.value}
              {unit}
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: bandX, top: bandY + 26, fontSize: 22, color: theme.mute, fontStyle: "italic" }}>range</div>
    </div>
  );
};
