import { spring } from "remotion";
import type { ElementRenderProps, El } from "../types";
import { inkColor, PALETTE } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";

type NumberEl = El & { kind: "number" };

export const NumberEl: React.FC<ElementRenderProps<NumberEl>> = ({ el, localFrame, fps, seed }) => {
  const size = el.size ?? 120;
  const color = inkColor(el.color ?? "accent");
  const scale = spring({ frame: localFrame, fps, config: { damping: 12 }, durationInFrames: 6, from: 0.85, to: 1 });
  const opacity = Math.max(0, Math.min(1, localFrame / 6));
  const boxStart = 10;
  const boxDur = 14;
  const boxProgress = Math.max(0, Math.min(1, (localFrame - boxStart) / boxDur));
  const w = el.w ?? (el.box === "circle" ? size * 3.4 : size * 2.8);
  const h = el.h ?? size * 1.5;
  const g = roughGen(seed, PALETTE.ink);
  const boxPaths = el.box === "circle" ? g.ellipse(w / 2, h / 2, w - 8, h - 8) : el.box === "rect" ? g.rect(4, 4, w - 8, h - 8) : [];
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h }}>
      {boxProgress > 0 && wrapSvg(w, h, <RoughPaths paths={boxPaths} progress={boxProgress} />)}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Kalam", "Inter", sans-serif',
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          fontSize: size,
          color,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {el.text}
      </div>
    </div>
  );
};
