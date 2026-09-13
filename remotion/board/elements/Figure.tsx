import type { ElementRenderProps, El } from "../types";
import { PALETTE, inkColor } from "../types";
import { roughGen, type RoughPath } from "../rough";
import { RoughPaths, wrapSvg } from "./util";
import { FONT_FAMILIES } from "../../fonts";
import { typedChars } from "../timing";

type FigureEl = El & { kind: "figure" };

const HEAD_R = 28;
const CX = 80;
const HEAD_Y = 44;
const SHOULDER_Y = HEAD_Y + HEAD_R + 4;
const HIP_Y = SHOULDER_Y + 108;
const FOOT_Y = HIP_Y + 96;

const armEnds = (pose: FigureEl["pose"]): [[number, number], [number, number]] => {
  switch (pose) {
    case "point":
      return [[CX - 50, SHOULDER_Y + 40], [CX + 60, SHOULDER_Y - 20]];
    case "shrug":
      return [[CX - 55, SHOULDER_Y - 25], [CX + 55, SHOULDER_Y - 25]];
    case "armsUp":
      return [[CX - 45, SHOULDER_Y - 70], [CX + 45, SHOULDER_Y - 70]];
    default:
      return [[CX - 40, SHOULDER_Y + 55], [CX + 40, SHOULDER_Y + 55]];
  }
};

/** Sequential group draw: each group of paths only starts once the previous finishes. */
const Groups: React.FC<{ groups: RoughPath[][]; progress: number }> = ({ groups, progress }) => {
  const n = groups.length || 1;
  return (
    <>
      {groups.map((paths, i) => {
        const start = i / n;
        const end = (i + 1) / n;
        const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        return <RoughPaths key={i} paths={paths} progress={local} />;
      })}
    </>
  );
};

export const Figure: React.FC<ElementRenderProps<FigureEl>> = ({ el, progress, localFrame, fps, seed }) => {
  const w = el.w ?? 160;
  const h = el.h ?? 300;
  const say = el.say;

  // Reserve the top ~30% of the box for the speech bubble (when present) so the figure body
  // and its bubble both stay inside [el.x, el.y, el.w, el.h] — nothing renders above el.y.
  const bubbleBandH = say ? h * 0.3 : 0;
  const figureAreaTop = bubbleBandH;
  const figureAreaH = h - bubbleBandH;

  const scaleY = figureAreaH / 300;
  const scaleX = w / 160;
  const color = inkColor(el.color);
  const g = roughGen(seed, color);
  const [armL, armR] = armEnds(el.pose);

  const head = g.ellipse(CX, HEAD_Y, HEAD_R * 2, HEAD_R * 2);
  const torso = g.line(CX, SHOULDER_Y, CX, HIP_Y);
  const arms = [...g.line(CX, SHOULDER_Y + 10, armL[0], armL[1]), ...g.line(CX, SHOULDER_Y + 10, armR[0], armR[1])];
  const legs = [...g.line(CX, HIP_Y, CX - 25, FOOT_Y), ...g.line(CX, HIP_Y, CX + 25, FOOT_Y)];

  const extras: RoughPath[] = [];
  if (el.who === "owner") {
    extras.push(...g.rect(CX - 22, SHOULDER_Y + 20, 44, 60));
    extras.push(...g.ellipse(armR[0] + 6, armR[1] - 4, 20, 16));
  } else if (el.who === "customer") {
    extras.push(...g.rect(CX - 40, HIP_Y - 6, 80, 34));
  } else if (el.who === "landlord") {
    extras.push(...g.ellipse(armR[0] + 4, armR[1] + 8, 14, 14));
    extras.push(...g.line(armR[0] + 10, armR[1] + 8, armR[0] + 26, armR[1] + 8));
  }

  const groups = [head, torso, arms, legs, extras].filter((gr) => gr.length > 0);
  const bodyProgress = Math.min(1, progress / 0.75);
  const bodyDone = progress >= 0.75;

  // Bubble sized to fit inside the reserved band, both horizontally (clamped to the box width)
  // and vertically (leaving a few px at the bottom of the band for the tail).
  const bubbleW = say ? Math.min(w - 16, 12 * say.length + 60) : 0;
  const bubbleH = say ? Math.max(50, bubbleBandH - 18) : 0;
  const sayLocal = localFrame - Math.round(0.75 * (el.duration ? el.duration * fps : 60));
  const shown = say ? typedChars(say, sayLocal, fps, 24) : 0;

  // Aim the tail at the head (CX in the figure's local coordinate space, scaled + offset into
  // the box), clamped so the bubble itself never spills past the box's left/right edges.
  const headX = CX * scaleX;
  const bubbleLeft = say ? Math.min(Math.max(headX - bubbleW / 2, 0), Math.max(0, w - bubbleW)) : 0;
  const tailBaseX = say ? Math.min(Math.max(headX - bubbleLeft, 20), Math.max(20, bubbleW - 20)) : 0;

  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: figureAreaTop,
          width: 160,
          height: 300,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: "top left",
        }}
      >
        {wrapSvg(160, 300, <Groups groups={groups} progress={bodyProgress} />)}
      </div>
      {say && bodyDone && (
        <div style={{ position: "absolute", left: bubbleLeft, top: 0, width: bubbleW, height: bubbleBandH }}>
          {wrapSvg(
            bubbleW,
            bubbleBandH,
            <>
              <RoughPaths paths={g.ellipse(bubbleW / 2, bubbleH / 2, bubbleW - 8, bubbleH - 8)} progress={1} />
              <RoughPaths paths={g.line(tailBaseX - 14, bubbleH - 6, tailBaseX, bubbleBandH - 4)} progress={1} />
              <RoughPaths paths={g.line(tailBaseX + 2, bubbleH - 6, tailBaseX, bubbleBandH - 4)} progress={1} />
            </>,
          )}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: bubbleW,
              height: bubbleH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_FAMILIES.kalam,
              fontSize: 28,
              color: PALETTE.ink,
              padding: 10,
              textAlign: "center",
            }}
          >
            {say.slice(0, shown)}
          </div>
        </div>
      )}
    </div>
  );
};
