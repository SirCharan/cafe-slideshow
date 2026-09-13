import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../types";
import { clamp01 } from "../anim";

const COUNT_FRAMES = 12;

const stripPrefix = (part: string): string => part.replace(/^PART\s+\d+\s*·\s*/i, "");

export const PartDivider: React.FC<{ theme: Theme; part: string; partNumber: number }> = ({
  theme,
  part,
  partNumber,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const countProgress = clamp01(frame / COUNT_FRAMES);
  const displayedNumber = Math.round(countProgress * partNumber);
  const ruleProgress = interpolate(frame, [4, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const title = stripPrefix(part);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.paper2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontSize: 320,
          fontWeight: 700,
          color: theme.accent,
          lineHeight: 1,
        }}
      >
        {displayedNumber}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: theme.fontBody,
          fontSize: 42,
          fontWeight: 600,
          letterSpacing: 1,
          color: theme.ink,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 40,
          height: 4,
          width: width * 0.3 * ruleProgress,
          backgroundColor: theme.accent,
        }}
      />
    </AbsoluteFill>
  );
};
