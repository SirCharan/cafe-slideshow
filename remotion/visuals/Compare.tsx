import React from "react";
import { interpolate } from "remotion";
import type { Theme } from "../types";
import { Stroke } from "./marker";

export const Compare: React.FC<{
  title: string;
  left: { title: string; rows: string[] };
  right: { title: string; rows: string[] };
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ title, left, right, theme, frame, width, height }) => {
  const midX = width / 2;
  const dividerLen = height - 140;
  const dividerProgress = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rowH = 56;
  const topY = 150;

  const col = (side: "left" | "right", data: { title: string; rows: string[] }) => (
    <div style={{ position: "absolute", top: 0, [side === "left" ? "left" : "right"]: 0, width: midX - 30 }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 36, color: theme.ink }}>{data.title}</div>
      {data.rows.map((row, i) => {
        const start = 18 + i * 5;
        const local = frame - start;
        const opacity = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fromX = side === "left" ? -40 : 40;
        const x = interpolate(local, [0, 10], [fromX, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: topY + i * rowH,
              left: 0,
              right: 0,
              fontSize: 28,
              color: theme.inkSoft,
              opacity,
              transform: `translateX(${x}px)`,
            }}
          >
            {row}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ width, height, fontFamily: theme.fontBody, position: "relative" }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, textAlign: "center" }}>{title}</div>
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <Stroke d={`M ${midX} 130 L ${midX} ${130 + dividerLen}`} length={dividerLen} progress={dividerProgress} theme={theme} color={theme.line} width={2} />
      </svg>
      <div style={{ position: "absolute", top: 90, left: 0, width, height: height - 90 }}>
        {col("left", left)}
        {col("right", right)}
      </div>
    </div>
  );
};
