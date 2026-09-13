import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { Slide, Theme } from "../types";
import { enter } from "../anim";
import { Board } from "../board/Board";

const normalizeText = (s: string): string => s.trim().toLowerCase().replace(/[.!?]+$/, "");

export const EndCard: React.FC<{ slide: Slide; theme: Theme; durationFrames: number }> = ({ slide, theme }) => {
  const frame = useCurrentFrame();
  const headline = enter(frame, 6, 30);
  const brandOpacity = interpolate(frame, [40, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The insight is rendered once, as the centered headline below. Drop any board element
  // (typically a `label`) whose text duplicates it, so it doesn't also appear inside the board.
  const board = useMemo(() => {
    if (!slide.board) return undefined;
    const headlineNorm = normalizeText(slide.headline);
    return {
      ...slide.board,
      elements: slide.board.elements.filter((el) => {
        const text = (el as { text?: string }).text;
        return !text || normalizeText(text) !== headlineNorm;
      }),
    };
  }, [slide.board, slide.headline]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      {/* Board elements are authored at y 170-940; push the whole board down and shrink it so
          it lands at roughly y 320-960, clear of the headline band below. */}
      {board && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: "translate(0, 150px) scale(0.78)",
            transformOrigin: "top center",
          }}
        >
          <Board board={board} frame={frame} sentenceStartFrames={[]} fps={30} seedBase={slide.id} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          height: 140,
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
            marginTop: 24,
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
      </div>
    </AbsoluteFill>
  );
};
