import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface ChapterBarProps {
  currentChapterIdx: number;
  totalChapters: number;
  chapterTitle: string;
  partName: string;
}

export const ChapterBar: React.FC<ChapterBarProps> = ({
  currentChapterIdx,
  totalChapters,
  chapterTitle,
  partName,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progress 0 to 1 across entire episode
  const overallProgress = Math.min(1, Math.max(0, frame / durationInFrames));

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 1920,
        pointerEvents: "none",
        zIndex: 90,
      }}
    >
      {/* 1. Subtle Bottom Information Strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 48px 14px 48px",
          backgroundColor: "rgba(28, 30, 33, 0.75)",
          backdropFilter: "blur(8px)",
          color: "#F7F5F0",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              backgroundColor: "#E05A2B",
              color: "#FFF",
              padding: "2px 8px",
              borderRadius: 3,
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            {`CH ${String(currentChapterIdx + 1).padStart(2, "0")} / ${totalChapters}`}
          </span>
          <span style={{ color: "#F7F5F0" }}>{chapterTitle}</span>
        </div>

        <div style={{ color: "#E07A5F", fontWeight: 800 }}>
          {partName}
        </div>
      </div>

      {/* 2. 12-Segment Progress Bar */}
      <div
        style={{
          width: "100%",
          height: 6,
          backgroundColor: "#333",
          display: "flex",
          gap: 2,
        }}
      >
        {Array.from({ length: totalChapters }).map((_, idx) => {
          const segmentStart = idx / totalChapters;
          const segmentEnd = (idx + 1) / totalChapters;
          const segmentProgress = Math.min(
            1,
            Math.max(0, (overallProgress - segmentStart) / (segmentEnd - segmentStart))
          );

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: "100%",
                backgroundColor: "#444",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${segmentProgress * 100}%`,
                  height: "100%",
                  backgroundColor: idx === currentChapterIdx ? "#E05A2B" : "#F1C40F",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
