#!/usr/bin/env node
// Packages the VoxCPM2 LoRA weights, dual reference audio (ref_expressive_1 + ref4),
// and all 24 PG drama sentences into a zip bundle, uploads it to Vercel Blob,
// and creates colab/anurag_pg_voice_render.ipynb.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(".");
const MANIFEST_PATH = path.join(ROOT, "data/pg_manifest.json");
const LORA_DIR = "/Users/ck/claude/misterfinance-research/factory/voice-studio/data/lora/anurag_voxcpm2_r32";
const BUNDLE_DIR = path.join(ROOT, "out/anurag-pg-bundle");
const ZIP_PATH = path.join(ROOT, "out/anurag-pg-render-bundle.zip");
const COLAB_DIR = path.join(ROOT, "colab");

mkdirSync(BUNDLE_DIR, { recursive: true });
mkdirSync(COLAB_DIR, { recursive: true });

// 1. Read manifest and ensure both voice_ref and ref_audio fields exist
const rawManifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const manifest = rawManifest.map((item) => ({
  ...item,
  voice_ref: item.ref_audio || item.voice_ref || "ref_expressive_1",
}));
writeFileSync(path.join(BUNDLE_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Copied manifest with ${manifest.length} sentences.`);

// 2. Copy LoRA weights and reference audio (both ref_expressive_1 and ref4)
copyFileSync(path.join(LORA_DIR, "step_0000326.safetensors"), path.join(BUNDLE_DIR, "lora_weights.safetensors"));
copyFileSync(path.join(LORA_DIR, "lora_config.json"), path.join(BUNDLE_DIR, "lora_config.json"));
copyFileSync(path.join(LORA_DIR, "ref_expressive_1.wav"), path.join(BUNDLE_DIR, "ref_expressive_1.wav"));
copyFileSync(path.join(LORA_DIR, "ref_expressive_1.txt"), path.join(BUNDLE_DIR, "ref_expressive_1.txt"));
copyFileSync(path.join(LORA_DIR, "ref4.wav"), path.join(BUNDLE_DIR, "ref4.wav"));
copyFileSync(path.join(LORA_DIR, "ref4.txt"), path.join(BUNDLE_DIR, "ref4.txt"));
console.log("Copied LoRA weights and dual reference audio files.");

// 3. Write render_pg_colab.py to run inside Colab
const renderPy = `import json, os, time, zipfile
import numpy as np
import soundfile as sf
import torch
from voxcpm import VoxCPM
from voxcpm.model.voxcpm import LoRAConfig

print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))

BUNDLE = "anurag-pg-bundle"
lc = json.load(open(f"{BUNDLE}/lora_config.json"))["lora_config"]
print("Loading VoxCPM2 model with LoRA weights (step_0000326)...")
t0 = time.time()
model = VoxCPM.from_pretrained(
    hf_model_id="openbmb/VoxCPM2",
    load_denoiser=False,
    lora_weights_path=f"{BUNDLE}/lora_weights.safetensors",
    lora_config=LoRAConfig(**lc)
)
print(f"Model loaded in {time.time() - t0:.1f}s")

sr = model.tts_model.sample_rate

refs = {
    "ref_expressive_1": {
        "wav": f"{BUNDLE}/ref_expressive_1.wav",
        "txt": open(f"{BUNDLE}/ref_expressive_1.txt").read().strip(),
    },
    "ref4": {
        "wav": f"{BUNDLE}/ref4.wav",
        "txt": open(f"{BUNDLE}/ref4.txt").read().strip(),
    }
}

manifest = json.load(open(f"{BUNDLE}/manifest.json"))
OUT_DIR = "audio_out"
os.makedirs(OUT_DIR, exist_ok=True)

print(f"Starting batch synthesis for {len(manifest)} sentences for Episode 02 (PG Hostels)...")
start_all = time.time()

for i, item in enumerate(manifest):
    t_start = time.time()
    text = item.get("tts_text") or item["text"]
    out_file = os.path.join(OUT_DIR, item["filename"])

    ref_key = item.get("voice_ref") or item.get("ref_audio") or "ref_expressive_1"
    ref_info = refs.get(ref_key, refs["ref_expressive_1"])
    cfg = float(item.get("cfg", 1.8))

    wav = np.asarray(
        model.generate(
            text=text,
            prompt_wav_path=ref_info["wav"],
            prompt_text=ref_info["txt"],
            cfg_value=cfg,
            inference_timesteps=20
        ),
        dtype=np.float32
    )

    # Gentle 15ms anti-click cosine fade in & out
    fade_len = int(sr * 0.015)
    if len(wav) > 2 * fade_len:
        fade_in = np.sin(np.linspace(0, np.pi / 2, fade_len)) ** 2
        fade_out = np.sin(np.linspace(np.pi / 2, 0, fade_len)) ** 2
        wav[:fade_len] *= fade_in
        wav[-fade_len:] *= fade_out

    sf.write(out_file, wav, sr, format="WAV", subtype="PCM_16")
    dur = len(wav) / sr
    elapsed = time.time() - t_start
    print(f"[{i+1}/{len(manifest)}] {item['filename']} ({dur:.2f}s audio in {elapsed:.2f}s, {ref_key} @ CFG {cfg}) -> {text[:40]}...")

total_dur = time.time() - start_all
print(f"All {len(manifest)} files generated in {total_dur:.1f}s ({total_dur/60:.2f} min)")

ZIP_OUT = "anurag_pg_audio.zip"
print(f"Zipping outputs to {ZIP_OUT}...")
with zipfile.ZipFile(ZIP_OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(os.listdir(OUT_DIR)):
        if f.endswith(".wav"):
            z.write(os.path.join(OUT_DIR, f), f)

print(f"Done! {ZIP_OUT} created with {len(os.listdir(OUT_DIR))} files.")
`;

writeFileSync(path.join(BUNDLE_DIR, "render_pg_colab.py"), renderPy);

// 4. Create zip archive
console.log(`Creating ${ZIP_PATH}...`);
if (existsSync(ZIP_PATH)) rmSync(ZIP_PATH);
execSync(`cd "${path.dirname(BUNDLE_DIR)}" && zip -q -r "${ZIP_PATH}" "${path.basename(BUNDLE_DIR)}"`);
const zipSizeMb = (readFileSync(ZIP_PATH).length / (1024 * 1024)).toFixed(1);
console.log(`Zip created: ${zipSizeMb} MB`);

// 5. Upload to Vercel Blob
console.log("Uploading to Vercel Blob...");
const envBlob = readFileSync(path.join(ROOT, ".env.blob"), "utf8");
const tokenMatch = envBlob.match(/BLOB_READ_WRITE_TOKEN="?([^"\n\r]+)"?/);
if (!tokenMatch) {
  throw new Error("BLOB_READ_WRITE_TOKEN not found in .env.blob");
}
const token = tokenMatch[1];

const uploadCmd = `curl -s -X PUT "https://blob.vercel-storage.com/anurag-pg/bundle-v2.zip" \\
  -H "authorization: Bearer ${token}" \\
  -H "x-api-version: 7" \\
  -H "x-content-type: application/zip" \\
  -H "x-add-random-suffix: 1" \\
  --data-binary @"${ZIP_PATH}"`;

const res = execSync(uploadCmd).toString();
const blobData = JSON.parse(res);
const blobUrl = blobData.url;
console.log(`Uploaded bundle to Vercel Blob: ${blobUrl}`);

// 6. Generate turnkey Colab Notebook
const notebook = {
  nbformat: 4,
  nbformat_minor: 0,
  metadata: {
    accelerator: "GPU",
    colab: {
      gpuType: "T4",
      provenance: []
    },
    kernelspec: {
      display_name: "Python 3",
      name: "python3"
    },
    language_info: {
      name: "python"
    }
  },
  cells: [
    {
      cell_type: "markdown",
      metadata: {},
      source: [
        "# Anurag VoxCPM2 LoRA PG Hostels Voice Synthesis (Episode 02)\n",
        "\n",
        "Generates all 24 sentence WAVs for **Episode 02: The Economics of Bangalore PG Hostels** (4.8 min episode).\n",
        "- **Narrative Hooks, Street Drama & Midnight Skips:** `ref_expressive_1` @ CFG 1.8\n",
        "- **Master Leases, Capex & ₹11,000 Bed Breakdown:** `ref4` @ CFG 1.7\n",
        "\n",
        "### Instructions:\n",
        "1. Ensure Runtime is set to **GPU (T4)**: `Runtime` → `Change runtime type` → `T4 GPU`.\n",
        "2. Click `Runtime` → **Run all** (takes ~2 minutes total for 24 sentences).\n",
        "3. At the end, `anurag_pg_audio.zip` will download automatically.\n",
        "4. Move `anurag_pg_audio.zip` to `~/Downloads/` on your Mac."
      ]
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        "# Step 1: Install VoxCPM2 and dependencies\n",
        "!pip -q install 'voxcpm>=2.0.3' soundfile\n",
        "import torch\n",
        "print('CUDA Device:', torch.cuda.get_device_name(0))\n"
      ]
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        "# Step 2: Download and unpack the render bundle\n",
        `!wget -q -O bundle.zip '${blobUrl}'\n`,
        "!unzip -q -o bundle.zip\n",
        "!ls -lh anurag-pg-bundle\n"
      ]
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        "# Step 3: Run batch synthesis (all 24 sentences)\n",
        "!python anurag-pg-bundle/render_pg_colab.py\n"
      ]
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        "# Step 4: Download the resulting audio zip\n",
        "from google.colab import files\n",
        "files.download('anurag_pg_audio.zip')\n",
        "print('Download initiated! Move anurag_pg_audio.zip into ~/Downloads/ on your Mac.')\n"
      ]
    }
  ]
};

const NOTEBOOK_PATH = path.join(COLAB_DIR, "anurag_pg_voice_render.ipynb");
writeFileSync(NOTEBOOK_PATH, JSON.stringify(notebook, null, 2));
console.log(`Wrote turnkey Colab notebook: ${NOTEBOOK_PATH}`);
