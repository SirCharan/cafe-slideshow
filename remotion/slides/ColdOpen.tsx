import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Slide, Theme } from "../types";
import { sentenceAt } from "../anim";
import { Board } from "../board/Board";

const CHARS_PER_FRAME = 1.2;

/** v2: the cold open is the first board on the same cream paper — no photo, no typewriter panel. */
export const ColdOpen: React.FC<{
  slide: Slide;
  theme: Theme;
  sentenceStartFrames: number[];
  durationFrames: number;
}> = ({ slide, theme, sentenceStartFrames }) => {
  const frame = useCurrentFrame();
  const activeSentence = sentenceAt(frame, sentenceStartFrames);
  const sentence = slide.sentences[activeSentence] ?? slide.headline;
  const sentenceStart = sentenceStartFrames[activeSentence] ?? 0;
  const localFrame = frame - sentenceStart;

  const revealed =
    activeSentence === 0
      ? sentence.slice(0, Math.max(0, Math.floor(localFrame * CHARS_PER_FRAME)))
      : sentence;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      {slide.board && (
        <Board board={slide.board} frame={frame} sentenceStartFrames={sentenceStartFrames} fps={30} seedBase={slide.id} />
      )}
      <div
        style={{
          fontFamily: theme.fontMono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 4,
          color: theme.accent,
          textTransform: "uppercase",
          position: "absolute",
          top: 16,
          left: 72,
          right: 72,
        }}
      >
        Not a Startup
      </div>
      {/* Headline pinned to a fixed 60-150 band (overflow-hidden) so a long narration sentence
          can never grow tall enough to invade the board's label elements, which the data rule
          keeps at y >= 250 on this slide (comfortably clear of 150 either way). */}
      <div style={{ position: "absolute", top: 60, left: 72, right: 72, height: 90, overflow: "hidden" }}>
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 36,
            lineHeight: 1.2,
            color: theme.ink,
            maxWidth: 900,
          }}
        >
          {revealed}
        </div>
      </div>
    </AbsoluteFill>
  );
};
