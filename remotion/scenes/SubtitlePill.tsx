import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SubtitlePillProps {
  text: string;
  highlightWords?: string[];
}

export const SubtitlePill: React.FC<SubtitlePillProps> = ({
  text,
  highlightWords = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enter = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const translateY = interpolate(enter, [0, 1], [15, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Words formatting with highlights
  const words = text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        bottom: 72,
        left: 0,
        width: 1920,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 85,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(18, 22, 20, 0.90)",
          backdropFilter: "blur(10px)",
          border: "1.5px solid rgba(255, 255, 255, 0.16)",
          padding: "10px 28px",
          borderRadius: 8,
          maxWidth: 1200,
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)",
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 22,
            fontWeight: 800,
            lineHeight: 1.45,
            letterSpacing: 0.4,
            color: "#F7F5F0",
          }}
        >
          {words.map((word, idx) => {
            const cleanWord = word.replace(/[.,:;—"']/g, "");
            const isHighlight = highlightWords.some(
              (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
            );

            return (
              <span
                key={idx}
                style={{
                  color: isHighlight ? "#F4D03F" : "#F7F5F0",
                  textShadow: isHighlight
                    ? "0 0 12px rgba(244, 208, 63, 0.6)"
                    : "none",
                  marginRight: 6,
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};
