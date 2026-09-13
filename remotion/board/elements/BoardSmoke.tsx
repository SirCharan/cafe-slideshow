import { useCurrentFrame, useVideoConfig } from "remotion";
import { Board } from "../Board";
import type { Board as BoardData } from "../types";
import { PALETTE } from "../types";

let smokeBoard: BoardData;
try {
  // Written by a one-off script for local verification; falls back to an inline sample if absent.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  smokeBoard = require("../../../out/smoke-board.json") as BoardData;
} catch {
  smokeBoard = {
    elements: [
      { id: "s1", kind: "shape", shape: "rect", at: 0, x: 100, y: 100, w: 300, h: 180, color: "ink" },
      { id: "l1", kind: "label", text: "Sample board", at: 0, x: 100, y: 320, size: 40, color: "ink" },
    ],
  };
}

/** Renders every board element kind once, for still-frame verification. */
export const BoardSmoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, background: PALETTE.paper }}>
      <Board board={smokeBoard} frame={frame} sentenceStartFrames={[0]} fps={fps} seedBase="smoke" />
    </div>
  );
};
