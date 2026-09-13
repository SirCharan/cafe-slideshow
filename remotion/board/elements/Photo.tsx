import { staticFile } from "remotion";
import type { ElementRenderProps, El } from "../types";
import { PALETTE } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";
import { FONT_FAMILIES } from "../../fonts";

type PhotoEl = El & { kind: "photo" };

export const Photo: React.FC<ElementRenderProps<PhotoEl>> = ({ el, progress, seed }) => {
  const w = el.w ?? 360;
  const h = el.h ?? 260;
  const frameProgress = Math.max(0, Math.min(1, progress / 0.4));
  const revealProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.5));
  const tapeProgress = Math.max(0, Math.min(1, (progress - 0.9) / 0.1));
  const frame = roughGen(seed, PALETTE.ink).rect(0, 0, w, h);
  const tapeG = roughGen(seed + 1, PALETTE.ink, { fill: PALETTE.highlight, fillStyle: "solid", fillWeight: 0.55 });
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h + 40 }}>
      {wrapSvg(w, h, <RoughPaths paths={frame} progress={frameProgress} />)}
      <div style={{ position: "absolute", left: 6, top: 6, width: w - 12, height: h - 12, clipPath: `inset(0 0 ${(1 - revealProgress) * 100}% 0)` }}>
        {/* Plain <img>, not Remotion's <Img>: a missing photo must never block the render on a
            delayRender() that only clears on a "load" event, which a 404 never fires. */}
        <img
          src={staticFile(`assets/${el.src}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.4) contrast(0.95)" }}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
      </div>
      {tapeProgress > 0 && (
        <>
          <div style={{ position: "absolute", left: -8, top: -10, opacity: 0.55 }}>
            {wrapSvg(60, 26, <RoughPaths paths={tapeG.rect(0, 0, 60, 26)} progress={tapeProgress} />)}
          </div>
          <div style={{ position: "absolute", right: -8, top: -10, opacity: 0.55 }}>
            {wrapSvg(60, 26, <RoughPaths paths={tapeG.rect(0, 0, 60, 26)} progress={tapeProgress} />)}
          </div>
        </>
      )}
      {el.caption && (
        <div style={{ position: "absolute", left: 0, top: h + 8, width: w, fontFamily: FONT_FAMILIES.kalam, fontSize: 30, color: PALETTE.ink, textAlign: "center" }}>
          {el.caption}
        </div>
      )}
    </div>
  );
};
