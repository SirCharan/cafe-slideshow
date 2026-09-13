import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import type { Theme } from "../types";
import { Check } from "./marker";

export const Logos: React.FC<{
  title: string;
  items: { label: string; sub?: string }[];
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ title, items, theme, frame, width, height }) => {
  const { fps } = useVideoConfig();
  const cols = items.length > 4 ? 3 : 2;
  const rows = Math.ceil(items.length / cols);
  const gap = 20;
  const titleReserved = 130; // heuristic reserve for the title row, caps tile size only
  const cardW = (width - gap * (cols - 1)) / cols;
  const cardH = Math.min(140, (height - titleReserved - gap * (rows - 1)) / rows);
  const gridH = rows * cardH + gap * (rows - 1);

  return (
    <div
      style={{
        width,
        height,
        fontFamily: theme.fontBody,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ position: "relative", width: "100%", height: gridH }}>
          {items.map((item, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const start = 8 + i * 5;
            const local = Math.max(0, frame - start);
            const scale = spring({ frame: local, fps, config: { stiffness: 140, damping: 12 }, from: 0.7, to: 1 });
            const opacity = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const checkProgress = interpolate(frame - (start + 14), [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: col * (cardW + gap),
                  top: row * (cardH + gap),
                  width: cardW,
                  height: cardH,
                  background: theme.paper2,
                  borderRadius: theme.radius,
                  opacity,
                  transform: `scale(${scale})`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <div style={{ fontSize: 30, color: theme.ink }}>{item.label}</div>
                {item.sub ? <div style={{ fontSize: 22, color: theme.mute }}>{item.sub}</div> : null}
                {theme.strokeStyle === "marker" ? (
                  <svg width={cardW} height={cardH} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
                    <Check cx={cardW - 26} cy={26} size={22} progress={checkProgress} theme={theme} />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
