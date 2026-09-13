import React from "react";
import { interpolate } from "remotion";
import type { Theme } from "../types";
import { Arrow } from "./marker";

const TreeNode: React.FC<{
  x: number;
  y: number;
  label: string;
  color: string;
  opacity: number;
  theme: Theme;
  nodeFont: number;
}> = ({ x, y, label, color, opacity, theme, nodeFont }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      opacity,
      padding: "10px 20px",
      borderRadius: 999,
      border: `2px solid ${color}`,
      background: theme.paper,
      color: theme.ink,
      fontSize: nodeFont,
      whiteSpace: "nowrap",
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
  const capped = branches.slice(0, 4);
  const small = capped.length > 3;
  const nodeFont = small ? 24 : 28;
  const framesPerBranch = 14;

  const rootY = 130;
  const branchTop = 200;
  const rowH = (height - branchTop - 20) / capped.length;

  return (
    <div style={{ width, height, fontFamily: theme.fontBody, position: "relative" }}>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 40, color: theme.ink, lineHeight: 1.1 }}>{title}</div>

      <TreeNode x={width / 2} y={rootY} label={root} color={theme.accent} opacity={1} theme={theme} nodeFont={nodeFont} />

      {capped.map((b, i) => {
        const start = i * framesPerBranch;
        const y = branchTop + i * rowH + rowH / 2;
        const qOpacity = interpolate(frame - start, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const arrowProgress = interpolate(frame - (start + 4), [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const childOpacity = interpolate(frame - (start + 8), [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fromY = i === 0 ? rootY : branchTop + (i - 1) * rowH + rowH / 2;
        return (
          <React.Fragment key={i}>
            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              <Arrow from={{ x: width / 2, y: fromY + 24 }} to={{ x: width / 2, y: y - 24 }} progress={arrowProgress} theme={theme} />
              <Arrow from={{ x: width / 2, y: y + 20 }} to={{ x: width / 2 - 160, y: y + 70 }} progress={childOpacity} theme={theme} color={theme.accent2} />
              <Arrow from={{ x: width / 2, y: y + 20 }} to={{ x: width / 2 + 160, y: y + 70 }} progress={childOpacity} theme={theme} color={theme.accent} />
            </svg>
            <TreeNode x={width / 2} y={y} label={b.q} color={theme.ink} opacity={qOpacity} theme={theme} nodeFont={nodeFont} />
            <TreeNode x={width / 2 - 160} y={y + 96} label={`Yes — ${b.yes}`} color={theme.accent2} opacity={childOpacity} theme={theme} nodeFont={nodeFont} />
            <TreeNode x={width / 2 + 160} y={y + 96} label={`No — ${b.no}`} color={theme.accent} opacity={childOpacity} theme={theme} nodeFont={nodeFont} />
          </React.Fragment>
        );
      })}
    </div>
  );
};
