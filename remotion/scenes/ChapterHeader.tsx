import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ChapterHeaderProps {
  chapterIndex: number;
  totalChapters: number;
  chapterTitle: string;
  partName: string;
}

export const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  chapterIndex,
  totalChapters,
  chapterTitle,
  partName,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enter = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const translateY = interpolate(enter, [0, 1], [-20, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        left: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        transform: `translateY(${translateY}px)`,
        opacity,
        zIndex: 80,
        pointerEvents: "none",
      }}
    >
      {/* Part Tag */}
      <div
        style={{
          backgroundColor: "#1F2421",
          color: "#E05A2B",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 2,
          padding: "5px 12px",
          borderRadius: 4,
          border: "1px solid rgba(224, 90, 43, 0.4)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textTransform: "uppercase",
        }}
      >
        {partName.split("·")[0].trim()}
      </div>

      {/* Chapter Number & Title */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(6px)",
          color: "#1F2421",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 1.5,
          padding: "5px 14px",
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: "#E05A2B", fontWeight: 900 }}>
          {String(chapterIndex + 1).padStart(2, "0")}
        </span>
        <span style={{ color: "#7F8C8D" }}>/</span>
        <span style={{ color: "#7F8C8D" }}>{totalChapters}</span>
        <span style={{ color: "#BDC3C7", margin: "0 2px" }}>•</span>
        <span style={{ color: "#2B2B2B" }}>{chapterTitle}</span>
      </div>
    </div>
  );
};
