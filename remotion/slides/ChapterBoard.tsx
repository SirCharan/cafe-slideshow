import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Slide as SlideData, Theme } from "../types";
import { clamp01, sentenceAt } from "../anim";
import { drawProgress } from "../board/timing";
import { Board } from "../board/Board";
import { Underline } from "../visuals/marker";
import { Captions } from "./Captions";

const TYPE_FRAMES = 18;
const UNDERLINE_FRAMES = 12;
const NOISE_ID = "cafe-board-noise";

/** Faint SVG grain over the cream paper, no ruled lines (v2 chapter frame). */
const PaperNoise: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <filter id={NOISE_ID}>
      <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </svg>
);

export const ChapterBoard: React.FC<{
  slide: SlideData;
  theme: Theme;
  captions: boolean;
  sentenceStartFrames: number[];
}> = ({ slide, theme, captions, sentenceStartFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const activeSentence = sentenceAt(frame, sentenceStartFrames);
  const captionText = slide.sentences[activeSentence] ?? "";

  const typedChars = Math.floor(clamp01(frame / TYPE_FRAMES) * slide.headline.length);
  const headlineShown = slide.headline.slice(0, typedChars);
  const underlineProgress = drawProgress(frame, TYPE_FRAMES, UNDERLINE_FRAMES);

  const board = slide.board;
  const camFocus = board?.camera?.focus ?? [width / 2, height / 2];
  // Slow push over the whole slide (frame range set by the caller's durationInFrames via the
  // TransitionSeries.Sequence, which we don't know here, so approximate with a long ramp that
  // clamps once it reaches 1.03 — good enough for a several-second chapter).
  const push = interpolate(frame, [0, 260], [1, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      <PaperNoise />
      <AbsoluteFill style={{ opacity: 0.03, filter: `url(#${NOISE_ID})`, backgroundColor: "#000" }} />
      {board && (
        // Safety net: even if a board element is ever authored (or the camera push ever
        // scales) into the headline band, clip it at y >= 150 so it can never bleed over
        // the headline.
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: -100, // board y=170 lands at 220px, clear of the headline underline (~200px)
              left: 0,
              right: 0,
              bottom: 0,
              transform: `scale(${push})`,
              transformOrigin: `${camFocus[0]}px ${camFocus[1]}px`,
            }}
          >
            <Board board={board} frame={frame} sentenceStartFrames={sentenceStartFrames} fps={fps} seedBase={slide.id} />
          </div>
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, padding: "48px 72px 0", pointerEvents: "none" }}>
        <div style={{ fontFamily: theme.fontMono, color: theme.mute, fontSize: 22, letterSpacing: 2 }}>
          {slide.part.toUpperCase()} · CH {String(slide.index).padStart(2, "0")}
        </div>

        {/* Headline band: y 40-130 (48px top padding + up to ~90px of type), overflow-hidden so
            it can never grow tall enough to overlap board elements, which the data rule keeps
            at y >= 150. Board itself is unscaled (1:1 board->px coordinates); only the slow
            camera push below changes, and that starts at exactly 1.0. */}
        <div style={{ marginTop: 20, position: "relative", display: "inline-block" }}>
          <div style={{ height: 90, overflow: "hidden" }}>
            <span
              style={{
                fontFamily: theme.fontDisplay,
                fontWeight: 700,
                fontSize: 64,
                lineHeight: 1.1,
                color: theme.ink,
              }}
            >
              {headlineShown}
            </span>
          </div>
          {underlineProgress > 0 && (
            <svg
              width={Math.max(1, Math.round(slide.headline.length * 34))}
              height={40}
              style={{ position: "absolute", left: 0, top: "100%" }}
            >
              <Underline x={0} y={16} width={Math.round(slide.headline.length * 30 * underlineProgress)} progress={underlineProgress} theme={theme} color={theme.accent} />
            </svg>
          )}
        </div>
      </div>

      {captions && <Captions theme={theme} text={captionText} />}
    </AbsoluteFill>
  );
};
