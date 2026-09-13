import React from "react";
import type { Theme, Visual } from "../types";
import { Receipt } from "./Receipt";
import { Bars } from "./Bars";
import { Range } from "./Range";
import { Compare } from "./Compare";
import { Logos } from "./Logos";
import { Tree } from "./Tree";
import { Photo } from "./Photo";
import { Character } from "./Character";
import { Icon } from "./Icon";

export const VISUAL_TYPES = [
  "receipt",
  "bars",
  "range",
  "compare",
  "logos",
  "tree",
  "photo",
  "character",
  "icon",
] as const;

export const SlideVisual: React.FC<{
  visual: Visual;
  theme: Theme;
  frame: number;
  activeSentence: number;
  width: number;
  height: number;
}> = ({ visual, theme, frame, width, height }) => {
  switch (visual.type) {
    case "receipt":
      return (
        <Receipt
          title={visual.title}
          sub={visual.sub}
          lines={visual.lines}
          total={visual.total}
          note={visual.note}
          theme={theme}
          frame={frame}
          width={width}
          height={height}
        />
      );
    case "bars":
      return <Bars title={visual.title} sub={visual.sub} items={visual.items} theme={theme} frame={frame} width={width} height={height} />;
    case "range":
      return (
        <Range
          title={visual.title}
          sub={visual.sub}
          min={visual.min}
          max={visual.max}
          unit={visual.unit}
          markers={visual.markers}
          theme={theme}
          frame={frame}
          width={width}
          height={height}
        />
      );
    case "compare":
      return <Compare title={visual.title} left={visual.left} right={visual.right} theme={theme} frame={frame} width={width} height={height} />;
    case "logos":
      return <Logos title={visual.title} items={visual.items} theme={theme} frame={frame} width={width} height={height} />;
    case "tree":
      return (
        <Tree
          title={visual.title}
          root={visual.root}
          branches={visual.branches}
          theme={theme}
          frame={frame}
          width={width}
          height={height}
        />
      );
    case "photo":
      return <Photo src={visual.src} caption={visual.caption} credit={visual.credit} theme={theme} frame={frame} width={width} height={height} />;
    case "character":
      return <Character src={visual.src} caption={visual.caption} theme={theme} frame={frame} width={width} height={height} />;
    case "icon":
      return <Icon src={visual.src} stat={visual.stat} caption={visual.caption} theme={theme} frame={frame} width={width} height={height} />;
    default: {
      // Exhaustiveness guard + graceful fallback if a slide is missing a visual type.
      const fallback = visual as unknown as { image?: string };
      if (fallback.image) {
        return <Photo src={fallback.image} caption="" theme={theme} frame={frame} width={width} height={height} />;
      }
      return null;
    }
  }
};
