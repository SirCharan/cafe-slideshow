import React from "react";
import { spring } from "remotion";
import type { ComponentProps } from "./index";
import { outlinePaths, RPaths, kalam, win, P } from "./shared";

interface Side { label: string; items: string[] }
interface ScaleProps { left: Side; right: Side }

export const BalanceScale: React.FC<ComponentProps> = ({ el, localFrame, fps, seed }) => {
  const { x, y, w = 800, h = 480 } = el;
  const props = (el.props as unknown) as ScaleProps;
  const cx = x + w / 2;
  const baseY = y + h;
  const postTopY = y + h * 0.15;

  const structDur = Math.round(1 * fps);
  const structProgress = win(localFrame, 0, structDur);

  const leftCount = props.left.items.length;
  const rightCount = props.right.items.length;
  const heavier = leftCount === rightCount ? 0 : leftCount > rightCount ? -1 : 1; // -1 left down, 1 right down
  const tiltTrigger = structDur + Math.max(leftCount, rightCount) * 14;
  const tilt = spring({ frame: Math.max(0, localFrame - tiltTrigger), fps, config: { damping: 14, mass: 0.7 } }) * heavier * 12;

  const beamLeftY = postTopY + Math.sin((-tilt * Math.PI) / 180) * (w * 0.35) * -1;
  const beamRightY = postTopY - Math.sin((-tilt * Math.PI) / 180) * (w * 0.35) * -1;
  const beamLY = postTopY + (tilt / 12) * 40;
  const beamRY = postTopY - (tilt / 12) * 40;

  const struct = outlinePaths(seed, P.ink, (g) => [
    ...g.line(cx, baseY, cx, postTopY),
    ...g.line(cx - w * 0.18, baseY, cx + w * 0.18, baseY),
    ...g.line(cx - w * 0.35, beamLY, cx + w * 0.35, beamRY),
    ...g.line(cx - w * 0.35, beamLY, cx - w * 0.35, beamLY + h * 0.22),
    ...g.line(cx + w * 0.35, beamRY, cx + w * 0.35, beamRY + h * 0.22),
    ...g.ellipse(cx - w * 0.35, beamLY + h * 0.3, w * 0.24, h * 0.1),
    ...g.ellipse(cx + w * 0.35, beamRY + h * 0.3, w * 0.24, h * 0.1),
  ]);

  const renderItems = (items: string[], side: "left" | "right", panY: number, panX: number) =>
    items.map((label, i) => {
      const start = structDur + i * 14 + (side === "right" ? 7 : 0);
      const lf = localFrame - start;
      if (lf < 0) return null;
      return (
        <text key={i} x={panX} y={panY - 14 - i * 26} textAnchor="middle" style={kalam(30, P.ink)}>
          {label.slice(0, Math.max(0, Math.min(label.length, Math.floor((lf / fps) * 24))))}
        </text>
      );
    });

  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <RPaths paths={struct} progress={structProgress} />
      {renderItems(props.left.items, "left", beamLY + h * 0.3, cx - w * 0.35)}
      {renderItems(props.right.items, "right", beamRY + h * 0.3, cx + w * 0.35)}
      <text x={cx - w * 0.35} y={baseY + 44} textAnchor="middle" style={kalam(36, P.ink)}>
        {props.left.label}
      </text>
      <text x={cx + w * 0.35} y={baseY + 44} textAnchor="middle" style={kalam(36, P.ink)}>
        {props.right.label}
      </text>
    </svg>
  );
};
