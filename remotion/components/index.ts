import type React from "react";
import type { El } from "../board/types";

/** Props every board `component` element receives. Pure function of these — no internal state. */
export interface ComponentProps {
  el: El & { kind: "component" };
  progress: number; // 0..1 draw budget for the whole component (default duration)
  localFrame: number; // frames since this component started (can stage internally with this)
  frame: number; // frames since the slide started (use with sentenceStartFrames for props.at staging)
  sentenceStartFrames: number[];
  fps: number;
  seed: number;
}

import { MicroMarketMap } from "./MicroMarketMap";
import { FlipCard } from "./FlipCard";
import { RunwayCalendar } from "./RunwayCalendar";
import { BurnGauge } from "./BurnGauge";
import { Blueprint } from "./Blueprint";
import { BalanceScale } from "./BalanceScale";
import { RushClock } from "./RushClock";

export const COMPONENTS: Record<string, React.FC<ComponentProps>> = {
  map: MicroMarketMap,
  flip: FlipCard,
  calendar: RunwayCalendar,
  gauge: BurnGauge,
  blueprint: Blueprint,
  scale: BalanceScale,
  clock: RushClock,
};
