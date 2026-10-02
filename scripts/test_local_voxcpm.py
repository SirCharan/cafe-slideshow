#!/usr/bin/env python3
"""
Test local Anurag VoxCPM2 voice synthesis on Apple Silicon (M5).
"""

import os
import sys
import time
import json
import numpy as np
import soundfile as sf
import torch

LORA_DIR = "/Users/ck/claude/misterfinance-research/factory/voice-studio/data/lora/anurag_voxcpm2_r32"
OUT_FILE = "/tmp/test_anurag_local.wav"

def test_local():
    print(f"Device: Apple Silicon (MPS: {torch.backends.mps.is_available()})")
    print("Importing voxcpm...")
    from voxcpm import VoxCPM
    from voxcpm.model.voxcpm import LoRAConfig

    t0 = time.time()
    lora_weights = os.path.join(LORA_DIR, "step_0000326.safetensors")
    lora_cfg = json.load(open(os.path.join(LORA_DIR, "lora_config.json")))
    if "lora_config" in lora_cfg:
        lora_cfg = lora_cfg["lora_config"]

    print("Loading VoxCPM2 model with Anurag LoRA weights...")
    model = VoxCPM.from_pretrained(
        hf_model_id="openbmb/VoxCPM2",
        load_denoiser=False,
        lora_weights_path=lora_weights,
        lora_config=LoRAConfig(**lora_cfg),
    )
    print(f"Model loaded in {time.time() - t0:.1f}s")

    ref_wav = os.path.join(LORA_DIR, "ref_expressive_1.wav")
    ref_txt = open(os.path.join(LORA_DIR, "ref_expressive_1.txt")).read().strip()

    test_text = "The napkin math is embarrassingly seductive."
    print(f"Synthesizing: '{test_text}'...")
    t_gen = time.time()
    wav = np.asarray(
        model.generate(
            text=test_text,
            prompt_wav_path=ref_wav,
            prompt_text=ref_txt,
            cfg_value=1.8,
            inference_timesteps=20,
        ),
        dtype=np.float32,
    )
    sr = model.tts_model.sample_rate

    # 15ms anti-click cosine fade
    fade_len = int(sr * 0.015)
    if len(wav) > 2 * fade_len:
        fade_in = np.sin(np.linspace(0, np.pi / 2, fade_len)) ** 2
        fade_out = np.sin(np.linspace(np.pi / 2, 0, fade_len)) ** 2
        wav[:fade_len] *= fade_in
        wav[-fade_len:] *= fade_out

    sf.write(OUT_FILE, wav, sr, format="WAV", subtype="PCM_16")
    dur = len(wav) / sr
    elapsed = time.time() - t_gen
    print(f"✓ Generated {dur:.2f}s audio in {elapsed:.2f}s! Saved to {OUT_FILE}")

if __name__ == "__main__":
    test_local()
