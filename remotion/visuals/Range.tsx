import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import type { Theme } from "../types";

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

// "₹ Lakh" -> "₹30 Lakh"; anything else -> "30 Lakh" / "30 kg" etc.
const formatValue = (value: number, unit: string): string => {
  if (unit.startsWith("₹")) {
    const rest = unit.slice(1).trim();
    return `₹${value} ${rest}`;
  }
  return `${value} ${unit}`;
};

type MarkerLayout = {
  label: string;
  value: number;
  x: number;
  labelX: number;
  side: "above" | "below";
};

const TITLE_H = 90;
const BAND_H = 28;
const TICK_LEN = 14;
const TICK_GAP = 6;
const LABEL_W = 200;
const SHIFT_OVERLAP_THRESHOLD = 0.12; // fraction of span
const SHIFT_PX = 20;

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
  const bandX = 40;
  const bandW = width - 80;
  const bandCenterY = TITLE_H + (height - TITLE_H) / 2;
  const bandTop = bandCenterY - BAND_H / 2;
  const bandBottom = bandCenterY + BAND_H / 2;
  const span = max - min || 1;
  const fill = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pos = (v: number) => bandX + clamp01((v - min) / span) * bandW;

  // Alternate above/below by index, then push either marker in a too-close
  // pair to the opposite side and nudge it sideways so ticks stay legible.
  const layout: MarkerLayout[] = markers.map((m, i) => ({
    label: m.label,
    value: m.value,
    x: pos(m.value),
    labelX: pos(m.value),
    side: i % 2 === 0 ? "above" : "below",
  }));

  for (let i = 1; i < layout.length; i++) {
    for (let j = 0; j < i; j++) {
      const diff = Math.abs(layout[i].value - layout[j].value) / span;
      if (diff < SHIFT_OVERLAP_THRESHOLD) {
        layout[i].side = layout[j].side === "above" ? "below" : "above";
        layout[i].labelX = layout[i].x + SHIFT_PX;
      }
    }
  }

  return (
    <div style={{ width, height, fontFamily: theme.fontBody, position: "relative" }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>

      <div
        style={{
          position: "absolute",
          left: bandX,
          top: bandTop,
          width: bandW,
          height: BAND_H,
          background: theme.paper2,
          borderRadius: theme.radius,
          overflow: "hidden",
        }}
      >
        <div style={{ width: bandW * fill, height: BAND_H, background: theme.accent2, borderRadius: theme.radius }} />
      </div>

      {layout.map((m, i) => {
        const start = 28 + i * 8;
        const local = Math.max(0, frame - start);
        const drop = spring({ frame: local, fps, config: { damping: 14 } });
        const translateY = interpolate(drop, [0, 1], [-16, 0]);
        const opacity = interpolate(local, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const above = m.side === "above";

        const tickTop = above ? bandTop - TICK_LEN : bandBottom;
        const blockY = above ? bandTop - TICK_LEN - TICK_GAP : bandBottom + TICK_LEN + TICK_GAP;

        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: m.x - 1,
                top: tickTop,
                width: 2,
                height: TICK_LEN,
                background: theme.ink,
                opacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: m.labelX,
                top: blockY,
                width: LABEL_W,
                transform: `translate(-50%, ${above ? "-100%" : "0"}) translateY(${translateY}px)`,
                opacity,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  color: theme.ink,
                  lineHeight: 1.15,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontFamily: theme.fontMono,
                  fontSize: 30,
                  color: theme.ink,
                  fontVariantNumeric: "tabular-nums",
                  marginTop: 4,
                }}
              >
                {formatValue(m.value, unit)}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
