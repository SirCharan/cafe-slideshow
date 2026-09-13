import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import rawSlides from "../data/slides.json";
import { ensureFonts, fontLoadPromise } from "./fonts";
import { getTheme } from "./theme";
import { DIVIDER_SECONDS, FPS, TRANSITION_FRAMES } from "./types";
import type { EpisodeProps, Slide as SlideData, Theme, Timeline, TimelineItem } from "./types";
import type { El } from "./board/types";
import { elementStartFrame } from "./board/timing";
import { ChapterSlide } from "./slides/Slide";
import { ChapterBoard } from "./slides/ChapterBoard";
import { ColdOpen } from "./slides/ColdOpen";
import { EndCard } from "./slides/EndCard";
import { PartWipe } from "./slides/PartWipe";

// SFX kinds that skip the squeak sound (silent draws / effects with their own cue).
const NO_SQUEAK_KINDS: ReadonlySet<El["kind"]> = new Set(["erase", "highlight", "component"]);
const MIN_SFX_GAP_FRAMES = 6; // at most one squeak per 6 frames per slide

// Placeholders until scripts/gen-vo.mjs fills in a real `duration` for these kinds.
const COLD_OPEN_SECONDS = 8;
const END_CARD_SECONDS = 6;
const MIN_SLIDE_FRAMES = 90;

export const getSlides = (): SlideData[] =>
  [...(rawSlides as SlideData[])].sort((a, b) => a.index - b.index);

const slideDurationFrames = (slideData: SlideData): number => {
  if (slideData.duration > 0) {
    return Math.max(MIN_SLIDE_FRAMES, Math.round(slideData.duration * FPS));
  }
  if (slideData.kind === "cold_open") return Math.round(COLD_OPEN_SECONDS * FPS);
  if (slideData.kind === "end_card") return Math.round(END_CARD_SECONDS * FPS);
  return MIN_SLIDE_FRAMES;
};

const sentenceFrames = (slideData: SlideData, startFrame: number, durationFrames: number): number[] => {
  const count = slideData.sentences?.length ?? 0;
  if (count === 0) return [];
  if (slideData.sentence_timings && slideData.sentence_timings.length > 0) {
    return [...slideData.sentence_timings]
      .sort((a, b) => a.sentence_idx - b.sentence_idx)
      .map((t) => startFrame + Math.round(t.local_start * FPS));
  }
  return Array.from({ length: count }, (_, i) => startFrame + Math.round((i * durationFrames) / count));
};

export const buildTimeline = (slides: SlideData[]): Timeline => {
  const items: TimelineItem[] = [];
  let prevPart: string | undefined;
  let partNumber = 0;

  slides.forEach((slideData, slideIndex) => {
    const kind = slideData.kind ?? "chapter";
    if (kind === "chapter" && slideData.part !== prevPart) {
      partNumber += 1;
      items.push({
        kind: "divider",
        part: slideData.part,
        partNumber,
        startFrame: 0,
        durationFrames: Math.round(DIVIDER_SECONDS * FPS),
        sentenceStartFrames: [],
      });
    }
    prevPart = slideData.part;
    items.push({
      kind: "slide",
      slideIndex,
      startFrame: 0,
      durationFrames: slideDurationFrames(slideData),
      sentenceStartFrames: [],
    });
  });

  let cumulative = 0;
  items.forEach((item, i) => {
    item.startFrame = cumulative - i * TRANSITION_FRAMES;
    cumulative += item.durationFrames;
  });

  items.forEach((item) => {
    if (item.kind === "slide" && item.slideIndex !== undefined) {
      item.sentenceStartFrames = sentenceFrames(slides[item.slideIndex], item.startFrame, item.durationFrames);
    }
  });

  const last = items[items.length - 1];
  const totalFrames = last ? last.startFrame + last.durationFrames : 0;

  return { items, totalFrames };
};

const renderTimelineItem = (item: TimelineItem, slides: SlideData[], theme: Theme, captions: boolean) => {
  if (item.kind === "divider") {
    return <PartWipe theme={theme} part={item.part ?? ""} partNumber={item.partNumber ?? 0} />;
  }
  const slideData = slides[item.slideIndex ?? 0];
  const localSentenceStarts = item.sentenceStartFrames.map((f) => f - item.startFrame);
  const kind = slideData.kind ?? "chapter";
  if (kind === "cold_open") {
    return <ColdOpen slide={slideData} theme={theme} sentenceStartFrames={localSentenceStarts} durationFrames={item.durationFrames} />;
  }
  if (kind === "end_card") {
    return <EndCard slide={slideData} theme={theme} durationFrames={item.durationFrames} />;
  }
  if (slideData.board) {
    return <ChapterBoard slide={slideData} theme={theme} captions={captions} sentenceStartFrames={localSentenceStarts} />;
  }
  return (
    <ChapterSlide
      slide={slideData}
      theme={theme}
      captions={captions}
      sentenceStartFrames={localSentenceStarts}
    />
  );
};

/** Slide-local absolute frames (relative to the slide's own start) at which each of its
 * board elements begins drawing, for squeak SFX — capped to one per MIN_SFX_GAP_FRAMES. */
const boardSfxFrames = (slideData: SlideData, localSentenceStarts: number[]): { frame: number; index: number; isErase: boolean }[] => {
  if (!slideData.board) return [];
  const out: { frame: number; index: number; isErase: boolean }[] = [];
  let lastFrame = -Infinity;
  slideData.board.elements.forEach((el, i) => {
    const isErase = el.kind === "erase";
    if (!isErase && NO_SQUEAK_KINDS.has(el.kind)) return;
    const frame = elementStartFrame(el, localSentenceStarts, FPS);
    if (frame - lastFrame < MIN_SFX_GAP_FRAMES) return;
    lastFrame = frame;
    out.push({ frame, index: i, isErase });
  });
  return out;
};

export const Episode: React.FC<EpisodeProps> = ({ theme: themeName, captions, muted }) => {
  const theme = getTheme(themeName);
  const slides = useMemo(() => getSlides(), []);
  const timeline = useMemo(() => buildTimeline(slides), [slides]);
  const [handle] = useState<number | null>(() => (typeof document === "undefined" ? null : delayRender("Loading fonts")));

  useEffect(() => {
    ensureFonts();
    if (handle === null) return;
    fontLoadPromise()
      .catch(() => undefined)
      .finally(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.paper }}>
      <TransitionSeries>
        {timeline.items.map((item, i) => {
          const isLast = i === timeline.items.length - 1;
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={item.durationFrames}>
                {renderTimelineItem(item, slides, theme, captions)}
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={wipe({ direction: "from-left" })}
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {!muted &&
        timeline.items.map((item, i) => {
          if (item.kind === "divider") {
            return (
              <Sequence key={`audio-${i}`} from={item.startFrame}>
                <Audio src={staticFile("audio/beat_pause.mp3")} />
              </Sequence>
            );
          }
          const slideData = slides[item.slideIndex ?? 0];
          const localSentenceStarts = item.sentenceStartFrames.map((f) => f - item.startFrame);
          const sfx = boardSfxFrames(slideData, localSentenceStarts);
          return [
            ...slideData.sentences.map((_, sIdx) => (
              <Sequence key={`audio-${i}-${sIdx}`} from={item.sentenceStartFrames[sIdx] ?? item.startFrame}>
                <Audio src={staticFile(`audio/${slideData.id}_s${sIdx}.wav`)} />
              </Sequence>
            )),
            ...sfx.map((s) => (
              <Sequence key={`sfx-${i}-${s.index}`} from={item.startFrame + s.frame}>
                <Audio
                  src={staticFile(s.isErase ? "audio/sfx/erase.wav" : `audio/sfx/squeak-${(s.index % 3) + 1}.wav`)}
                  volume={0.35}
                />
              </Sequence>
            )),
          ];
        })}
    </AbsoluteFill>
  );
};
