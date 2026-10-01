#!/usr/bin/env node
// Ingests anurag_pg_audio.zip from ~/Downloads/ into public/audio/pg/

import { existsSync, mkdirSync, rmSync } from "node:fs";
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
console.log("Ingestion complete! Local audio in public/audio/pg/ updated with Anurag VoxCPM2 LoRA audio.");
