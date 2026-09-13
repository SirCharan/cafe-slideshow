import React from "react";
import { interpolate } from "remotion";
import type { ComponentProps } from "./index";
import { outlinePaths, RPaths, kalam, win, estDurFrames, P } from "./shared";

interface FlipProps { front: string; back: string; delta?: string }

export const FlipCard: React.FC<ComponentProps> = ({ el, progress, localFrame, seed }) => {
  const { x, y, w = 560, h = 360 } = el;
  const props = (el.props as unknown) as FlipProps;

  const cardOutline = outlinePaths(seed, P.ink, (g) => g.rect(x, y, w, h));
  const drawProgress = win(localFrame, 0, 30);

  const estDur = estDurFrames(localFrame, progress);
  const flipStart = 0.55 * estDur;
  const flipT = interpolate(localFrame, [flipStart, flipStart + 14], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showBack = flipT > 90;

  const deltaStart = flipStart + 14 + 10;
  const deltaProgress = win(localFrame, deltaStart, 20);
  const deltaCircle = outlinePaths(seed + 5, P.red, (g) => g.ellipse(x + w / 2, y + h * 0.78, w * 0.5, h * 0.32));

  return (
    <div style={{ position: "absolute", inset: 0, perspective: 2000 }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <RPaths paths={cardOutline} progress={drawProgress} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipT}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
            ...kalam(60, P.ink),
          }}
        >
          {props.front}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            ...kalam(60, P.accent),
          }}
        >
          {props.back}
        </div>
      </div>
      {showBack && props.delta && (
        <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <RPaths paths={deltaCircle} progress={deltaProgress} />
          <text x={x + w / 2} y={y + h * 0.82} textAnchor="middle" style={kalam(48, P.red)}>
            {props.delta}
          </text>
        </svg>
      )}
    </div>
  );
};
