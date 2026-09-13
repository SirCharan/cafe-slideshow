import React from "react";
import { interpolate } from "remotion";
import type { ComponentProps } from "./index";
import { outlinePaths, RPaths, kalam, win, P } from "./shared";

interface BlueprintProps { sqftFrom: number; sqftTo: number; tables?: number }

export const Blueprint: React.FC<ComponentProps> = ({ el, localFrame, fps, seed }) => {
  const { x, y, w = 800, h = 500 } = el;
  const props = (el.props as unknown) as BlueprintProps;

  const growFrames = Math.round(1.2 * fps);
  const growT = interpolate(localFrame, [0, growFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const curW = w * (0.7 + 0.3 * growT);

  const doorGap = w * 0.08;
  const floor = outlinePaths(seed, P.ink, (g) => [
    ...g.line(x, y, x + curW * 0.35, y),
    ...g.line(x + curW * 0.35 + doorGap, y, x + curW, y),
    ...g.line(x + curW, y, x + curW, y + h * 0.7),
    ...g.line(x + curW, y + h * 0.7, x, y + h * 0.7),
    ...g.line(x, y + h * 0.7, x, y),
  ]);
  const counter = outlinePaths(seed + 1, P.ink, (g) => g.rect(x + curW * 0.6, y + h * 0.08, curW * 0.32, h * 0.14));
  const drawProgress = win(localFrame, 0, Math.round(0.8 * fps));

  const dimStart = Math.round(0.9 * fps);
  const dimArrow = outlinePaths(seed + 2, P.accent, (g) => [
    ...g.line(x, y + h * 0.78, x + curW, y + h * 0.78),
    ...g.line(x, y + h * 0.75, x, y + h * 0.81),
    ...g.line(x + curW, y + h * 0.75, x + curW, y + h * 0.81),
  ]);
  const dimProgress = win(localFrame, dimStart, 20);

  const sqft = Math.round(props.sqftFrom + (props.sqftTo - props.sqftFrom) * growT);

  const tablesStart = dimStart + 25;
  const tableCount = props.tables ?? 0;

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <RPaths paths={floor} progress={drawProgress} />
      <RPaths paths={counter} progress={win(localFrame, growFrames * 0.6, Math.round(0.5 * fps))} />
      <RPaths paths={dimArrow} progress={dimProgress} />
      <text x={x + curW / 2} y={y + h * 0.78 + 60} textAnchor="middle" style={kalam(60, P.accent)}>
        {`${sqft} sqft`}
      </text>
      {Array.from({ length: tableCount }).map((_, i) => {
        const start = tablesStart + i * 12;
        const lf = localFrame - start;
        if (lf < 0) return null;
        const tx = x + curW * (0.15 + (i % 4) * 0.18);
        const ty = y + h * (0.3 + Math.floor(i / 4) * 0.2);
        const table = outlinePaths(seed + 20 + i, P.ink, (g) => [
          ...g.ellipse(tx, ty, 40, 40),
          ...g.line(tx - 30, ty - 30, tx - 20, ty - 20),
          ...g.line(tx + 30, ty - 30, tx + 20, ty - 20),
        ]);
        return <RPaths key={i} paths={table} progress={win(localFrame, start, 10)} />;
      })}
    </svg>
  );
};
