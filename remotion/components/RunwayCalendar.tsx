import React from "react";
import type { ComponentProps } from "./index";
import { outlinePaths, hachurePaths, RPaths, kalam, win, P } from "./shared";

interface FillEntry { at: number; count: number }
interface CalendarProps { months?: number; fillBy: FillEntry[] }

export const RunwayCalendar: React.FC<ComponentProps> = ({ el, frame, sentenceStartFrames, seed }) => {
  const { x, y, w = 900, h = 360 } = el;
  const props = (el.props as unknown) as CalendarProps;
  const months = props.months ?? 12;
  const fillBy = props.fillBy ?? [];

  const cols = h > w * 0.6 ? 4 : 6;
  const rows = Math.ceil(months / cols);
  const cellW = w / cols;
  const cellH = h / rows;

  // The currently-active fillBy entry (last one whose trigger frame has passed) drives the fill count.
  let activeCount = 0;
  let activeStart = 0;
  for (const entry of fillBy) {
    const triggerFrame = sentenceStartFrames[Math.max(0, Math.min(entry.at, sentenceStartFrames.length - 1))] ?? 0;
    if (frame >= triggerFrame) {
      activeCount = entry.count;
      activeStart = triggerFrame;
    }
  }

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: months }).map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = x + col * cellW;
        const cy = y + row * cellH;
        const boxOutline = outlinePaths(seed + i, P.ink, (g) => g.rect(cx + 6, cy + 6, cellW - 12, cellH - 12));
        const filled = i < activeCount;
        const fillFrame = activeStart + i * 5;
        const fillProgress = filled ? win(frame, fillFrame, 15) : 0;
        const fillPaths = filled ? hachurePaths(seed + 100 + i, P.accent, (g) => g.rect(cx + 6, cy + 6, cellW - 12, cellH - 12)) : [];
        return (
          <g key={i}>
            <RPaths paths={boxOutline} progress={1} />
            {filled && <RPaths paths={fillPaths} progress={fillProgress} />}
            <text x={cx + cellW / 2} y={cy + cellH / 2 + 10} textAnchor="middle" style={kalam(30, P.ink)}>
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x={x + w / 2} y={y + h + 56} textAnchor="middle" style={kalam(40, P.accent)}>
        {`${activeCount} months`}
      </text>
    </svg>
  );
};
