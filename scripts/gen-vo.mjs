#!/usr/bin/env node
// Regenerate narration audio per sentence for one or more slides.
//
// Usage:
//   node scripts/gen-vo.mjs [--only b01,b03] [--dry-run]
//
// For each targeted slide, for each sentence:
//   1. `say -v Tara -r 138` renders an AIFF.
//   2. ffmpeg converts to a 24kHz mono 16-bit PCM wav (public/audio/<id>_s<i>.wav).
//   3. Leading and trailing silence are always trimmed with ffmpeg silenceremove
//      (say pads the start of every clip): leading trim keeps 80ms of room
//      (start_threshold=-45dB:start_silence=0.08), trailing trim keeps 120ms
//      (via areverse + the same silenceremove with start_silence=0.12 + areverse
//      back).
//   4. ffprobe reports the final duration.
//
// sentence_timings are rebuilt: local_start accumulates duration + pause_s (pause_s
// comes from video_script.script_lines[i].pause_s, default 0.4 when absent).
// global_start is a running offset across the whole slides array in array order,
// with DIVIDER_SECONDS (2.5s, see remotion/types.ts) added once per part change
// (documented here rather than read from the timeline builder, since this script
// does not import Remotion's Episode.tsx).
// slide.duration = last local_start + last duration + SLIDE_TAIL_SECONDS (0.6s).
//
// A per-slide preview `public/audio/<id>.mp3` is also built by concatenating the
// sentence wavs with anullsrc/adelay silence gaps equal to pause_s, and
// slide.audio is set to '/audio/<id>.mp3'.
//
// The script reads data/slides.json fresh at run time and rewrites only:
//   slide.sentence_timings, slide.duration, slide.audio
// for the targeted slides. Everything else in the file (including slides this
// script does not touch, and any other fields on touched slides) is left as-is,
// and object key order is preserved via JSON.parse (insertion order) + a merge
// that only overwrites the three fields above.
//
// Fails loudly (exit 1) on any `say` or ffmpeg non-zero exit — never falls back
// to a different voice or silently continues.

import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const SLIDES_PATH = path.resolve("data/slides.json");
const AUDIO_DIR = path.resolve("public/audio");
const DIVIDER_SECONDS = 2.5;
const SLIDE_TAIL_SECONDS = 0.6;
const DEFAULT_PAUSE_S = 0.4;
const VOICE = "Tara";
const RATE = "138";

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

function ffprobeDuration(file) {
  const res = run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    file,
  ]);
  const d = parseFloat(res.stdout.trim());
  if (!Number.isFinite(d)) throw new Error(`ffprobe returned no duration for ${file}`);
  return d;
}

// Always trim leading silence (keeping 80ms of room) and trailing silence
// (keeping 120ms of room). `say` pads the start of every clip, so this runs
// unconditionally rather than gating on a separate silencedetect pass.
function trimSilence(wavPath) {
  const trimmed = wavPath + ".trimmed.wav";
  run("ffmpeg", [
    "-y", "-i", wavPath,
    "-af",
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08," +
      "areverse," +
      "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12," +
      "areverse",
    "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le",
    trimmed,
  ]);
  unlinkSync(wavPath);
  writeFileSync(wavPath, readFileSync(trimmed));
  unlinkSync(trimmed);
}

function synthesizeSentence(id, i, text, dryRun) {
  const wavPath = path.join(AUDIO_DIR, `${id}_s${i}.wav`);
  if (dryRun) {
    console.log(`  [dry-run] ${id} s${i}: say -v ${VOICE} -r ${RATE} -> ${wavPath}`);
    return { wavPath, duration: 0 };
  }
  const tmpDir = mkdtempSync(path.join(tmpdir(), "gen-vo-"));
  const aiffPath = path.join(tmpDir, `${id}_s${i}.aiff`);
  try {
    run("say", ["-v", VOICE, "-r", RATE, "-o", aiffPath, text]);
    if (!existsSync(aiffPath)) throw new Error(`say produced no output for ${id} s${i}`);
    run("ffmpeg", [
      "-y", "-i", aiffPath,
      "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le",
      wavPath,
    ]);
    trimSilence(wavPath);
    const duration = ffprobeDuration(wavPath);
    return { wavPath, duration };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

function buildPreviewMp3(id, sentenceCount, pauses, dryRun) {
  const outPath = path.join(AUDIO_DIR, `${id}.mp3`);
  if (dryRun) {
    console.log(`  [dry-run] ${id}: concat ${sentenceCount} wavs -> ${outPath}`);
    return outPath;
  }
  // Build an ffmpeg filter graph: each wav input, followed by an anullsrc-derived
  // silence of pause_s seconds after every sentence except the last.
  const inputs = [];
  for (let i = 0; i < sentenceCount; i++) {
    inputs.push("-i", path.join(AUDIO_DIR, `${id}_s${i}.wav`));
  }
  const filterParts = [];
  const concatLabels = [];
  for (let i = 0; i < sentenceCount; i++) {
    filterParts.push(`[${i}:a]anull[a${i}]`);
    concatLabels.push(`[a${i}]`);
    if (i < sentenceCount - 1) {
      const pause = pauses[i] ?? DEFAULT_PAUSE_S;
      const label = `sil${i}`;
      filterParts.push(
        `anullsrc=r=24000:cl=mono:d=${pause}[${label}]`
      );
      concatLabels.push(`[${label}]`);
    }
  }
  const filter = `${filterParts.join(";")};${concatLabels.join("")}concat=n=${concatLabels.length}:v=0:a=1[out]`;
  run("ffmpeg", [
    "-y",
    ...inputs,
    "-filter_complex", filter,
    "-map", "[out]",
    "-c:a", "libmp3lame", "-b:a", "96k",
    outPath,
  ]);
  return outPath;
}

function deleteOldMp3s(id, dryRun) {
  const files = readdirSync(AUDIO_DIR).filter(
    (f) => f.startsWith(`${id}_s`) && f.endsWith(".mp3")
  );
  for (const f of files) {
    const full = path.join(AUDIO_DIR, f);
    if (dryRun) {
      console.log(`  [dry-run] would delete ${full}`);
    } else {
      unlinkSync(full);
    }
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const raw = readFileSync(SLIDES_PATH, "utf8");
  const slides = JSON.parse(raw);

  const targetIds = args.only ? new Set(args.only) : null;

  // Running episode offset across the array in order, +DIVIDER_SECONDS per part change.
  let episodeOffset = 0;
  let prevPart = null;

  for (const slide of slides) {
    const isTarget = !targetIds || targetIds.has(slide.id);

    if (prevPart !== null && slide.part !== prevPart) {
      episodeOffset += DIVIDER_SECONDS;
    }
    prevPart = slide.part;

    if (!isTarget) {
      // Not regenerating; keep the existing recorded duration for offset bookkeeping.
      episodeOffset += typeof slide.duration === "number" ? slide.duration : 0;
      continue;
    }

    const sentences = slide.sentences || [];
    const scriptLines = slide.video_script?.script_lines || [];
    console.log(`slide ${slide.id}: ${sentences.length} sentence(s)`);

    const timings = [];
    let localStart = 0;
    const durations = [];
    const pauses = [];

    for (let i = 0; i < sentences.length; i++) {
      const text = sentences[i];
      const pause = scriptLines[i]?.pause_s ?? DEFAULT_PAUSE_S;
      pauses.push(pause);

      const { duration } = synthesizeSentence(slide.id, i, text, args.dryRun);
      durations.push(duration);

      timings.push({
        sentence_idx: i,
        text,
        local_start: localStart,
        duration,
        global_start: episodeOffset + localStart,
      });

      localStart += duration + pause;
    }

    if (!args.dryRun) {
      deleteOldMp3s(slide.id, args.dryRun);
    }
    buildPreviewMp3(slide.id, sentences.length, pauses, args.dryRun);

    const lastDuration = durations.length ? durations[durations.length - 1] : 0;
    const lastLocalStart = timings.length ? timings[timings.length - 1].local_start : 0;
    const newDuration = lastLocalStart + lastDuration + SLIDE_TAIL_SECONDS;

    if (!args.dryRun) {
      slide.sentence_timings = timings;
      slide.duration = newDuration;
      slide.audio = `/audio/${slide.id}.mp3`;
    }

    episodeOffset += newDuration;

    const totalSpeech = durations.reduce((a, b) => a + b, 0);
    console.log(
      `  -> duration=${newDuration.toFixed(3)}s speech=${totalSpeech.toFixed(3)}s sentences=${sentences.length}${args.dryRun ? " [dry-run, not written]" : ""}`
    );
  }

  if (args.dryRun) {
    console.log("Dry run complete. No files written.");
    return;
  }

  writeFileSync(SLIDES_PATH, JSON.stringify(slides, null, 2) + "\n");
  console.log(`Wrote ${SLIDES_PATH}`);
}

main();
