import type { ElementRenderProps, El } from "../types";
import { PALETTE } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";

type HighlightEl = El & { kind: "highlight" };

export const Highlight: React.FC<ElementRenderProps<HighlightEl>> = ({ el, progress, seed }) => {
  const w = el.w ?? 200;
  const h = el.h ?? 40;
  const y = h / 2;
  const g = roughGen(seed, PALETTE.highlight, { strokeWidth: 34, roughness: 0.6 });
  const paths = g.line(0, y, w, y);
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h, opacity: 0.55 }}>
      {wrapSvg(w, h, <RoughPaths paths={paths} progress={progress} />)}
    </div>
  );
};
