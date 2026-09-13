import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Slide, Theme } from "../types";
import { enter } from "../anim";

export const EndCard: React.FC<{ slide: Slide; theme: Theme; durationFrames: number }> = ({ slide, theme }) => {
  const frame = useCurrentFrame();
  const headline = enter(frame, 6, 30);
  const seriesOpacity = interpolate(frame, [24, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [40, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 200px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: theme.fontDisplay,
          fontSize: 64,
          fontWeight: 600,
          color: theme.ink,
          opacity: headline.opacity,
          transform: `translateY(${headline.translateY}px)`,
        }}
      >
        {slide.headline}
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: theme.fontBody,
          fontSize: 30,
          color: theme.mute,
          opacity: seriesOpacity,
        }}
      >
        {slide.chip}
      </div>
      <div
        style={{
          marginTop: 56,
          fontFamily: theme.fontMono,
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: theme.accent,
          opacity: brandOpacity,
        }}
      >
        Not a Startup
      </div>
    </AbsoluteFill>
  );
};
