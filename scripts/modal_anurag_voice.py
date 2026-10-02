#!/usr/bin/env python3
"""
Modal Autonomous Voice Generator for Not a Startup (Anurag VoxCPM2 LoRA).
Replaces manual Google Colab sessions with a 1-command cloud GPU job.

Usage:
  modal run scripts/modal_anurag_voice.py --manifest data/pg_manifest.json --out-dir public/audio/pg
"""

import os
import sys

# Define Modal App and Container Image
try:
    import modal

    app = modal.App("anurag-voice-pipeline")

    image = (
        modal.Image.debian_slim(python_version="3.11")
        .pip_install("torch", "soundfile", "numpy", "voxcpm>=2.0.3", "safetensors")
        .apt_install("ffmpeg")
    )

    LORA_LOCAL_DIR = "/Users/ck/claude/misterfinance-research/factory/voice-studio/data/lora/anurag_voxcpm2_r32"

    @app.function(
        image=image,
        gpu="T4", # or "A10G" for 2x faster generation
        timeout=600,
        scaledown_window=60,
    )
    def synthesize_sentences(manifest: list, lora_weights_bytes: bytes, lora_config_dict: dict, ref_audio_map: dict):
        import time
        import numpy as np
        import soundfile as sf
        import torch
        from voxcpm import VoxCPM
        from voxcpm.model.voxcpm import LoRAConfig

        print("GPU:", torch.cuda.get_device_name(0))
        t0 = time.time()

        # Save weights and config to container
        with open("/tmp/lora_weights.safetensors", "wb") as f:
            f.write(lora_weights_bytes)

        # Save reference audios
        refs_container = {}
        for ref_name, (wav_b, txt_s) in ref_audio_map.items():
            wav_path = f"/tmp/{ref_name}.wav"
            with open(wav_path, "wb") as f:
                f.write(wav_b)
            refs_container[ref_name] = {"wav": wav_path, "txt": txt_s}

        # Initialize VoxCPM2 with LoRA
        lc = lora_config_dict.get("lora_config", lora_config_dict)
        model = VoxCPM.from_pretrained(
            hf_model_id="openbmb/VoxCPM2",
            load_denoiser=False,
            lora_weights_path="/tmp/lora_weights.safetensors",
            lora_config=LoRAConfig(**lc),
        )
        print(f"Loaded VoxCPM2 in {time.time() - t0:.1f}s")

        sr = model.tts_model.sample_rate
        results = {}

        for i, item in enumerate(manifest, 1):
            text = item.get("tts_text") or item["text"]
            ref_key = item.get("voice_ref") or item.get("ref_audio") or "ref_expressive_1"
            ref_info = refs_container.get(ref_key, refs_container["ref_expressive_1"])
            cfg = float(item.get("cfg", 1.8))

            t_start = time.time()
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

            # Apply smooth 15ms cosine anti-click fade in/out
            fade_len = int(sr * 0.015)
            if len(wav) > 2 * fade_len:
                fade_in = np.sin(np.linspace(0, np.pi / 2, fade_len)) ** 2
                fade_out = np.sin(np.linspace(np.pi / 2, 0, fade_len)) ** 2
                wav[:fade_len] *= fade_in
                wav[-fade_len:] *= fade_out

            out_path = f"/tmp/{item['filename']}"
            sf.write(out_path, wav, sr, format="WAV", subtype="PCM_16")

            with open(out_path, "rb") as f:
                results[item["filename"]] = f.read()

            dur = len(wav) / sr
            print(f"[{i}/{len(manifest)}] {item['filename']} ({dur:.2f}s audio in {time.time() - t_start:.2f}s)")

        return results

    @app.local_entrypoint()
    def main(manifest_path: str = "data/pg_manifest.json", out_dir: str = "public/audio/pg"):
        import json
        import path

        print(f"Reading manifest from {manifest_path}...")
        with open(manifest_path, "r") as f:
            manifest = json.load(f)

        print(f"Packaging local LoRA weights from {LORA_LOCAL_DIR}...")
        lora_weights_bytes = open(os.path.join(LORA_LOCAL_DIR, "step_0000326.safetensors"), "rb").read()
        lora_config_dict = json.load(open(os.path.join(LORA_LOCAL_DIR, "lora_config.json")))

        ref_audio_map = {
            "ref_expressive_1": (
                open(os.path.join(LORA_LOCAL_DIR, "ref_expressive_1.wav"), "rb").read(),
                open(os.path.join(LORA_LOCAL_DIR, "ref_expressive_1.txt"), "r").read().strip(),
            ),
            "ref4": (
                open(os.path.join(LORA_LOCAL_DIR, "ref4.wav"), "rb").read(),
                open(os.path.join(LORA_LOCAL_DIR, "ref4.txt"), "r").read().strip(),
            ),
        }

        print("Dispatching synthesis job to Modal GPU cloud...")
        audio_outputs = synthesize_sentences.remote(manifest, lora_weights_bytes, lora_config_dict, ref_audio_map)

        os.makedirs(out_dir, exist_ok=True)
        for filename, data in audio_outputs.items():
            dest = os.path.join(out_dir, filename)
            with open(dest, "wb") as f:
                f.write(data)
            print(f"Saved: {dest}")

        print(f"\nAll {len(audio_outputs)} voice lines downloaded directly into {out_dir}!")

except ImportError:
    pass
