#!/usr/bin/env node
// Packages the VoxCPM2 LoRA weights, reference audio, and all 117 slide sentences
// into a zip bundle, uploads it to Vercel Blob, and creates colab/anurag_voxcpm2_render.ipynb.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(".");
const SLIDES_PATH = path.join(ROOT, "data/slides.json");
const LORA_DIR = "/Users/ck/claude/misterfinance-research/factory/voice-studio/data/lora/anurag_voxcpm2_r32";
const BUNDLE_DIR = path.join(ROOT, "out/anurag-bundle");
const ZIP_PATH = path.join(ROOT, "out/anurag-render-bundle.zip");
const COLAB_DIR = path.join(ROOT, "colab");

mkdirSync(BUNDLE_DIR, { recursive: true });
mkdirSync(COLAB_DIR, { recursive: true });

// 1. Read slides and build manifest
const slides = JSON.parse(readFileSync(SLIDES_PATH, "utf8"));
const manifest = [];

for (const slide of slides) {
  const sid = slide.id;
  const scriptLines = slide.video_script?.script_lines || [];
  scriptLines.forEach((line, idx) => {
    const filename = `${sid}_s${idx}.wav`;
    manifest.push({
      id: `${sid}_s${idx}`,
      slide_id: sid,
      sentence_idx: idx,
      filename,
      text: line.text,
      tts_text: line.tts_text || line.text,
      pause_s: line.pause_s || 0.25,
      expression: line.expression || "neutral"
    });
  });
}

writeFileSync(path.join(BUNDLE_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Created manifest with ${manifest.length} sentences.`);

// 2. Copy LoRA weights and reference audio
copyFileSync(path.join(LORA_DIR, "step_0000326.safetensors"), path.join(BUNDLE_DIR, "lora_weights.safetensors"));
copyFileSync(path.join(LORA_DIR, "lora_config.json"), path.join(BUNDLE_DIR, "lora_config.json"));
copyFileSync(path.join(LORA_DIR, "ref_expressive_1.wav"), path.join(BUNDLE_DIR, "ref_expressive_1.wav"));
copyFileSync(path.join(LORA_DIR, "ref_expressive_1.txt"), path.join(BUNDLE_DIR, "ref_expressive_1.txt"));
console.log("Copied LoRA weights and reference audio files.");

// 3. Write render_colab.py to run inside Colab
const renderPy = `import json, os, time, zipfile
import numpy as np
import soundfile as sf
import torch
from voxcpm import VoxCPM
from voxcpm.model.voxcpm import LoRAConfig

print("CUDA available:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))

BUNDLE = "anurag-bundle"
lc = json.load(open(f"{BUNDLE}/lora_config.json"))["lora_config"]
print("Loading VoxCPM2 model with LoRA weights...")
t0 = time.time()
model = VoxCPM.from_pretrained(
    hf_model_id="openbmb/VoxCPM2",
    load_denoiser=False,
    lora_weights_path=f"{BUNDLE}/lora_weights.safetensors",
    lora_config=LoRAConfig(**lc)
)
print(f"Model loaded in {time.time() - t0:.1f}s")

sr = model.tts_model.sample_rate
ref_wav = f"{BUNDLE}/ref_expressive_1.wav"
ref_prompt = open(f"{BUNDLE}/ref_expressive_1.txt").read().strip()
manifest = json.load(open(f"{BUNDLE}/manifest.json"))

OUT_DIR = "audio_out"
os.makedirs(OUT_DIR, exist_ok=True)

print(f"Starting batch synthesis for {len(manifest)} sentences...")
start_all = time.time()

for i, item in enumerate(manifest):
    t_start = time.time()
    text = item.get("tts_text") or item["text"]
    out_file = os.path.join(OUT_DIR, item["filename"])
    
    # 20 timesteps with cfg 2.0 gives sharp, expressive delivery
    wav = np.asarray(
        model.generate(
            text=text,
            prompt_wav_path=ref_wav,
            prompt_text=ref_prompt,
            cfg_value=2.0,
            inference_timesteps=20
        ),
        dtype=np.float32
    )
    
    sf.write(out_file, wav, sr, format="WAV", subtype="PCM_16")
    dur = len(wav) / sr
    elapsed = time.time() - t_start
    print(f"[{i+1}/{len(manifest)}] {item['filename']} ({dur:.2f}s audio in {elapsed:.2f}s) -> {text[:35]}...")

total_dur = time.time() - start_all
print(f"All {len(manifest)} files generated in {total_dur:.1f}s ({total_dur/60:.2f} min)")

ZIP_OUT = "anurag_cafe_audio.zip"
print(f"Zipping outputs to {ZIP_OUT}...")
with zipfile.ZipFile(ZIP_OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(os.listdir(OUT_DIR)):
        if f.endswith(".wav"):
            z.write(os.path.join(OUT_DIR, f), f)

print(f"Done! {ZIP_OUT} created with {len(os.listdir(OUT_DIR))} files.")
`;

writeFileSync(path.join(BUNDLE_DIR, "render_colab.py"), renderPy);

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

const uploadCmd = `curl -s -X PUT "https://blob.vercel-storage.com/anurag-cafe/bundle.zip" \\
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
        "# Anurag VoxCPM2 LoRA Café Episode Voice Synthesis (Voice 09)\n",
        "\n",
        "Generates all 117 sentence WAVs for **The Economics of Owning a Café in Bangalore** (5–6 min episode).\n",
        "\n",
        "### Instructions:\n",
        "1. Ensure Runtime is set to **GPU (T4)**: `Runtime` → `Change runtime type` → `T4 GPU`.\n",
        "2. Click `Runtime` → **Run all** (takes ~6–8 minutes total).\n",
        "3. At the end, `anurag_cafe_audio.zip` will download automatically.\n",
        "4. Move `anurag_cafe_audio.zip` to `~/Downloads/` and run `npm run vo:ingest` locally."
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
        "!ls -lh anurag-bundle\n"
      ]
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [
        "# Step 3: Run batch synthesis (all 117 sentences)\n",
        "!python anurag-bundle/render_colab.py\n"
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
        "files.download('anurag_cafe_audio.zip')\n",
        "print('Download initiated! Move anurag_cafe_audio.zip into ~/Downloads/ on your Mac.')\n"
      ]
    }
  ]
};

const NOTEBOOK_PATH = path.join(COLAB_DIR, "anurag_voxcpm2_render.ipynb");
writeFileSync(NOTEBOOK_PATH, JSON.stringify(notebook, null, 2));
console.log(`Wrote turnkey Colab notebook: ${NOTEBOOK_PATH}`);
