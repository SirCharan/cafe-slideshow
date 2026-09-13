import type { ElementRenderProps, El } from "../types";
import { inkColor } from "../types";
import { typedChars } from "../timing";
import { FONT_FAMILIES } from "../../fonts";

type LabelEl = El & { kind: "label" };

export const Label: React.FC<ElementRenderProps<LabelEl>> = ({ el, localFrame, fps }) => {
  const size = el.size ?? 38;
  const color = inkColor(el.color);
  const shown = typedChars(el.text, localFrame, fps, 24);
  const done = shown >= el.text.length;
  return (
    <div
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        fontFamily: FONT_FAMILIES.kalam,
        fontSize: size,
        color,
        whiteSpace: "pre",
        transform: el.rot ? `rotate(${el.rot}deg)` : undefined,
      }}
    >
      {el.text.slice(0, shown)}
      {!done && <span style={{ display: "inline-block", width: size * 0.08, height: size * 0.9, background: color, marginLeft: 2, verticalAlign: "text-bottom" }} />}
    </div>
  );
};
