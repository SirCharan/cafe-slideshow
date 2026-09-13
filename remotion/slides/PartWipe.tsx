import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../types";
import { clamp01 } from "../anim";
import { Underline } from "../visuals/marker";

const NUMERAL_FRAMES = 8;
const RULE_FRAMES = [4, 26] as const;

const stripPrefix = (part: string): string => part.replace(/^PART\s+\d+\s*·\s*/i, "");

/** v2 divider: cream board, a rough numeral popping in, hand-lettered title, rough rule underneath. */
export const PartWipe: React.FC<{ theme: Theme; part: string; partNumber: number }> = ({ theme, part, partNumber }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const pop = clamp01(frame / NUMERAL_FRAMES);
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const opacity = interpolate(pop, [0, 1], [0, 1]);
  const ruleProgress = interpolate(frame, [...RULE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const title = stripPrefix(part);
  const ruleWidth = width * 0.3;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontWeight: 300,
          fontSize: 300,
          color: theme.accent,
          lineHeight: 1,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {partNumber}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: theme.fontDisplay,
          fontSize: 42,
          fontWeight: 700,
          letterSpacing: 1,
          color: theme.ink,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <svg width={ruleWidth} height={20} style={{ marginTop: 32 }}>
        <Underline x={0} y={8} width={ruleWidth * ruleProgress} progress={ruleProgress} theme={theme} color={theme.accent} />
      </svg>
    </AbsoluteFill>
  );
};
