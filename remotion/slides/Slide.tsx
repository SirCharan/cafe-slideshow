import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Slide as SlideData, Theme, Visual } from "../types";
import { SlideVisual } from "../visuals";
import { clamp01, countUp, enter, sentenceAt, stagger } from "../anim";
import { Captions } from "./Captions";

const VISUAL_WIDTH_RATIO = 0.46;
const COUNT_UP_FRAMES = 20;

// Texture only — a repeating pattern standing in for paper grain, never a decorative gradient.
const backgroundTexture = (theme: Theme): React.CSSProperties =>
  theme.name === "ledger"
    ? {
        backgroundColor: theme.paper,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, ${theme.line} 39px, ${theme.line} 40px)`,
      }
    : {
        backgroundColor: theme.paper,
        backgroundImage: `radial-gradient(${theme.line} 1.6px, transparent 1.6px)`,
        backgroundSize: "30px 30px",
      };

const fallbackVisual = (slideData: SlideData): Visual =>
  slideData.visual ?? { type: "photo", src: slideData.image, caption: slideData.headline };

export const ChapterSlide: React.FC<{
  slide: SlideData;
  theme: Theme;
  captions: boolean;
  sentenceStartFrames: number[];
}> = ({ slide, theme, captions, sentenceStartFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const activeSentence = sentenceAt(frame, sentenceStartFrames);
  const activeBullet = Math.min(activeSentence, Math.max(slide.bullets.length - 1, 0));

  const chip = spring({ frame, fps, config: { damping: 12, mass: 0.7 } });
  const chipScale = interpolate(chip, [0, 1], [0.6, 1]);
  const chipRotate = -4;

  const headlineWords = slide.headline.split(" ");

  const visualWidth = Math.round(width * VISUAL_WIDTH_RATIO) - 120;
  const visualHeight = height - 460;

  return (
    <AbsoluteFill style={backgroundTexture(theme)}>
      <div style={{ position: "absolute", inset: 0, padding: "56px 72px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ fontFamily: theme.fontMono, color: theme.mute, fontSize: 22, letterSpacing: 2 }}>
            {slide.part.toUpperCase()} · {String(slide.index).padStart(2, "0")}
          </div>
          <div
            style={{
              fontFamily: theme.fontBody,
              fontSize: 24,
              fontWeight: 600,
              color: theme.paper,
              backgroundColor: theme.accent,
              borderRadius: theme.radius,
              padding: "10px 22px",
              transform: `scale(${chipScale}) rotate(${chipRotate}deg)`,
              transformOrigin: "top right",
            }}
          >
            {slide.chip}
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            fontFamily: theme.fontDisplay,
            fontSize: 78,
            lineHeight: 1.08,
            color: theme.ink,
            fontWeight: 600,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 20px",
            position: "relative",
          }}
        >
          {headlineWords.map((word, i) => {
            const w = enter(frame, stagger(i, 3), fps);
            return (
              <span
                key={i}
                style={{ display: "inline-block", opacity: w.opacity, transform: `translateY(${w.translateY}px)` }}
              >
                {word}
              </span>
            );
          })}
          {theme.strokeStyle === "marker" && (
            <MarkerUnderline theme={theme} frame={frame} width={Math.min(880, headlineWords.join(" ").length * 24)} />
          )}
        </div>

        <div style={{ marginTop: 44, display: "flex", gap: 48 }}>
          <div
            style={{
              width: visualWidth,
              backgroundColor: theme.paper2,
              borderRadius: theme.radius,
              padding: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SlideVisual
              visual={fallbackVisual(slide)}
              theme={theme}
              frame={frame}
              activeSentence={activeSentence}
              width={visualWidth - 56}
              height={visualHeight}
            />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 22, paddingTop: 8 }}>
            {slide.bullets.map((bullet, i) => {
              const delay = sentenceStartFrames[Math.min(i, Math.max(sentenceStartFrames.length - 1, 0))] ?? 0;
              const b = enter(frame, delay, fps);
              const isActive = i === activeBullet;
              const countProgress = clamp01((frame - delay) / COUNT_UP_FRAMES);
              const text = isActive ? countUp(bullet, countProgress) : bullet;
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    opacity: b.opacity,
                    transform: `translateY(${b.translateY}px)`,
                    paddingLeft: 22,
                    borderLeft: `4px solid ${isActive ? theme.accent : "transparent"}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: theme.fontBody,
                      fontSize: 32,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? theme.ink : theme.mute,
                    }}
                  >
                    {text}
                  </span>
                  {theme.strokeStyle === "marker" && isActive && (
                    <RoughCircle theme={theme} frame={frame} delay={delay} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {captions && <Captions theme={theme} text={slide.sentences[activeSentence] ?? ""} />}
    </AbsoluteFill>
  );
};

const MarkerUnderline: React.FC<{ theme: Theme; frame: number; width: number }> = ({ theme, frame, width }) => {
  const length = 900;
  const progress = interpolate(frame, [16, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg
      width={width}
      height={20}
      style={{ position: "absolute", left: 4, bottom: -10 }}
      viewBox={`0 0 ${width} 20`}
    >
      <path
        d={`M2 12 Q ${width / 2} 20, ${width - 2} 8`}
        fill="none"
        stroke={theme.accent}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - progress)}
      />
    </svg>
  );
};

const RoughCircle: React.FC<{ theme: Theme; frame: number; delay: number }> = ({ theme, frame, delay }) => {
  const progress = interpolate(frame, [delay, delay + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const length = 620;
  return (
    <svg
      width="100%"
      height={72}
      style={{ position: "absolute", left: -12, top: -18, pointerEvents: "none" }}
      viewBox="0 0 620 72"
      preserveAspectRatio="none"
    >
      <ellipse
        cx={310}
        cy={36}
        rx={300}
        ry={30}
        fill="none"
        stroke={theme.accent}
        strokeWidth={5}
        strokeDasharray={length}
        strokeDashoffset={length * (1 - progress)}
      />
    </svg>
  );
};
