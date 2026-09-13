#!/usr/bin/env node
// Synthesize marker-squeak and eraser-swipe SFX for the whiteboard theme,
// using ffmpeg's audio filters only — no downloads, no samples.
//
// Usage: node scripts/gen-sfx.mjs [--dry-run]
//
// Each squeak is a short filtered-noise burst (marker-on-whiteboard rasp)
// layered with a rising sine chirp (1.8kHz -> 3.2kHz, the squeak's pitch),
// bandpassed, faded in/out, and normalized to a -24 dBFS peak.
// erase.wav is a longer bandpassed noise whoosh at -22 dBFS.
//
// All output is 24kHz mono 16-bit PCM wav in public/audio/sfx/.
// Fails loudly (exit 1) on any ffmpeg non-zero exit.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/audio/sfx");
const SR = 24000;

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8" });
  if (res.error) throw new Error(`${cmd} failed to start: ${res.error.message}`);
  if (res.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited ${res.status}\nstderr: ${res.stderr}`);
  }
  return res;
}

// One squeak: a bandpassed white-noise burst (the marker's rasp) mixed with
// a rising sine chirp (chirpLow -> chirpHigh Hz, a linear-frequency sweep via
// aevalsrc), then faded in/out and scaled to roughly -24 dBFS peak.
function buildSqueak(outFile, durationS, chirpLow, chirpHigh, seed, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] squeak -> ${outFile} (${durationS}s, chirp ${chirpLow}-${chirpHigh}Hz, seed ${seed})`);
    return;
  }
  const fade = Math.min(0.03, durationS / 6);
  const fadeOutStart = (durationS - fade).toFixed(3);
  const k = (chirpHigh - chirpLow) / durationS; // Hz/s sweep rate
  const chirpExpr = `sin(2*PI*(${chirpLow}*t+0.5*${k}*t*t))`;

  const filterComplex =
    `[0:a]bandpass=f=2400:width_type=h:w=1600[noise];` +
    `[1:a]highpass=f=1500,lowpass=f=3500[chirp];` +
    `[noise][chirp]amix=inputs=2:duration=first:weights=1 0.7[mix];` +
    `[mix]afade=t=in:st=0:d=${fade},afade=t=out:st=${fadeOutStart}:d=${fade},volume=-21.5dB[out]`;

  run("ffmpeg", [
    "-y",
    "-f", "lavfi", "-i", `anoisesrc=color=white:duration=${durationS}:sample_rate=${SR}:seed=${seed}`,
    "-f", "lavfi", "-i", `aevalsrc=exprs='${chirpExpr}':s=${SR}:d=${durationS}`,
    "-filter_complex", filterComplex,
    "-map", "[out]",
    "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le",
    outFile,
  ]);
}

function buildErase(outFile, durationS, dryRun) {
  if (dryRun) {
    console.log(`[dry-run] erase -> ${outFile} (${durationS}s)`);
    return;
  }
  const fade = 0.12;
  run("ffmpeg", [
    "-y",
    "-f", "lavfi", "-i", `anoisesrc=color=pink:duration=${durationS}:sample_rate=${SR}:seed=42`,
    "-af",
    `bandpass=f=1200:width_type=h:w=1800,` +
      `afade=t=in:st=0:d=${fade},afade=t=out:st=${(durationS - fade).toFixed(3)}:d=${fade},` +
      `volume=-11dB`,
    "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le",
    outFile,
  ]);
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  mkdirSync(OUT_DIR, { recursive: true });

  const squeaks = [
    { file: "squeak-1.wav", duration: 0.22, chirpLow: 1800, chirpHigh: 3200, seed: 1 },
    { file: "squeak-2.wav", duration: 0.18, chirpLow: 2000, chirpHigh: 3200, seed: 2 },
    { file: "squeak-3.wav", duration: 0.3, chirpLow: 1800, chirpHigh: 3000, seed: 3 },
  ];

  for (const s of squeaks) {
    const outFile = path.join(OUT_DIR, s.file);
    if (existsSync(outFile) && !dryRun) {
      console.log(`skip ${s.file} (exists)`);
      continue;
    }
    buildSqueak(outFile, s.duration, s.chirpLow, s.chirpHigh, s.seed, dryRun);
    console.log(`ok ${s.file}`);
  }

  const eraseFile = path.join(OUT_DIR, "erase.wav");
  if (existsSync(eraseFile) && !dryRun) {
    console.log("skip erase.wav (exists)");
  } else {
    buildErase(eraseFile, 0.6, dryRun);
    console.log("ok erase.wav");
  }

  if (dryRun) console.log("Dry run complete. No files written.");
}

main();
