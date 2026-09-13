import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Slide as SlideData, Theme, Visual } from "../types";
import { SlideVisual } from "../visuals";
import { clamp01, countUp, enter, sentenceAt, stagger } from "../anim";
import { Captions } from "./Captions";
import { Underline } from "../visuals/marker";

const VISUAL_WIDTH_RATIO = 0.46;
const COUNT_UP_FRAMES = 20;
// Heuristic only (no DOM measurement, matches visuals/marker.tsx convention):
// fontSize 32 body text at ~1.25 line-height.
const BULLET_ROW_HEIGHT = 40;
const BULLET_UNDERLINE_FRAMES = 12;

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
  // Padding (72px * 2) + visual card + the row gap (48), leaves the bullet column's width.
  const bulletColumnWidth = width - 144 - visualWidth - 48;

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
              flexDirection: "column",
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
              const underlineWidth = Math.min(bulletColumnWidth, 14 * bullet.length * 0.55);
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
                    <BulletUnderline theme={theme} frame={frame} delay={delay} width={underlineWidth} />
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

const BulletUnderline: React.FC<{ theme: Theme; frame: number; delay: number; width: number }> = ({
  theme,
  frame,
  delay,
  width,
}) => {
  const progress = interpolate(frame, [delay, delay + BULLET_UNDERLINE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Text starts after the row's border (4px) + padding (22px).
  const x = 26;
  const y = BULLET_ROW_HEIGHT + 4;
  return (
    <svg
      width={x + width + 12}
      height={y + 16}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        overflow: "visible",
        transform: "rotate(-0.6deg)",
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      <Underline x={x} y={y} width={width} progress={progress} theme={theme} color={theme.accent} />
    </svg>
  );
};
