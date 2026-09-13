import type { ElementRenderProps, El } from "../types";
import { PALETTE } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";
import { FONT_FAMILIES } from "../../fonts";

type BarEl = El & { kind: "bar" };

export const Bar: React.FC<ElementRenderProps<BarEl>> = ({ el, progress, seed }) => {
  const w = el.w ?? 400;
  const h = el.h ?? 44;
  const track = roughGen(seed, PALETTE.ink).rect(2, 2, w - 4, h - 4);
  const fillW = Math.max(0, Math.min(1, el.value / (el.max || 1))) * (w - 4) * progress;
  const fillPaths = fillW > 2 ? roughGen(seed + 1, PALETTE.ink, { fill: PALETTE.accent, fillStyle: "hachure" }).rect(2, 2, fillW, h - 4) : [];
  const done = progress >= 1;
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h + 44 }}>
      <div style={{ fontFamily: FONT_FAMILIES.kalam, fontSize: 34, color: PALETTE.ink, marginBottom: 6 }}>{el.label}</div>
      <div style={{ position: "relative", width: w, height: h }}>
        {wrapSvg(w, h, <RoughPaths paths={fillPaths} progress={1} />)}
        {wrapSvg(w, h, <RoughPaths paths={track} progress={progress} />)}
        {done && (
          <div
            style={{
              position: "absolute",
              right: 4,
              top: h + 4,
              fontFamily: FONT_FAMILIES.kalam,
              fontSize: 30,
              color: PALETTE.accent,
            }}
          >
            {el.value}
          </div>
        )}
      </div>
    </div>
  );
};
