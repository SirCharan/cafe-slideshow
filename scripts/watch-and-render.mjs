import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const ROOT = path.resolve(".");
const DOWNLOADS_DIR = path.join(os.homedir(), "Downloads");
const TARGET_AUDIO_DIR = path.join(ROOT, "public/audio/v3");
const ZIP_PATH = path.join(DOWNLOADS_DIR, "anurag_v3_audio.zip");

console.log("=================================================");
console.log("   NOT A STARTUP - V3 AUTO INGEST & RENDER ENGINE");
console.log("=================================================");
console.log(`Watching for: ${ZIP_PATH}`);
console.log("Waiting for Colab to finish voice download...\n");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // 1. Wait for zip file if not present
  while (!existsSync(ZIP_PATH)) {
    process.stdout.write(".");
    await sleep(2000);
  }

  console.log(`\n\n🎉 Detected ${ZIP_PATH}!`);
  console.log("Step 1: Ingesting audio files...");

  // Ingest
  execSync(`node scripts/ingest-v3-voice.mjs "${ZIP_PATH}"`, { stdio: "inherit" });

  // 2. Measure actual audio durations
  console.log("\nStep 2: Syncing audio durations into SceneEngine.tsx...");
  const durations = {};
  for (let i = 1; i <= 12; i++) {
    const sc = `scene_${String(i).padStart(2, "0")}`;
    const s0Path = path.join(TARGET_AUDIO_DIR, `${sc}_s0.wav`);
    const s1Path = path.join(TARGET_AUDIO_DIR, `${sc}_s1.wav`);
    
    if (existsSync(s0Path)) {
      const dur0 = parseFloat(
        execSync(
          `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${s0Path}"`,
          { encoding: "utf8" }
        ).trim()
      );
      durations[`${sc}_s0`] = dur0;
    }
    if (existsSync(s1Path)) {
      const dur1 = parseFloat(
        execSync(
          `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${s1Path}"`,
          { encoding: "utf8" }
        ).trim()
      );
      durations[`${sc}_s1`] = dur1;
    }
  }

  // Update line0Dur in SceneEngine.tsx if different
  const enginePath = path.join(ROOT, "remotion/scenes/SceneEngine.tsx");
  let engineContent = readFileSync(enginePath, "utf8");

  for (let i = 1; i <= 12; i++) {
    const sc = `scene_${String(i).padStart(2, "0")}`;
    const dur0 = durations[`${sc}_s0`];
    const dur1 = durations[`${sc}_s1`];
    if (dur0 && dur1) {
      // Find scene block and update line0Dur and durationSec
      const sceneRegex = new RegExp(`id:\\s*"${sc}"[\\s\\S]*?durationSec:\\s*\\d+([\\s\\S]*?line0Dur:\\s*)[0-9.]+`);
      if (sceneRegex.test(engineContent)) {
        const totalSec = Math.ceil(dur0 + dur1 + 3.0); // voice lines + pauses + scene padding
        engineContent = engineContent.replace(
          new RegExp(`(id:\\s*"${sc}"[\\s\\S]*?durationSec:\\s*)\\d+`),
          `$1${totalSec}`
        );
        engineContent = engineContent.replace(
          new RegExp(`(id:\\s*"${sc}"[\\s\\S]*?line0Dur:\\s*)[0-9.]+`),
          `$1${dur0.toFixed(1)}`
        );
      }
    }
  }
  writeFileSync(enginePath, engineContent);
  console.log("✓ SceneEngine.tsx synced with exact spoken durations.");

  // 3. Master Render
  console.log("\nStep 3: Rendering Master MP4 (1080p @ 30fps)...");
  const rawMp4 = path.join(ROOT, "out/cafe-blr-001-v3.mp4");
  const normMp4 = path.join(ROOT, "out/cafe-blr-001-v3.norm.mp4");

  execSync(`npx remotion render remotion/index.ts CafeEpisodeV3 "${rawMp4}" --codec=h264 --audio-codec=aac`, {
    stdio: "inherit",
  });

  // 4. Loudness Normalization
  console.log("\nStep 4: Applying EBU R128 (-14 LUFS) broadcast loudness normalization...");
  execSync(`bash scripts/loudnorm.sh "${rawMp4}" "${normMp4}"`, { stdio: "inherit" });

  // 5. Verification Gates
  console.log("\nStep 5: Verifying all broadcast quality gates...");
  execSync(`bash scripts/check-gates.sh "${normMp4}"`, { stdio: "inherit" });

  console.log("\n=================================================");
  console.log("🏆 MASTER DELIVERABLE READY!");
  console.log(`File: ${normMp4}`);
  console.log("All quality gates PASSED.");
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
