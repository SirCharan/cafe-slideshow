import tabler from "@iconify-json/tabler/icons.json";
import type { ElementRenderProps, El } from "../types";
import { pathLength, dashFor } from "../rough";
import { inkColor, STROKE } from "../types";

type IconEl = El & { kind: "icon" };

const DPATH_RE = /\sd="([^"]+)"/g;

export const Icon: React.FC<ElementRenderProps<IconEl>> = ({ el, progress, seed }) => {
  const w = el.w ?? 64;
  const h = el.h ?? 64;
  const icons = (tabler as { icons: Record<string, { body: string }> }).icons;
  const entry = icons[el.name];
  if (!entry) return null;
  const ds: string[] = [];
  for (const m of entry.body.matchAll(DPATH_RE)) ds.push(m[1]);
  if (ds.length === 0) return null;
  const lens = ds.map((d) => Math.max(1, pathLength(d)));
  const total = lens.reduce((a, b) => a + b, 0) || 1;
  const strokeWidth = 2.2 * (24 / w) * (STROKE / 2);
  const filterId = `icon-wobble-${el.id}`;
  let acc = 0;
  const color = inkColor(el.color);
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h, transform: el.rot ? `rotate(${el.rot}deg)` : undefined }}>
      <svg width={w} height={h} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence baseFrequency={0.02} numOctaves={2} seed={seed % 100} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.6} />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {ds.map((d, i) => {
            const start = acc / total;
            acc += lens[i];
            const end = acc / total;
            const span = Math.max(end - start, 1e-6);
            const local = Math.max(0, Math.min(1, (progress - start) / span));
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={dashFor(lens[i], local)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
