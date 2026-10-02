#!/usr/bin/env node
// Ingests anurag_pg_audio.zip from ~/Downloads/ into public/audio/pg/,
// updates data/pg_scenes.json with exact audio durations,
// and updates remotion/Root.tsx with the calculated total frames.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(".");
const TARGET_DIR = path.join(ROOT, "public/audio/pg");
const HOME = process.env.HOME;
const ZIP_PATHS = [
  path.join(HOME, "Downloads/anurag_pg_audio.zip"),
  path.join(ROOT, "anurag_pg_audio.zip"),
  path.join(ROOT, "out/anurag_pg_audio.zip"),
];

const foundZip = ZIP_PATHS.find((p) => existsSync(p));
if (!foundZip) {
  console.error("Could not find anurag_pg_audio.zip in ~/Downloads/ or current directory.");
  process.exit(1);
}

console.log(`Found audio zip: ${foundZip}`);
mkdirSync(TARGET_DIR, { recursive: true });

console.log(`Unzipping into ${TARGET_DIR}...`);
execSync(`unzip -q -o "${foundZip}" -d "${TARGET_DIR}"`);
console.log("Unzipped WAV files into public/audio/pg/");

// 2. Measure exact duration of each ingested WAV
console.log("Measuring audio durations and recalculating scene timelines...");
const scenesPath = path.join(ROOT, "data/pg_scenes.json");
const scenes = JSON.parse(readFileSync(scenesPath, "utf8"));

let totalVideoSec = 0;

for (const scene of scenes) {
  const sid = scene.id;
  const l0Path = path.join(TARGET_DIR, `${sid}_s0.wav`);
  const l1Path = path.join(TARGET_DIR, `${sid}_s1.wav`);

  if (!existsSync(l0Path) || !existsSync(l1Path)) {
    console.warn(`Warning: Missing audio files for ${sid}`);
    continue;
  }

  const getDur = (p) => {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${p}"`).toString().trim();
    return parseFloat(out);
  };

  const dur0 = Math.round(getDur(l0Path) * 100) / 100;
  const dur1 = Math.round(getDur(l1Path) * 100) / 100;

  scene.line0Dur = dur0;
  scene.line1Dur = dur1;
  scene.lines[0].durationSec = dur0;
  scene.lines[1].durationSec = dur1;
  scene.lineDurs = [dur0, dur1];

  const padding = scene.isPartStart ? 1.6 : 0.8;
  const p0 = scene.lines[0].pause_s || 0.5;
  const p1 = scene.lines[1].pause_s || 0.6;
  const cushion = 1.2;
  const totalSec = Math.round((padding + dur0 + p0 + dur1 + p1 + cushion) * 10) / 10;

  scene.durationSec = totalSec;
  totalVideoSec += totalSec;

  console.log(`  [${sid}] Line 0: ${dur0}s | Line 1: ${dur1}s -> Total Scene: ${totalSec}s`);
}

writeFileSync(scenesPath, JSON.stringify(scenes, null, 2));
console.log(`Updated ${scenesPath}`);

const totalFrames = Math.round(totalVideoSec * 30);
console.log(`\nTotal Video Runtime: ${totalVideoSec.toFixed(1)}s (${(totalVideoSec / 60).toFixed(2)} min, ${totalFrames} frames @ 30fps)`);

// 3. Update remotion/Root.tsx with new durationInFrames
const rootPath = path.join(ROOT, "remotion/Root.tsx");
let rootContent = readFileSync(rootPath, "utf8");
rootContent = rootContent.replace(
  /id="PGEpisodeV1"[\s\S]*?durationInFrames=\{(\d+)\}/,
  (match) => match.replace(/durationInFrames=\{(\d+)\}/, `durationInFrames={${totalFrames}}`)
);
writeFileSync(rootPath, rootContent);
console.log(`Updated remotion/Root.tsx durationInFrames to ${totalFrames}`);
console.log("\nReady for master render!");
