#!/usr/bin/env python3
"""
Batch synthesize Anurag VoxCPM2 LoRA voice lines for Episode 03: Bangalore Cloud Kitchens.
Runs locally on Apple Silicon (M5 Metal MPS).
"""

import os
import sys
import time
import json
import numpy as np
import soundfile as sf
import torch

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LORA_DIR = "/Users/ck/claude/misterfinance-research/factory/voice-studio/data/lora/anurag_voxcpm2_r32"
MANIFEST_PATH = os.path.join(ROOT_DIR, "data", "cloud_kitchen_manifest.json")
SCENES_PATH = os.path.join(ROOT_DIR, "data", "cloud_kitchen_scenes.json")
OUT_DIR = os.path.join(ROOT_DIR, "public", "audio", "cloud_kitchen")

os.makedirs(OUT_DIR, exist_ok=True)

def main():
    print(f"Device: Apple Silicon (MPS: {torch.backends.mps.is_available()})")
    print(f"Loading manifest from {MANIFEST_PATH}...")
    with open(MANIFEST_PATH, "r") as f:
        manifest = json.load(f)

    print("Importing VoxCPM...")
    from voxcpm import VoxCPM
    from voxcpm.model.voxcpm import LoRAConfig

    t0 = time.time()
    lora_weights = os.path.join(LORA_DIR, "step_0000326.safetensors")
    lora_cfg = json.load(open(os.path.join(LORA_DIR, "lora_config.json")))
    if "lora_config" in lora_cfg:
        lora_cfg = lora_cfg["lora_config"]

    print("Initializing VoxCPM2 with Anurag LoRA weights...")
    model = VoxCPM.from_pretrained(
        hf_model_id="openbmb/VoxCPM2",
        load_denoiser=False,
        lora_weights_path=lora_weights,
        lora_config=LoRAConfig(**lora_cfg),
    )
    print(f"Model initialized in {time.time() - t0:.1f}s")

    refs = {
        "ref_expressive_1": {
            "wav": os.path.join(LORA_DIR, "ref_expressive_1.wav"),
            "txt": open(os.path.join(LORA_DIR, "ref_expressive_1.txt")).read().strip(),
        },
        "ref4": {
            "wav": os.path.join(LORA_DIR, "ref4.wav"),
            "txt": open(os.path.join(LORA_DIR, "ref4.txt")).read().strip(),
        },
    }

    sr = model.tts_model.sample_rate
    print(f"\nBeginning batch synthesis of {len(manifest)} voice lines...\n")
    durations_map = {}

    start_all = time.time()
    for idx, item in enumerate(manifest, 1):
        filename = item["filename"]
        text = item.get("tts_text") or item["text"]
        ref_key = item.get("ref_audio", "ref_expressive_1")
        ref_info = refs.get(ref_key, refs["ref_expressive_1"])
        cfg = float(item.get("cfg", 1.8))

        out_path = os.path.join(OUT_DIR, filename)

        # Force synthesis with Anurag VoxCPM2 LoRA weights

        t_line = time.time()
        wav = np.asarray(
            model.generate(
                text=text,
                prompt_wav_path=ref_info["wav"],
                prompt_text=ref_info["txt"],
                cfg_value=cfg,
                inference_timesteps=20,
            ),
            dtype=np.float32,
        )

        # 15ms anti-click cosine fade
        fade_len = int(sr * 0.015)
        if len(wav) > 2 * fade_len:
            fade_in = np.sin(np.linspace(0, np.pi / 2, fade_len)) ** 2
            fade_out = np.sin(np.linspace(np.pi / 2, 0, fade_len)) ** 2
            wav[:fade_len] *= fade_in
            wav[-fade_len:] *= fade_out

        sf.write(out_path, wav, sr, format="WAV", subtype="PCM_16")
        dur = len(wav) / sr
        durations_map[filename] = round(dur, 2)
        elapsed = time.time() - t_line
        print(f"[{idx}/{len(manifest)}] {filename} ({dur:.2f}s audio in {elapsed:.2f}s) -> {text[:45]}...")

    total_time = time.time() - start_all
    print(f"\n✓ All {len(manifest)} lines synthesized in {total_time:.1f}s ({total_time / 60:.2f} min)")

    # Update data/cloud_kitchen_scenes.json with exact measured durations
    if os.path.exists(SCENES_PATH):
        print(f"Updating scene timing in {SCENES_PATH}...")
        with open(SCENES_PATH, "r") as f:
            scenes = json.load(f)

        for s in scenes:
            sid = s["id"]
            d0 = durations_map.get(f"{sid}_s0.wav", 10.0)
            d1 = durations_map.get(f"{sid}_s1.wav", 10.0) if len(s["lines"]) > 1 else 0
            s["line0Dur"] = d0
            s["line1Dur"] = d1
            if len(s["lines"]) > 0:
                s["lines"][0]["durationSec"] = d0
            if len(s["lines"]) > 1:
                s["lines"][1]["durationSec"] = d1
            pause = s["lines"][0].get("pause_s", 0.5) + (s["lines"][1].get("pause_s", 0.5) if len(s["lines"]) > 1 else 0)
            s["pause"] = pause
            s["durationSec"] = round(d0 + d1 + pause + 0.4, 2)

        with open(SCENES_PATH, "w") as f:
            json.dump(scenes, f, indent=2)
        print("✓ Updated cloud_kitchen_scenes.json with exact Anurag voice timings!")

if __name__ == "__main__":
    main()
