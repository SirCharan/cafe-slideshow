import type { ElementRenderProps, El } from "../types";
import { PALETTE } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";
import { FONT_FAMILIES } from "../../fonts";

type CoinsEl = El & { kind: "coins" };

const R = 34;
const OVERLAP = 12;

export const Coins: React.FC<ElementRenderProps<CoinsEl>> = ({ el, localFrame, seed }) => {
  const w = R * 2 + 8;
  const h = el.count * (R * 2 - OVERLAP) + OVERLAP + 8;
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h }}>
      {Array.from({ length: el.count }).map((_, i) => {
        const coinLocal = localFrame - i * 4;
        if (coinLocal < 0) return null;
        const dropProgress = Math.max(0, Math.min(1, coinLocal / 6));
        const ty = -24 * (1 - dropProgress);
        const cy = h - 4 - R - i * (R * 2 - OVERLAP);
        const g = roughGen(seed + i, PALETTE.ink, { fill: PALETTE.highlight, fillStyle: "hachure" });
        const paths = g.ellipse(w / 2, cy, R * 2, R * 2);
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, transform: `translateY(${ty}px)`, opacity: Math.max(0.2, dropProgress) }}>
            {wrapSvg(w, h, <RoughPaths paths={paths} progress={1} />)}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: cy - 14,
                width: w,
                textAlign: "center",
                fontFamily: FONT_FAMILIES.kalam,
                fontSize: 26,
                color: PALETTE.ink,
              }}
            >
              ₹
            </div>
          </div>
        );
      })}
    </div>
  );
};
