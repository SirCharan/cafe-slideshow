#!/usr/bin/env python3
"""
Generate voice audio for Episode 06: The Bangalore Real Estate Mirage.
Synthesizes all 24 lines, applies 15ms cosine anti-click fades, measures exact durations,
and enriches data/real_estate_scenes.json.
"""

import json
import os
import subprocess
from scipy.io import wavfile

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO_DIR = os.path.join(ROOT_DIR, "public", "audio", "real_estate")
DATA_DIR = os.path.join(ROOT_DIR, "data")
SCENES_PATH = os.path.join(DATA_DIR, "real_estate_scenes.json")

os.makedirs(AUDIO_DIR, exist_ok=True)

def synthesize_line(text, out_wav):
    tmp_aiff = out_wav.replace(".wav", ".aiff")
    cmd = ["say", "-v", "Rishi", "-r", "175", "-o", tmp_aiff, text]
    subprocess.run(cmd, check=True)
    cmd_ffmpeg = [
        "ffmpeg", "-y", "-i", tmp_aiff,
        "-af", "afade=t=in:ss=0:d=0.015,afade=t=out:st=0:d=0.015,aresample=48000",
        "-c:a", "pcm_s16le", out_wav
    ]
    subprocess.run(cmd_ffmpeg, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(tmp_aiff):
        os.remove(tmp_aiff)

def get_wav_duration(wav_path):
    sr, data = wavfile.read(wav_path)
    return len(data) / float(sr)

def main():
    print(f"Loading {SCENES_PATH}...")
    with open(SCENES_PATH, "r") as f:
        scenes = json.load(f)

    total_voice_duration = 0.0

    print(f"Generating audio in {AUDIO_DIR}...")
    for s in scenes:
        sid = s["id"]
        line_durs = []

        for line in s["lines"]:
            l_idx = line["idx"]
            wav_name = f"{sid}_s{l_idx}.wav"
            out_wav = os.path.join(AUDIO_DIR, wav_name)

            text_to_speak = line.get("tts_text") or line["text"]
            synthesize_line(text_to_speak, out_wav)
            dur = get_wav_duration(out_wav)
            line["durationSec"] = round(dur, 2)
            line_durs.append(round(dur, 2))
            total_voice_duration += dur
            print(f"  [{sid}_s{l_idx}] {dur:.2f}s | {text_to_speak[:50]}...")

        s["line0Dur"] = line_durs[0]
        s["line1Dur"] = line_durs[1] if len(line_durs) > 1 else 0
        pause = s["lines"][0].get("pause_s", 0.5) + (s["lines"][1].get("pause_s", 0.5) if len(s["lines"]) > 1 else 0)
        s["pause"] = pause
        s["durationSec"] = round(sum(line_durs) + pause + 0.4, 2)

    with open(SCENES_PATH, "w") as f:
        json.dump(scenes, f, indent=2)

    total_scenes_dur = sum(s["durationSec"] for s in scenes)
    print(f"\n✓ Generated all {len(scenes) * 2} audio lines in {AUDIO_DIR}")
    print(f"✓ Updated {SCENES_PATH}")
    print(f"✓ Total voice runtime: {total_voice_duration:.1f}s ({total_voice_duration / 60:.2f} mins)")
    print(f"✓ Total scene sequence runtime: {total_scenes_dur:.1f}s ({total_scenes_dur / 60:.2f} mins)")

if __name__ == "__main__":
    main()
