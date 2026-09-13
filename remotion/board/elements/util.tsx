import { PALETTE, STROKE, type InkColor } from "../types";
import { roughGen, pathLength, dashFor, type RoughPath } from "../rough";

/** Renders a set of rough-generated paths, each drawing on sequentially across `progress`,
 * split by path length so a long path takes proportionally longer to draw. */
export const RoughPaths: React.FC<{ paths: RoughPath[]; progress: number; fillAfter?: boolean }> = ({ paths, progress, fillAfter = true }) => {
  const lens = paths.map((p) => Math.max(1, pathLength(p.d)));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  const sums = lens.reduce<number[]>((out, l) => [...out, (out.at(-1) ?? 0) + l], []);
  const segs = lens.map((_, i) => ({ start: (i === 0 ? 0 : sums[i - 1]) / total, end: sums[i] / total }));
  return (
    <>
      {paths.map((p, i) => {
        const { start, end } = segs[i];
        const span = Math.max(end - start, 1e-6);
        const local = Math.max(0, Math.min(1, (progress - start) / span));
        const isFill = fillAfter && !!p.fill && paths.some((q) => !q.fill);
        // fills only start once every stroke path is fully drawn
        const strokesDone = progress >= (segs.find((_, j) => !paths[j].fill)?.end ?? 1);
        if (isFill) {
          return (
            <path
              key={i}
              d={p.d}
              stroke="none"
              fill={p.fill}
              opacity={strokesDone ? 1 : 0}
              style={strokesDone ? undefined : { transition: "none" }}
            />
          );
        }
        const len = lens[i];
        return (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashFor(len, local)}
          />
        );
      })}
    </>
  );
};

export const wrapSvg = (w: number, h: number, children: React.ReactNode, extra?: React.CSSProperties): React.ReactElement => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", position: "absolute", left: 0, top: 0, ...extra }}>
    {children}
  </svg>
);

export { roughGen, PALETTE, STROKE };
export type { InkColor };
