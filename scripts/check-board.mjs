#!/usr/bin/env node
// Validates data/slides.json `board` fields against the storyboard contract
// (remotion/board/types.ts + the whiteboard-explainer plan).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const slides = JSON.parse(fs.readFileSync(path.join(root, "data/slides.json"), "utf8"));
const icons = JSON.parse(
  fs.readFileSync(path.join(root, "node_modules/@iconify-json/tabler/icons.json"), "utf8")
).icons;

const SKETCH_NAMES = new Set([
  "cafe-front", "espresso-machine", "croissant", "coffee-cup", "laptop-table",
  "cash-register", "receipt", "lease-document", "keys", "office-building",
  "licence-certificate", "delivery-scooter", "electricity-meter", "kitchen-counter",
  "chair-table", "beans-sack", "refrigerator", "signboard", "queue-people",
  "tiny-cafe", "mid-cafe", "glass-cafe", "chain-logo-board", "calendar",
  "gauge-dial", "bangalore-skyline", "shop-shutter", "cheque", "barista-pouring",
  "coffee-grinder",
]);

const X_MIN = 80, X_MAX = 1840, Y_MIN = 150, Y_MAX = 960;
const OVERLAP_GAP = 30;
// kinds with a real visual footprint that must not crowd each other; shapes (arrows/
// lines/underlines) are connective marks meant to touch other elements, "highlight" is
// a deliberate overlay on its target, and "erase" has no footprint at all.
const BOXED_KINDS = new Set([
  "sketch", "icon", "figure", "number", "label", "coins", "bar", "photo", "component",
]);

function norm(s) {
  return String(s)
    .toLowerCase()
    .replace(/₹\s+/g, "₹")
    .replace(/\s+/g, " ")
    .trim();
}

function fail(msg) {
  throw new Error(msg);
}

let totalElements = 0;
let checked = 0;

for (const slide of slides) {
  const { id, board, sentences = [], bullets = [], headline = "" } = slide;
  if (!board || !Array.isArray(board.elements)) {
    fail(`${id}: missing board.elements`);
  }
  const els = board.elements;
  const minEls = slide.kind === "end_card" ? 3 : 6;
  if (els.length < minEls) {
    fail(`${id}: only ${els.length} elements, need >= ${minEls}`);
  }

  const haystack = norm([...bullets, ...sentences, headline].join(" \n "));
  const seenIds = new Set();
  let alive = 0;
  let aliveBoxes = []; // { id, x1,y1,x2,y2 } for BOXED_KINDS, reset on erase

  for (const el of els) {
    checked++;
    // id uniqueness
    if (!el.id) fail(`${id}: element missing id`);
    if (seenIds.has(el.id)) fail(`${id}: duplicate element id ${el.id}`);
    seenIds.add(el.id);

    // at bounds
    if (typeof el.at !== "number" || el.at < 0 || el.at >= sentences.length) {
      fail(`${id}: element ${el.id} has at=${el.at}, sentences.length=${sentences.length}`);
    }

    // coordinate bounds
    if (typeof el.x !== "number" || el.x < X_MIN || el.x > X_MAX) {
      fail(`${id}: element ${el.id} x=${el.x} out of bounds [${X_MIN},${X_MAX}]`);
    }
    if (typeof el.y !== "number" || el.y < Y_MIN || el.y > Y_MAX) {
      fail(`${id}: element ${el.id} y=${el.y} out of bounds [${Y_MIN},${Y_MAX}]`);
    }
    if (el.h && el.y + el.h > Y_MAX) {
      fail(`${id}: element ${el.id} y+h=${el.y + el.h} exceeds ${Y_MAX}`);
    }

    // density: erase resets the alive counter (whole-board erase); region erase still resets conservatively
    if (el.kind === "erase") {
      alive = 0;
      aliveBoxes = [];
      continue;
    }
    alive++;
    if (alive > 9) {
      fail(`${id}: more than 9 elements alive without an erase (at element ${el.id})`);
    }

    // `to` (shape end coordinates) must be absolute board coordinates inside bounds
    if (el.kind === "shape" && el.to) {
      const [tx, ty] = el.to;
      if (typeof tx !== "number" || tx < X_MIN || tx > X_MAX) {
        fail(`${id}: element ${el.id} to.x=${tx} out of bounds [${X_MIN},${X_MAX}]`);
      }
      if (typeof ty !== "number" || ty < Y_MIN || ty > Y_MAX) {
        fail(`${id}: element ${el.id} to.y=${ty} out of bounds [${Y_MIN},${Y_MAX}]`);
      }
    }

    // overlap: elements alive at the same time must keep a 30px gap between boxes.
    // "shape" (arrows/lines/underlines) are connective and meant to touch things,
    // "highlight" is a deliberate overlay on its target — neither gets a box.
    if (BOXED_KINDS.has(el.kind)) {
      const w = el.w || 0, h = el.h || 0;
      const box = { id: el.id, x1: el.x, y1: el.y, x2: el.x + w, y2: el.y + h };
      for (const other of aliveBoxes) {
        const separated =
          box.x2 + OVERLAP_GAP <= other.x1 ||
          other.x2 + OVERLAP_GAP <= box.x1 ||
          box.y2 + OVERLAP_GAP <= other.y1 ||
          other.y2 + OVERLAP_GAP <= box.y1;
        if (!separated) {
          fail(`${id}: element ${el.id} overlaps ${other.id} (need ${OVERLAP_GAP}px gap)`);
        }
      }
      aliveBoxes.push(box);
    }

    // text checks
    const texts = [];
    if (el.kind === "label" || el.kind === "number") texts.push(el.text);
    if (el.kind === "figure" && el.say) texts.push(el.say);

    for (const t of texts) {
      const needle = norm(t);
      if (!haystack.includes(needle)) {
        fail(`${id}: element ${el.id} text "${t}" not found in bullets/sentences/headline`);
      }
    }

    // sketch src whitelist
    if (el.kind === "sketch" && !SKETCH_NAMES.has(el.src)) {
      fail(`${id}: element ${el.id} sketch src "${el.src}" not in the approved sketch list`);
    }

    // icon existence
    if (el.kind === "icon" && !icons[el.name]) {
      fail(`${id}: element ${el.id} icon "${el.name}" not found in @iconify-json/tabler`);
    }
  }

  totalElements += els.length;
}

console.log(`OK ${slides.length} slides, ${totalElements} elements`);
