import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface PartTransitionCardProps {
  partNumber: string;
  title: string;
  subtitle: string;
  themeColor?: string;
}

export const PartTransitionCard: React.FC<PartTransitionCardProps> = ({
  partNumber,
  title,
  subtitle,
  themeColor = "#E05A2B",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring (first 20 frames)
  const enter = spring({ frame, fps, config: { damping: 14 } });

  // Exit wipe (last 15 frames)
  const exitProgress = interpolate(frame, [fps * 1.5 - 15, fps * 1.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(enter, [0, 1], [0.95, 1.0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * (1 - exitProgress);
  const slideY = interpolate(exitProgress, [0, 1], [0, -60]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 1080,
        backgroundColor: "rgba(28, 30, 33, 0.94)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale}) translateY(${slideY}px)`,
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {/* Accent Top Border */}
      <div style={{ width: 140, height: 8, backgroundColor: themeColor, borderRadius: 4, marginBottom: 24 }} />

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 24,
          fontWeight: 900,
          color: themeColor,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {partNumber}
      </div>

      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 64,
          fontWeight: 900,
          color: "#F7F5F0",
          letterSpacing: 2,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 24,
          fontWeight: 600,
          color: "#B2BABB",
          letterSpacing: 1.5,
          marginTop: 14,
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
