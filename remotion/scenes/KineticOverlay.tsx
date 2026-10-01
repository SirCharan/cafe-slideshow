import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface KineticOverlayProps {
  badge?: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
  highlightMetric?: {
    value: string;
    label: string;
    color?: string;
  };
  align?: "left" | "right" | "center";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

export const KineticOverlay: React.FC<KineticOverlayProps> = ({
  badge,
  badgeColor = "#E05A2B",
  title,
  subtitle,
  highlightMetric,
  align = "left",
  top,
  bottom,
  left,
  right,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth entrance spring
  const progress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const translateY = interpolate(progress, [0, 1], [30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const metricScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        textAlign: align,
        transform: `translateY(${translateY}px)`,
        opacity,
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      {badge && (
        <div
          style={{
            backgroundColor: badgeColor,
            color: "#FFF",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: 4,
            marginBottom: 8,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          {badge}
        </div>
      )}

      {/* Main Title Banner */}
      <div
        style={{
          backgroundColor: "#1F2421",
          color: "#F7F5F0",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 32,
          fontWeight: 900,
          letterSpacing: 1.5,
          padding: "14px 24px",
          borderRadius: 6,
          border: `3px solid ${badgeColor}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
        }}
      >
        {title}
      </div>

      {/* Optional Large Metric Punch Card */}
      {highlightMetric && (
        <div
          style={{
            marginTop: 8,
            backgroundColor: "#111413",
            border: `2px solid ${highlightMetric.color || badgeColor}`,
            padding: "10px 20px",
            borderRadius: 6,
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            transform: `scale(${interpolate(metricScale, [0, 1], [0.9, 1.0])})`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 36,
              fontWeight: 900,
              color: highlightMetric.color || "#F4D03F",
              letterSpacing: 1,
            }}
          >
            {highlightMetric.value}
          </span>
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14,
              fontWeight: 800,
              color: "#BDC3C7",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {highlightMetric.label}
          </span>
        </div>
      )}

      {/* Subtitle Explainer */}
      {subtitle && (
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.94)",
            color: "#2B2B2B",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 0.8,
            padding: "8px 18px",
            borderRadius: 4,
            marginTop: 6,
            border: "2px solid #2B2B2B",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            maxWidth: 680,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
