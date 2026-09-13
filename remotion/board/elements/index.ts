import type { El, ElementRenderer } from "../types";
import { Sketch } from "./Sketch";
import { Icon } from "./Icon";
import { Shape } from "./Shape";
import { Label } from "./Label";
import { NumberEl } from "./Number";
import { Coins } from "./Coins";
import { Bar } from "./Bar";
import { Figure } from "./Figure";
import { Photo } from "./Photo";
import { Highlight } from "./Highlight";
import { Component } from "./Component";

// Registry: one renderer per `kind`. Board.tsx looks up ELEMENTS[el.kind]; unknown kinds render nothing.
export const ELEMENTS: Partial<Record<El["kind"], ElementRenderer>> = {
  sketch: Sketch as ElementRenderer,
  icon: Icon as ElementRenderer,
  shape: Shape as ElementRenderer,
  label: Label as ElementRenderer,
  number: NumberEl as ElementRenderer,
  coins: Coins as ElementRenderer,
  bar: Bar as ElementRenderer,
  figure: Figure as ElementRenderer,
  photo: Photo as ElementRenderer,
  highlight: Highlight as ElementRenderer,
  component: Component as ElementRenderer,
};

export { Figure, Coins, Shape };
