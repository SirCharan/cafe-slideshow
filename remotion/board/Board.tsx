import React from "react";
import { seedFrom } from "./rough";
import { defaultDrawFrames, drawProgress, elementStartFrame } from "./timing";
import type { Board as BoardData, El } from "./types";
import { ELEMENTS } from "./elements";

export interface BoardProps {
  board: BoardData;
  frame: number; // local to the slide
  sentenceStartFrames: number[]; // local to the slide
  fps: number;
  width?: number; // defaults to the 1920x1080 board; the editor preview scales via CSS transform
  height?: number;
  seedBase?: string; // slide id, so element seeds are stable per slide
}

/**
 * Renders a slide's drawn elements. Handles trigger timing, draw-on progress and erase wipes
 * generically; each element kind's look lives in ./elements.
 */
export const Board: React.FC<BoardProps> = ({ board, frame, sentenceStartFrames, fps, width = 1920, height = 1080, seedBase = "" }) => {
  const starts = board.elements.map((el) => elementStartFrame(el, sentenceStartFrames, fps));
  const erases = board.elements
    .map((el, i) => ({ el, start: starts[i], dur: defaultDrawFrames(el, fps) }))
    .filter((e) => e.el.kind === "erase" && frame >= e.start);

  const cam = board.camera;
  const camStyle: React.CSSProperties = cam?.zoom
    ? { transform: `scale(${cam.zoom})`, transformOrigin: cam.focus ? `${cam.focus[0]}px ${cam.focus[1]}px` : "center" }
    : {};

  return (
    <div style={{ position: "absolute", inset: 0, width, height, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, ...camStyle }}>
        {board.elements.map((el: El, i) => {
          const start = starts[i];
          if (frame < start || el.kind === "erase") return null;
          const dur = defaultDrawFrames(el, fps);
          const progress = drawProgress(frame, start, dur);
          const Renderer = ELEMENTS[el.kind];
          if (!Renderer) return null;
          // erase: the latest erase that started after this element wipes it left → right
          const eraser = erases.filter((e) => e.start > start && inRegion(el, e.el)).sort((a, b) => b.start - a.start)[0];
          const wipe = eraser ? drawProgress(frame, eraser.start, Math.max(12, eraser.dur)) : 0;
          if (wipe >= 1) return null;
          return (
            <div key={el.id} style={{ position: "absolute", inset: 0, clipPath: wipe > 0 ? `inset(0 0 0 ${wipe * 100}%)` : undefined }}>
              <Renderer el={el} frame={frame} localFrame={frame - start} progress={progress} seed={seedFrom(`${seedBase}:${el.id}`)} sentenceStartFrames={sentenceStartFrames} fps={fps} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const inRegion = (el: El, erase: El): boolean => {
  if (erase.kind !== "erase" || !erase.region) return true;
  const [rx, ry, rw, rh] = erase.region;
  const cx = el.x + (el.w ?? 0) / 2, cy = el.y + (el.h ?? 0) / 2;
  return cx >= rx && cx <= rx + rw && cy >= ry && cy <= ry + rh;
};
