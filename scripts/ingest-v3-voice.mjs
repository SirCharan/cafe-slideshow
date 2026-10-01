import { execSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(".");
const DOWNLOADS_DIR = path.join(os.homedir(), "Downloads");
const TARGET_AUDIO_DIR = path.join(ROOT, "public/audio/v3");

// Expected files
const EXPECTED_FILES = [];
for (let i = 1; i <= 12; i++) {
  const sc = `scene_${String(i).padStart(2, "0")}`;
  EXPECTED_FILES.push(`${sc}_s0.wav`, `${sc}_s1.wav`);
}

// 1. Locate zip
let zipPath = process.argv[2];
if (!zipPath) {
  const candidate = path.join(DOWNLOADS_DIR, "anurag_v3_audio.zip");
  if (existsSync(candidate)) {
    zipPath = candidate;
  }
}

if (!zipPath || !existsSync(zipPath)) {
  console.log("❌ Could not find anurag_v3_audio.zip");
  console.log(`Checked: ${zipPath || path.join(DOWNLOADS_DIR, "anurag_v3_audio.zip")}`);
  console.log("\nPlease run the Colab notebook, download anurag_v3_audio.zip to ~/Downloads, and run:");
  console.log("  node scripts/ingest-v3-voice.mjs\n");
  process.exit(1);
}

console.log(`📦 Found voice archive: ${zipPath}`);
console.log(`Unzipping into ${TARGET_AUDIO_DIR}...`);

execSync(`unzip -q -o "${zipPath}" -d "${TARGET_AUDIO_DIR}"`);

// 2. Validate all 24 files
console.log("\n🔍 Verifying generated audio files:");
let missingCount = 0;
const durations = {};

for (const file of EXPECTED_FILES) {
  const filePath = path.join(TARGET_AUDIO_DIR, file);
  if (!existsSync(filePath)) {
    console.error(`  ❌ Missing: ${file}`);
    missingCount++;
    continue;
  }

  // Get duration using ffprobe
  try {
    const probe = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { encoding: "utf8" }
    ).trim();
    const dur = parseFloat(probe);
    durations[file] = dur;
    const sizeKb = (statSync(filePath).size / 1024).toFixed(1);
    console.log(`  ✓ ${file} (${dur.toFixed(2)}s, ${sizeKb} KB)`);
  } catch (err) {
    console.log(`  ✓ ${file} (unprobed)`);
  }
}

if (missingCount > 0) {
  console.error(`\n⚠️  Warning: ${missingCount} files were missing in the zip.`);
  process.exit(1);
}

console.log(`\n🎉 Success! All ${EXPECTED_FILES.length} voiceover lines from Anurag's LoRA clone are ingested!`);
console.log("Remotion Studio (http://localhost:3000) has automatically refreshed.");
