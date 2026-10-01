#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(".");
const MANIFEST_PATH = path.join(ROOT, "out/v3-voice-bundle/manifest.json");
const OUT_DIR = path.join(ROOT, "public/audio/v3");

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
console.log(`Generating local draft voice audio for ${manifest.length} sentences...`);

for (let i = 0; i < manifest.length; i++) {
  const item = manifest[i];
  const outWav = path.join(OUT_DIR, `${item.id}.wav`);
  const text = item.tts_text || item.text;
  const tempAiff = path.join(OUT_DIR, `temp_${item.id}.aiff`);
  
  // Use macOS Rishi (Indian English) or Samantha/Tara
  try {
    execSync(`say -v Rishi -r 145 "${text.replace(/"/g, '\\"')}" -o "${tempAiff}"`);
  } catch (e) {
    execSync(`say -r 145 "${text.replace(/"/g, '\\"')}" -o "${tempAiff}"`);
  }
  
  // Convert to 24kHz mono 16-bit PCM wav
  execSync(`ffmpeg -y -i "${tempAiff}" -ar 24000 -ac 1 -c:a pcm_s16le "${outWav}" 2>/dev/null`);
  execSync(`rm -f "${tempAiff}"`);
  console.log(`[${i+1}/${manifest.length}] Generated ${item.id}.wav`);
}

console.log("Local draft narration audio ready in public/audio/v3/!");
