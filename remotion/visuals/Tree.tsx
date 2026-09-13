import React from "react";
import { interpolate } from "remotion";
import type { Theme } from "../types";
import { Arrow } from "./marker";

const NODE_FONT = 24;
const Q_WIDTH = 300;
const CHILD_WIDTH = 220;
const NODE_HALF = 42; // vertical half-height estimate for arrow anchoring

const TreeNode: React.FC<{
  x: number;
  y: number;
  width: number;
  label: string;
  color: string;
  opacity: number;
  theme: Theme;
}> = ({ x, y, width, label, color, opacity, theme }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      transform: "translate(-50%, -50%)",
      opacity,
      padding: "10px 20px",
      borderRadius: theme.radius,
      border: `2px solid ${color}`,
      background: theme.paper,
      color: theme.ink,
      fontSize: NODE_FONT,
      lineHeight: 1.25,
      textAlign: "center",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden",
    }}
  >
    {label}
  </div>
);

export const Tree: React.FC<{
  title: string;
  root: string;
  branches: { q: string; yes: string; no: string }[];
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ title, root, branches, theme, frame, width, height }) => {
  const framesPerBranch = 14;
  const count = branches.length;

  const topOffset = 160; // reserved for title + root, per spec formula
  const pitch = count > 0 ? Math.min(120, (height - topOffset) / count) : 120;
  const bottomSafety = height - 45;
  // Tree nodes are absolutely positioned, so a flex wrapper can't centre them —
  // instead centre the whole tree by offsetting every y-coordinate by the slack
  // between the natural (unclamped) content height and the box height.
  const naturalContentH = topOffset + count * pitch;
  const offsetY = Math.max(0, (height - naturalContentH) / 2);
  const rootY = 80 + offsetY;

  const centreX = width / 2;
  const qY = (i: number) => topOffset + offsetY + i * pitch + pitch / 2;
  const childY = (i: number) => Math.min(topOffset + offsetY + (i + 1) * pitch, bottomSafety);

  return (
    <div style={{ width, height, fontFamily: theme.fontBody, position: "relative" }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>

      <TreeNode x={centreX} y={rootY} width={Q_WIDTH} label={root} color={theme.accent} opacity={1} theme={theme} />

      {branches.map((b, i) => {
        const start = i * framesPerBranch;
        const y = qY(i);
        const cy = childY(i);
        const prevY = i === 0 ? rootY : qY(i - 1);

        const qOpacity = interpolate(frame - start, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const spineProgress = interpolate(frame - (start + 4), [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const childOpacity = interpolate(frame - (start + 8), [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <React.Fragment key={i}>
            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              <Arrow from={{ x: centreX, y: prevY + NODE_HALF }} to={{ x: centreX, y: y - NODE_HALF }} progress={spineProgress} theme={theme} />
              <Arrow from={{ x: centreX, y: y + NODE_HALF }} to={{ x: centreX - 280, y: cy - NODE_HALF }} progress={childOpacity} theme={theme} color={theme.accent2} />
              <Arrow from={{ x: centreX, y: y + NODE_HALF }} to={{ x: centreX + 280, y: cy - NODE_HALF }} progress={childOpacity} theme={theme} color={theme.accent} />
            </svg>
            <TreeNode x={centreX} y={y} width={Q_WIDTH} label={b.q} color={theme.ink} opacity={qOpacity} theme={theme} />
            <TreeNode x={centreX - 280} y={cy} width={CHILD_WIDTH} label={`Yes — ${b.yes}`} color={theme.accent2} opacity={childOpacity} theme={theme} />
            <TreeNode x={centreX + 280} y={cy} width={CHILD_WIDTH} label={`No — ${b.no}`} color={theme.accent} opacity={childOpacity} theme={theme} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
