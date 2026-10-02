#!/usr/bin/env node
// Automatically waits for ~/Downloads/anurag_cafe_audio.zip,
// ingests it, renders the Ledger episode, runs loudness normalization,
// and checks all broadcast gates.

import { existsSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const ZIP_PATH = path.join(os.homedir(), "Downloads/anurag_cafe_audio.zip");
const ROOT = path.resolve(".");

console.log(`Waiting for ${ZIP_PATH} to appear in ~/Downloads...`);

let lastSize = -1;
let stableCount = 0;

const interval = setInterval(() => {
  if (existsSync(ZIP_PATH)) {
    const size = statSync(ZIP_PATH).size;
    if (size > 0 && size === lastSize) {
      stableCount++;
    } else {
      stableCount = 0;
      lastSize = size;
    }

    // Wait until download is complete (file size stable for 3 checks = 3s)
    if (stableCount >= 3) {
      clearInterval(interval);
      console.log(`\nFound completed download (${(size / 1024 / 1024).toFixed(2)} MB). Starting pipeline...`);

      try {
        console.log("\n--- STEP 1: Ingesting audio files & updating timeline ---");
        execSync(`node scripts/gen-vo.mjs --ingest "${ZIP_PATH}"`, { stdio: "inherit", cwd: ROOT });

        console.log("\n--- STEP 2: Rendering Ledger theme video with Remotion ---");
        execSync(`npm run render:ledger`, { stdio: "inherit", cwd: ROOT });

        console.log("\n--- STEP 3: Loudness normalization (-14 LUFS) ---");
        execSync(`bash scripts/loudnorm.sh out/cafe-blr-001-ledger.mp4 out/cafe-blr-001-ledger.norm.mp4`, { stdio: "inherit", cwd: ROOT });

        console.log("\n--- STEP 4: Checking broadcast QA gates ---");
        execSync(`bash scripts/check-gates.sh out/cafe-blr-001-ledger.norm.mp4`, { stdio: "inherit", cwd: ROOT });

        console.log("\nALL STEPS FINISHED SUCCESSFULLY!");
      } catch (err) {
        console.error("Pipeline failed:", err.message);
        process.exit(1);
      }
    } else {
      process.stdout.write(`\rFile downloading: ${(size / 1024 / 1024).toFixed(2)} MB...`);
    }
  } else {
    process.stdout.write(".");
  }
}, 1000);
