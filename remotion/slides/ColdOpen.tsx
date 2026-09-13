import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Slide, Theme } from "../types";
import { sentenceAt } from "../anim";

const CHARS_PER_FRAME = 1.2;

const photoSrc = (slideData: Slide): string =>
  slideData.visual?.type === "photo" ? slideData.visual.src : slideData.image;

export const ColdOpen: React.FC<{
  slide: Slide;
  theme: Theme;
  sentenceStartFrames: number[];
  durationFrames: number;
}> = ({ slide, theme, sentenceStartFrames, durationFrames }) => {
  const frame = useCurrentFrame();
  const kenBurns = interpolate(frame, [0, Math.max(durationFrames, 1)], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(`assets/${photoSrc(slide)}`)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${kenBurns})`,
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 640,
          backgroundColor: theme.paper,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 56px",
        }}
      >
        <div
          style={{
            fontFamily: theme.fontMono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            color: theme.accent,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Not a Startup
        </div>
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 46,
            lineHeight: 1.25,
            color: theme.ink,
            minHeight: 220,
          }}
        >
          {revealed}
        </div>
      </div>
    </AbsoluteFill>
  );
};
