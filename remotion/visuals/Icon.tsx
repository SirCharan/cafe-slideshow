import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import type { Theme } from "../types";

// Splits "₹18,000/mo" into prefix "₹", numeric "18000" (comma-free for counting), suffix "/mo".
const parseStat = (stat: string): { prefix: string; digits: string; suffix: string } | null => {
  const match = stat.match(/^(\D*)([\d,]*\d)(.*)$/);
  if (!match) return null;
  const [, prefix, digitsRaw, suffix] = match;
  if (!digitsRaw) return null;
  return { prefix, digits: digitsRaw, suffix };
};

const formatCounted = (digits: string, t: number): string => {
  const target = Number(digits.replace(/,/g, ""));
  const current = Math.round(target * t);
  return current.toLocaleString("en-IN");
};

export const Icon: React.FC<{
  src: string;
  stat: string;
  caption: string;
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ src, stat, caption, theme, frame, width, height }) => {
  const parsed = parseStat(stat);
  const t = interpolate(frame, [6, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const display = parsed ? `${parsed.prefix}${formatCounted(parsed.digits, t)}${parsed.suffix}` : stat;

  return (
    <div style={{ width, height, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 290, height: 210 }}>
        <Img src={staticFile(`assets/${src}`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontSize: 120,
          color: theme.accent,
          fontVariantNumeric: "tabular-nums",
          marginTop: 8,
          lineHeight: 1,
        }}
      >
        {display}
      </div>
      <div style={{ fontSize: 30, color: theme.mute, marginTop: 12, textAlign: "center" }}>{caption}</div>
    </div>
  );
};
