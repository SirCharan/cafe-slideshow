import type { ElementRenderProps, El } from "../types";
import { inkColor } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";

type ShapeEl = El & { kind: "shape" };

export const Shape: React.FC<ElementRenderProps<ShapeEl>> = ({ el, progress, seed }) => {
  const w = el.w ?? 200;
  const h = el.h ?? 120;
  const color = inkColor(el.color);
  const g = roughGen(seed, color, el.fill ? { fill: color, fillStyle: "hachure" } : undefined);
  // `to` is ABSOLUTE board coordinates [x2, y2]. This element's own container div is already
  // positioned at (el.x, el.y), so the local endpoint for line/arrow paths (which draw from the
  // container's 0,0 origin) is `to` minus (el.x, el.y). Fallback matches the data rule:
  // to = [x + (w ?? 200), y] -> a local endpoint of (w, 0), i.e. a horizontal stroke.
  const localTo = (): [number, number] => (el.to ? [el.to[0] - el.x, el.to[1] - el.y] : [w, 0]);
  let paths: ReturnType<typeof g.rect>;
  switch (el.shape) {
    case "rect":
      paths = g.rect(2, 2, w - 4, h - 4);
      break;
    case "ellipse":
      paths = g.ellipse(w / 2, h / 2, w - 4, h - 4);
      break;
    case "circle": {
      const d = Math.min(w, h) - 4;
      paths = g.ellipse(w / 2, h / 2, d, d);
      break;
    }
    case "line": {
      const [tx, ty] = localTo();
      paths = g.line(0, 0, tx, ty);
      break;
    }
    case "arrow": {
      const [tx, ty] = localTo();
      const angle = Math.atan2(ty, tx);
      const headLen = 24;
      const a1 = angle + Math.PI - 0.4;
      const a2 = angle + Math.PI + 0.4;
      const head = g.polygon([
        [tx, ty],
        [tx + headLen * Math.cos(a1), ty + headLen * Math.sin(a1)],
        [tx + headLen * Math.cos(a2), ty + headLen * Math.sin(a2)],
      ]);
      paths = [...g.line(0, 0, tx, ty), ...head];
      break;
    }
    case "underline": {
      const mx = w / 2;
      const wobble = ((seed % 7) - 3) * 2;
      paths = g.curve([[0, h / 2], [mx, h / 2 + wobble], [w, h / 2]]);
      break;
    }
    default:
      paths = [];
  }
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h, transform: el.rot ? `rotate(${el.rot}deg)` : undefined }}>
      {wrapSvg(w, h, <RoughPaths paths={paths} progress={progress} />)}
    </div>
  );
};
