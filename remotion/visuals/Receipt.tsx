import React from "react";
import { interpolate } from "remotion";
import type { Theme } from "../types";
import { Stroke } from "./marker";

export const Receipt: React.FC<{
  title: string;
  sub?: string;
  lines: { label: string; value: string }[];
  total?: { label: string; value: string };
  note?: string;
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ title, sub, lines, total, note, theme, frame, width, height }) => {
  const pad = 44;
  const lineY = (i: number) => 150 + i * 46;
  const totalY = lineY(lines.length) + 20;

  const perfCount = Math.floor((width - pad * 2) / 18);

  return (
    <div
      style={{
        width,
        height,
        background: theme.paper,
        border: `1px solid ${theme.line}`,
        borderRadius: theme.radius,
        position: "relative",
        overflow: "hidden",
        fontFamily: theme.fontBody,
      }}
    >
      <div style={{ padding: `${pad}px ${pad}px 0` }}>
        <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>
        {sub ? <div style={{ fontSize: 26, color: theme.mute, marginTop: 8 }}>{sub}</div> : null}
      </div>

      {lines.map((line, i) => {
        const start = 10 + i * 8;
        const local = frame - start;
        const opacity = interpolate(local, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(local, [0, 10], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pad,
              right: pad,
              top: lineY(i),
              display: "flex",
              justifyContent: "space-between",
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            <div style={{ fontSize: 30, color: theme.ink }}>{line.label}</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 32, color: theme.inkSoft, fontVariantNumeric: "tabular-nums" }}>
              {line.value}
            </div>
          </div>
        );
      })}

      {total ? (
        <div style={{ position: "absolute", left: pad, right: pad, top: totalY }}>
          <svg width={width - pad * 2} height={14} style={{ overflow: "visible" }}>
            <Stroke
              d={`M 0 6 L ${width - pad * 2} 6`}
              length={width - pad * 2}
              progress={interpolate(frame - (10 + lines.length * 8), [0, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
              theme={theme}
              color={theme.line}
              width={1.5}
            />
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginTop: 18,
              opacity: interpolate(frame - (22 + lines.length * 8), [0, 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ fontSize: 30, color: theme.ink, fontWeight: 600 }}>{total.label}</div>
            <div style={{ fontFamily: theme.fontMono, fontSize: 56, color: theme.accent, fontVariantNumeric: "tabular-nums" }}>
              {total.value}
            </div>
          </div>
        </div>
      ) : null}

      {note ? (
        <div style={{ position: "absolute", left: pad, right: pad, bottom: 48, fontSize: 24, fontStyle: "italic", color: theme.mute }}>
          {note}
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 18,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        {Array.from({ length: perfCount }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: 999, background: theme.paper2 }} />
        ))}
      </div>
    </div>
  );
};
