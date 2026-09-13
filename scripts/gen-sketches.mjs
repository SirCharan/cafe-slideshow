#!/usr/bin/env node
// Generate black-marker whiteboard sketches (transparent PNG) for the
// Remotion explainer, using Draw Things CLI running Flux Klein locally.
//
// Usage:
//   node scripts/gen-sketches.mjs [--only cafe-front,croissant] [--dry-run]
//
// For each sketch name (skipped if public/assets/sketch/<name>.png already
// exists — idempotent, so --only can be used to re-run just the ones that
// failed the color check):
//   1. `draw-things-cli generate --model flux_2_klein_4b_q6p.ckpt` renders a
//      1024x1024 PNG (white background) to a temp file.
//   2. ffmpeg `colorkey=white:0.28:0.12,format=rgba` keys the white out to
//      transparency; ffprobe confirms the output stream is pix_fmt rgba.
//      If colorkey leaves a grey halo around strokes, bump the similarity
//      threshold to 0.35 (see KEY_SIMILARITY below).
//
// Writes public/assets/sketch/manifest.json: [{name, subject, prompt, file}]
// for every sketch that now exists on disk (in SKETCHES order).
//
// Fails loudly (exit 1) on any draw-things-cli or ffmpeg non-zero exit —
// never falls back to a different model silently.

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const OUT_DIR = path.resolve("public/assets/sketch");
const MODEL = "flux_2_klein_4b_q6p.ckpt";
const STEPS = process.env.SKETCH_STEPS ?? "20";
const CFG = "3.5";
const SIZE = process.env.SKETCH_SIZE ?? "1024";
const KEY_COLOR = "white";
const KEY_SIMILARITY = "0.28";
const KEY_BLEND = "0.12";

const STYLE_SUFFIX =
  "whiteboard explainer illustration, simple clean line art, thick marker strokes, " +
  "white background, no shading, no color, no text, no letters, centered, single object";
const NEGATIVE_PROMPT =
  "color, photo, realistic, shading, gradient, text, letters, watermark, background scenery, blurry";

// name -> subject. Order is preserved in manifest.json.
const SKETCHES = [
  ["cafe-front", "a small independent café storefront with an awning"],
  ["espresso-machine", "an espresso machine"],
  ["croissant", "a croissant"],
  ["coffee-cup", "a takeaway coffee cup"],
  ["laptop-table", "a laptop on a café table"],
  ["cash-register", "a cash register"],
  ["receipt", "a paper receipt"],
  ["lease-document", "a rental agreement document with a pen"],
  ["keys", "a bunch of keys"],
  ["office-building", "a small government office building"],
  ["licence-certificate", "a framed licence certificate"],
  ["delivery-scooter", "a delivery rider on a scooter with a delivery bag"],
  ["electricity-meter", "a wall-mounted electricity meter box"],
  ["kitchen-counter", "a commercial kitchen counter"],
  ["chair-table", "a café chair and a round table"],
  ["beans-sack", "a sack of coffee beans"],
  ["refrigerator", "a commercial refrigerator"],
  ["signboard", "a hanging shop signboard, blank"],
  ["queue-people", "a queue of five simple people"],
  ["tiny-cafe", "a hole-in-the-wall café counter"],
  ["mid-cafe", "a medium-sized café interior with six tables"],
  ["glass-cafe", "a glass-front high-street café"],
  ["chain-logo-board", "a café chain menu board, blank"],
  ["calendar", "a wall calendar"],
  ["gauge-dial", "a round gauge with a needle"],
  ["bangalore-skyline", "a simple Bangalore skyline with the Vidhana Soudha dome"],
  ["shop-shutter", "a closed shop shutter"],
  ["cheque", "a bank cheque"],
  ["barista-pouring", "a barista pouring a latte"],
  ["coffee-grinder", "a coffee grinder"],
];

function buildPrompt(subject) {
  return `black marker sketch of ${subject}, ${STYLE_SUFFIX}`;
}

function parseArgs(argv) {
  const args = { only: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--only") {
      args.only = (argv[++i] || "").split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--dry-run") {
      args.dryRun = true;
    }
  }
  return args;
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (res.error) {
    throw new Error(`${cmd} failed to start: ${res.error.message}`);
  }
  if (res.status !== 0) {
    throw new Error(
      `${cmd} ${args.join(" ")} exited ${res.status}\nstdout: ${res.stdout}\nstderr: ${res.stderr}`
    );
  }
  return res;
}

function ffprobePixFmt(file) {
  const res = run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=pix_fmt",
    "-of", "csv=p=0",
    file,
  ]);
  return res.stdout.trim();
}

function generateSketch(name, subject, dryRun) {
  const outFile = path.join(OUT_DIR, `${name}.png`);
  const prompt = buildPrompt(subject);

  if (existsSync(outFile)) {
    console.log(`skip ${name} (exists)`);
    return { name, subject, prompt, file: `assets/sketch/${name}.png`, skipped: true };
  }

  if (dryRun) {
    console.log(`[dry-run] ${name}: ${prompt}`);
    return { name, subject, prompt, file: `assets/sketch/${name}.png`, skipped: true };
  }

  const started = Date.now();
  const tmpDir = mkdtempSync(path.join(tmpdir(), "gen-sketch-"));
  const rawFile = path.join(tmpDir, `${name}-raw.png`);
  try {
    run("draw-things-cli", [
      "generate", ...(process.env.SKETCH_CLOUD ? ["--cloud-compute"] : []),
      "--model", MODEL,
      "--prompt", prompt,
      "--negative-prompt", NEGATIVE_PROMPT,
      "--steps", STEPS,
      "--cfg", CFG,
      "--width", SIZE,
      "--height", SIZE,
      "--output", rawFile,
    ]);
    if (!existsSync(rawFile)) throw new Error(`draw-things-cli produced no output for ${name}`);

    run("ffmpeg", [
      "-y", "-i", rawFile,
      "-vf", `colorkey=${KEY_COLOR}:${KEY_SIMILARITY}:${KEY_BLEND},format=rgba`,
      "-frames:v", "1", "-update", "1",
      outFile,
    ]);

    const pixFmt = ffprobePixFmt(outFile);
    if (pixFmt !== "rgba") {
      throw new Error(`${name}: expected pix_fmt rgba after colorkey, got "${pixFmt}"`);
    }

    const secs = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`ok ${name} (${secs}s)`);
    return { name, subject, prompt, file: `assets/sketch/${name}.png`, skipped: false };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  mkdirSync(OUT_DIR, { recursive: true });

  const targetNames = args.only ? new Set(args.only) : null;
  const results = [];

  const failed = [];
  for (const [name, subject] of SKETCHES) {
    if (targetNames && !targetNames.has(name)) continue;
    // Retry transient backend errors (cloud "Remote echo timed out", Metal OOM) up to 3 times,
    // then continue with the next sketch so one hiccup never aborts the batch.
    let done = false;
    for (let attempt = 1; attempt <= 3 && !done; attempt++) {
      try {
        results.push(generateSketch(name, subject, args.dryRun));
        done = true;
      } catch (err) {
        console.error(`retry ${attempt}/3 ${name}: ${String(err.message).split("\n").find((l) => /Error:|timed out|Memory/.test(l)) ?? err.message.slice(0, 120)}`);
        if (attempt < 3) spawnSync("sleep", ["15"]);
      }
    }
    if (!done) failed.push(name);
  }
  if (failed.length) console.error(`FAILED after retries: ${failed.join(", ")}`);

  if (args.dryRun) {
    console.log("Dry run complete. No files written.");
    return;
  }
  process.exitCode = failed.length ? 1 : 0;

  // Rebuild manifest from every sketch that currently exists on disk (in
  // SKETCHES order), not just the ones touched this run.
  const manifest = SKETCHES
    .filter(([name]) => existsSync(path.join(OUT_DIR, `${name}.png`)))
    .map(([name, subject]) => ({
      name,
      subject,
      prompt: buildPrompt(subject),
      file: `assets/sketch/${name}.png`,
    }));

  writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log(`Wrote ${path.join(OUT_DIR, "manifest.json")} (${manifest.length} sketches)`);
}

main();
