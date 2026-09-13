import { useState } from "react";
import { staticFile } from "remotion";
import type { ElementRenderProps, El } from "../types";
import { roughGen } from "../rough";
import { RoughPaths, wrapSvg } from "./util";
import { Icon } from "./Icon";

type SketchEl = El & { kind: "sketch" };

/** sketchName -> tabler icon name. Every entry is verified to exist in
 * @iconify-json/tabler/icons.json (nearest existing icon substituted where the "obvious"
 * name didn't exist, e.g. beans-sack -> seedling, not "seeding"). Used as a fallback while
 * the 30 marker PNGs under public/assets/sketch/ don't exist yet (GPU OOM). */
export const SKETCH_ICON_FALLBACK: Record<string, string> = {
  "cafe-front": "building-store",
  "espresso-machine": "coffee",
  croissant: "cookie",
  "coffee-cup": "cup",
  "laptop-table": "device-laptop",
  "cash-register": "cash-register",
  receipt: "receipt",
  "lease-document": "file-text",
  keys: "key",
  "office-building": "building-bank",
  "licence-certificate": "file-certificate",
  "delivery-scooter": "motorbike",
  "electricity-meter": "bolt",
  "kitchen-counter": "tools-kitchen-2",
  "chair-table": "armchair",
  "beans-sack": "seedling",
  refrigerator: "fridge",
  signboard: "sign-right",
  "queue-people": "users-group",
  "tiny-cafe": "building-store",
  "mid-cafe": "building-store",
  "glass-cafe": "building-skyscraper",
  "chain-logo-board": "building-store",
  calendar: "calendar",
  "gauge-dial": "gauge",
  "bangalore-skyline": "building-community",
  "shop-shutter": "door",
  cheque: "file-invoice",
  "barista-pouring": "coffee",
  "coffee-grinder": "settings",
};

export const Sketch: React.FC<ElementRenderProps<SketchEl>> = ({
  el,
  progress,
  seed,
  frame,
  localFrame,
  sentenceStartFrames,
  fps,
}) => {
  const w = el.w ?? 400;
  const h = el.h ?? 300;
  const [imgError, setImgError] = useState(false);
  // diagonal wipe growing from top-left, following progress
  const p = Math.max(0, Math.min(1, progress));
  const clip = `polygon(0 0, ${p * 100}% 0, ${p * 100}% ${p * 100}%, 0 ${p * 100}%)`;
  const underline = roughGen(seed).line(4, h + 8, w - 4, h + 8);

  const iconName = SKETCH_ICON_FALLBACK[el.src];
  const iconSize = Math.min(w, h);
  const iconEl = {
    ...el,
    kind: "icon" as const,
    name: iconName,
    x: (w - iconSize) / 2,
    y: (h - iconSize) / 2,
    w: iconSize,
    h: iconSize,
    rot: undefined,
  } as El & { kind: "icon" };

  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h, transform: el.rot ? `rotate(${el.rot}deg)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
        {/* Always render the tabler-icon fallback underneath: the 30 marker PNGs don't exist
            yet (GPU OOM), so the <img> below reliably 404s and hides itself, leaving the icon
            visible. When the PNG does exist and loads, it draws on top and covers the icon.
            Simpler than tracking a window.__sketchMissing map. */}
        {iconName && (
          <Icon
            el={iconEl}
            frame={frame}
            localFrame={localFrame}
            progress={progress}
            seed={seed}
            sentenceStartFrames={sentenceStartFrames}
            fps={fps}
          />
        )}
        {/* Plain <img>, not Remotion's <Img>: a missing sketch PNG must never block the
            render on a delayRender() that only clears on a "load" event, which a 404 never fires. */}
        <img
          src={staticFile(`assets/sketch/${el.src}.png`)}
          style={{ width: w, height: h, objectFit: "contain", position: "relative" }}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
            setImgError(true);
          }}
        />
      </div>
      {/* Orphan underline flourish only makes sense once the real sketch has drawn on; skip it
          when the image errored and the fallback icon is showing instead. */}
      {progress > 0.9 && !imgError && wrapSvg(w, h + 16, <RoughPaths paths={underline} progress={(progress - 0.9) / 0.1} />)}
    </div>
  );
};
