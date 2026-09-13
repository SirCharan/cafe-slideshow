// Small pure-function animation helpers shared by every slide component.
// Every value here is a function of `frame` — no timers, no refs.
import { interpolate, spring } from "remotion";

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export interface EnterState {
  translateY: number;
  opacity: number;
  scale: number;
  progress: number;
}

/** Spring-based translate-up + fade-in, starting `delay` frames into the slide. */
export const enter = (frame: number, delay: number, fps: number): EnterState => {
  const local = Math.max(0, frame - delay);
  const progress = spring({ frame: local, fps, config: { damping: 200, mass: 0.6 } });
  return {
    translateY: interpolate(progress, [0, 1], [26, 0]),
    opacity: interpolate(progress, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    scale: interpolate(progress, [0, 1], [0.96, 1]),
    progress,
  };
};

/** Frame delay for the i-th item in a staggered list. */
export const stagger = (index: number, framesApart = 3): number => index * framesApart;

const CURRENCY_RE = /₹\s?[\d.,]+(?:–[\d.,]+)?/;

const formatCounted = (numText: string, progress: number): string => {
  const target = parseFloat(numText.replace(/,/g, ""));
  if (Number.isNaN(target)) return numText;
  const decimals = numText.includes(".") ? numText.split(".")[1].length : 0;
  const current = target * clamp01(progress);
  let formatted = current.toFixed(decimals);
  if (numText.includes(",")) {
    const [intPart, decPart] = formatted.split(".");
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    formatted = decPart ? `${grouped}.${decPart}` : grouped;
  }
  return formatted;
};

/**
 * Finds the first ₹ figure in `text` and interpolates its digits from 0 up to
 * the real value as `progress` goes 0→1, keeping every surrounding word intact.
 * Ranges like "₹5–6 Lakh" animate both sides together.
 */
export const countUp = (text: string, progress: number): string => {
  const match = text.match(CURRENCY_RE);
  if (!match) return text;
  const full = match[0];
  const prefix = full.match(/^₹\s?/)?.[0] ?? "₹";
  const rest = full.slice(prefix.length);
  const animated = rest
    .split("–")
    .map((part) => formatCounted(part, progress))
    .join("–");
  return text.slice(0, match.index) + prefix + animated + text.slice((match.index ?? 0) + full.length);
};

/** Index of the sentence active at `frame`, given local (slide-relative) sentence start frames. */
export const sentenceAt = (frame: number, sentenceStartFrames: number[]): number => {
  let active = 0;
  for (let i = 0; i < sentenceStartFrames.length; i += 1) {
    if (frame >= sentenceStartFrames[i]) active = i;
  }
  return active;
};
