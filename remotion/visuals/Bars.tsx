import React from "react";
import { spring, useVideoConfig } from "remotion";
import type { Theme } from "../types";

export const Bars: React.FC<{
  title: string;
  sub?: string;
  items: { label: string; value: number; display: string }[];
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ title, sub, items, theme, frame, width, height }) => {
  const { fps } = useVideoConfig();
  const max = Math.max(...items.map((i) => i.value), 1);
  const trackW = width - 88;
  const rowH = Math.min(74, (height - 170) / items.length);

  return (
    <div
      style={{
        width,
        height,
        fontFamily: theme.fontBody,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>
      {sub ? <div style={{ fontSize: 26, color: theme.mute, marginTop: 8 }}>{sub}</div> : null}

      <div style={{ marginTop: 24 }}>
        {items.map((item, i) => {
          const start = 8 + i * 6;
          const local = Math.max(0, frame - start);
          const grow = spring({ frame: local, fps, config: { stiffness: 120, damping: 18 } });
          const fillW = trackW * (item.value / max) * grow;
          const color = i === 0 ? theme.accent : i % 2 === 1 ? theme.accent2 : theme.accentSoft;
          return (
            <div key={i} style={{ height: rowH, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 30, color: theme.ink }}>{item.label}</div>
                <div style={{ fontFamily: theme.fontMono, fontSize: 34, color: theme.accent, fontVariantNumeric: "tabular-nums" }}>
                  {item.display}
                </div>
              </div>
              <div style={{ width: trackW, height: 16, background: theme.paper2, borderRadius: theme.radius }}>
                <div style={{ width: fillW, height: 16, background: color, borderRadius: theme.radius }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
