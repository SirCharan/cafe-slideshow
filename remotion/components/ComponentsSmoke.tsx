import React from "react";
import { AbsoluteFill } from "remotion";
import { COMPONENTS, type ComponentProps } from "./index";
import type { El } from "../board/types";
import { seedFrom } from "../board/rough";
import { P } from "./shared";

const FPS = 30;
const FRAME = 90;

type ComponentName = "map" | "flip" | "calendar" | "gauge" | "blueprint" | "scale" | "clock";

const box = (name: ComponentName, x: number, y: number, w: number, h: number, props: Record<string, unknown>): El => ({
  id: `smoke-${name}`,
  at: 0,
  x,
  y,
  w,
  h,
  kind: "component",
  name,
  props,
});

const els: El[] = [
  box("map", 20, 20, 620, 480, { pins: [
    { name: "Indiranagar", tag: "₹90/sqft" },
    { name: "Koramangala", tag: "₹110/sqft" },
    { name: "HSR Layout", tag: "₹85/sqft" },
    { name: "Whitefield", tag: "₹60/sqft" },
  ] }),
  box("flip", 700, 20, 460, 480, { front: "PLANNED ₹10 L", back: "ACTUAL ₹15-16 L", delta: "+₹5-6 Lakh" }),
  box("calendar", 1220, 20, 460, 260, { months: 12, fillBy: [{ at: 0, count: 6 }] }),
  box("gauge", 1220, 420, 460, 300, {
    label: "RENT / SALES",
    value: 15,
    max: 30,
    unit: "%",
    zones: [
      { from: 0, to: 50, color: "green" },
      { from: 50, to: 100, color: "red" },
    ],
  }),
  box("blueprint", 20, 580, 460, 400, { sqftFrom: 600, sqftTo: 1000, tables: 6 }),
  box("scale", 540, 580, 460, 460, {
    left: { label: "CHAIN", items: ["brand", "capital", "support"] },
    right: { label: "LOCAL", items: ["freedom", "risk"] },
  }),
  box("clock", 1060, 580, 460, 460, {
    peaks: [
      { from: 8, to: 10, label: "morning rush" },
      { from: 18, to: 20, label: "evening rush" },
    ],
  }),
];

/** Temporary smoke test: lays all 7 components on one board frame. Remove once BoardSmoke exists. */
export const ComponentsSmoke: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper }}>
    {els.map((el) => {
      const name = (el as El & { kind: "component" }).name;
      const Renderer = COMPONENTS[name];
      if (!Renderer) return null;
      const props: ComponentProps = {
        el: el as El & { kind: "component" },
        progress: Math.min(1, FRAME / 120),
        localFrame: FRAME,
        frame: FRAME,
        sentenceStartFrames: [0],
        fps: FPS,
        seed: seedFrom(el.id),
      };
      return (
        <div key={el.id} style={{ position: "absolute", inset: 0 }}>
          <Renderer {...props} />
        </div>
      );
    })}
  </AbsoluteFill>
);
