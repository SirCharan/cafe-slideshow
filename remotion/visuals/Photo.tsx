import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import type { Theme } from "../types";

export const Photo: React.FC<{
  src: string;
  caption: string;
  credit?: string;
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ src, caption, credit, theme, frame, width, height }) => {
  const t = Math.min(1, frame / 900);
  const scale = interpolate(t, [0, 1], [1, 1.06]);
  const panX = interpolate(t, [0, 1], [0, -12]);

  return (
    <div style={{ width, height, position: "relative", borderRadius: theme.radius, overflow: "hidden", background: theme.paper2 }}>
      <Img
        src={staticFile(`assets/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${panX}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          background: theme.paper2,
          borderRadius: theme.radius,
          padding: "10px 18px",
          maxWidth: width - 48,
        }}
      >
        <div style={{ fontSize: 28, color: theme.ink, fontFamily: theme.fontBody }}>{caption}</div>
        {credit ? <div style={{ fontSize: 22, color: theme.mute, marginTop: 4 }}>{credit}</div> : null}
      </div>
    </div>
  );
};
