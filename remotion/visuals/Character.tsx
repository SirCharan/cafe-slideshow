import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import type { Theme } from "../types";

export const Character: React.FC<{
  src: string;
  caption: string;
  theme: Theme;
  frame: number;
  width: number;
  height: number;
}> = ({ src, caption, theme, frame, width, height }) => {
  const rise = interpolate(frame, [0, 18], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = Math.sin(frame / 15) * 2;
  const imgH = height - 120;

  return (
    <div style={{ width, height, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width, height: imgH, transform: `translateY(${rise + bob}px)`, opacity, position: "relative" }}>
        <Img src={staticFile(`assets/${src}`)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div style={{ fontFamily: theme.fontDisplay, fontSize: 36, color: theme.ink, marginTop: 12, textAlign: "center" }}>
        {caption}
      </div>
    </div>
  );
};
