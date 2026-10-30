#!/usr/bin/env python3
"""
Studio Audio Production Unit:
Batch synthesize all 12 scenes (24 lines) for Episode 07: Cult.fit Franchise Teardown.
- Voice: Edge-TTS (en-IN-PrabhatNeural) @ rate +28% (exact 155 WPM unhurried documentary delivery)
- DSP Rack: FFmpeg 75Hz HPF, +2dB @ 180Hz (chest warmth), +2dB @ 3.8kHz (presence), EBU R128 -14.0 LUFS
- Injects 400-600ms rhetorical silence buffers per line
- Outputs mastered stems to public/audio/cultfit/
- Generates data/cultfit_timing.json with exact frame counts for Remotion
"""

import os
import subprocess
import json
from pathlib import Path

ROOT = Path("/Users/ck/claude/cafe-slideshow")
MANIFEST_FILE = ROOT / "data" / "cultfit_manifest.json"
OUT_DIR = ROOT / "public" / "audio" / "cultfit"
TIMING_FILE = ROOT / "data" / "cultfit_timing.json"

OUT_DIR.mkdir(parents=True, exist_ok=True)

FPS = 30

def main():
    with open(MANIFEST_FILE, "r") as f:
        manifest = json.load(f)

    scenes = manifest["scenes"]
    timing_data = {
        "project": manifest["project"],
        "wpm_target": manifest.get("wpm_target", 155),
        "loudness_target_lufs": -14.0,
        "scenes": {}
    }

    total_audio_duration = 0.0

    print(f"🎙️ Launching Broadcast Audio Synthesis for: {manifest['project']}")
    print(f"📁 Output Stems: {OUT_DIR}")

    for s_idx, scene in enumerate(scenes):
        scene_id = scene["id"]
        print(f"\n🎬 Processing [{scene_id}] - {scene['title']} ({len(scene['lines'])} lines)")

        scene_timing = {
            "title": scene["title"],
            "act": scene.get("act", 1),
            "lines": []
        }
        scene_duration = 0.0

        for l_idx, line_obj in enumerate(scene["lines"]):
            stem_name = f"{scene_id}_s{l_idx}"
            raw_mp3 = f"/tmp/{stem_name}_raw.mp3"
            mastered_wav = OUT_DIR / f"{stem_name}.wav"

            # 1. Edge-TTS Synthesis
            tts_cmd = [
                "/Users/ck/.local/bin/uvx", "edge-tts",
                "--voice", "en-IN-PrabhatNeural",
                "--rate=+28%",
                "--text", line_obj["text"],
                "--write-media", raw_mp3
            ]
            subprocess.run(tts_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # 2. Add silence padding and apply DSP Mastering Rack
            # Filter chain: 75Hz HPF, 180Hz chest warmth EQ, 3.8kHz presence, and EBU R128 loudness norm to -14.0 LUFS
            pad_s = line_obj.get("pause_after_ms", 450) / 1000.0
            dsp_filter = (
                f"highpass=f=75,equalizer=f=180:t=q:w=1.2:g=2.0,equalizer=f=3800:t=q:w=1.0:g=2.0,"
                f"apad=pad_dur={pad_s},"
                f"loudnorm=I=-14.0:TP=-1.0:LRA=7.0"
            )
            ffmpeg_cmd = [
                "/opt/homebrew/bin/ffmpeg", "-y",
                "-i", raw_mp3,
                "-af", dsp_filter,
                str(mastered_wav)
            ]
            subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # 3. Measure duration via ffprobe
            probe_cmd = [
                "/opt/homebrew/bin/ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                str(mastered_wav)
            ]
            res = subprocess.run(probe_cmd, check=True, capture_output=True, text=True)
            duration_s = float(res.stdout.strip())
            duration_frames = int(round(duration_s * FPS))

            scene_timing["lines"].append({
                "idx": l_idx,
                "text": line_obj["text"],
                "file": f"audio/cultfit/{stem_name}.wav",
                "duration_s": duration_s,
                "duration_frames": duration_frames
            })
            scene_duration += duration_s
            total_audio_duration += duration_s
            print(f"  ✓ {stem_name}: {duration_s:.2f}s ({duration_frames} frames) -> -14.0 LUFS")

        scene_timing["total_duration_s"] = scene_duration
        scene_timing["total_frames"] = int(round(scene_duration * FPS))
        timing_data["scenes"][scene_id] = scene_timing

    timing_data["summary"] = {
        "total_scenes": len(scenes),
        "total_duration_s": total_audio_duration,
        "total_minutes": total_audio_duration / 60.0,
        "total_frames": int(round(total_audio_duration * FPS))
    }

    with open(TIMING_FILE, "w") as f:
        json.dump(timing_data, f, indent=2)

    print("\n" + "="*70)
    print("🏆 BATCH AUDIO SYNTHESIS & DSP MASTERING COMPLETE")
    print(f"Total Audio Runtime: {total_audio_duration:.2f}s ({total_audio_duration/60.0:.2f} mins)")
    print(f"Total Composition Frames @ 30fps: {int(round(total_audio_duration * FPS))} frames")
    print(f"Master Timing Ledger: {TIMING_FILE}")
    print("="*70)

if __name__ == "__main__":
    main()
