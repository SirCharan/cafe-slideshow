import { DRAW_SECONDS_PER_1000PX, type El } from "./types";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Frame (local to the slide) at which an element starts drawing. */
export const elementStartFrame = (el: El, sentenceStartFrames: number[], fps: number): number => {
  if (sentenceStartFrames.length === 0) return Math.round((el.delay ?? 0) * fps);
  const idx = Math.max(0, Math.min(el.at, sentenceStartFrames.length - 1));
  return sentenceStartFrames[idx] + Math.round((el.delay ?? 0) * fps);
};

/** Default draw duration in frames from the element's size (path-length based renderers may override). */
export const defaultDrawFrames = (el: El, fps: number): number => {
  if (el.duration) return Math.round(el.duration * fps);
  const w = el.w ?? 200, h = el.h ?? 200;
  const approxLen = 2 * (w + h);
  return Math.max(8, Math.round((approxLen / 1000) * DRAW_SECONDS_PER_1000PX * fps));
};

/** Draw-on progress 0..1 given slide-local frame. */
export const drawProgress = (frame: number, start: number, durFrames: number): number =>
  clamp01((frame - start) / Math.max(1, durFrames));

/** Characters visible for a typewriter label. */
export const typedChars = (text: string, localFrame: number, fps: number, cps: number): number =>
  Math.max(0, Math.min(text.length, Math.floor((Math.max(0, localFrame) / fps) * cps)));
