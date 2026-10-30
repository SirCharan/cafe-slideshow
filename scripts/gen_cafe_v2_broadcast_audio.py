#!/usr/bin/env python3
"""
Studio Audio Production Unit:
Batch synthesize all 12 scenes (24 lines) for Episode 01/05 Bangalore Cafe Flagship (V2).
- Engine: Edge-TTS (en-IN-PrabhatNeural) @ rate +28% (exact 155 WPM target)
- DSP Rack: FFmpeg 75Hz HPF, +2dB @ 180Hz, +2dB @ 3.8kHz, EBU R128 -14.0 LUFS
- 450ms rhetorical silence buffers injected
- Outputs mastered stems to public/audio/cafe_v2/
- Generates data/cafe_v2_timing.json with exact frame counts for Remotion
"""

import os
import subprocess
import json

OUT_DIR = "/Users/ck/claude/cafe-slideshow/public/audio/cafe_v2"
TIMING_FILE = "/Users/ck/claude/cafe-slideshow/data/cafe_v2_timing.json"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(TIMING_FILE), exist_ok=True)

FPS = 30

SCENES = [
    {
        "id": "scene_01",
        "title": "The Indie Coffee Illusion",
        "lines": [
            {"idx": 0, "text": "Every weekend in Indiranagar, thousands of young techies walk past glass storefronts filled with warm sunlight, smooth jazz, and the intoxicating aroma of freshly roasted Ethiopian beans.", "pause_ms": 450},
            {"idx": 1, "text": "It feels peaceful, romantic, and effortlessly profitable. My name is Anurag Bansal, and welcome to Not a Startup.", "pause_ms": 500}
        ]
    },
    {
        "id": "scene_02",
        "title": "The Pitch Deck Fantasy",
        "lines": [
            {"idx": 0, "text": "On paper, specialty coffee is an arithmetic dream. Roasted green beans cost sixty rupees. Oat milk costs thirty. You sell a cup for two hundred and forty.", "pause_ms": 500},
            {"idx": 1, "text": "That is an unbelievable seventy-five percent gross margin. If you sell just one hundred and fifty cups a day, you should be pocketing three lakh rupees in monthly profit.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_03",
        "title": "The ₹1.5 Crore Vanity Fitout",
        "lines": [
            {"idx": 0, "text": "Before you pour a single espresso, your bank account enters the ICU.", "pause_ms": 500},
            {"idx": 1, "text": "Specialty coffee in Bangalore is a design arms race. You need a twelve-lakh La Marzocco machine, custom terrazzo counters, and curated Scandinavian chairs. That is one point two crores of sunk capital before opening day.", "pause_ms": 500}
        ]
    },
    {
        "id": "scene_04",
        "title": "The 100-Foot Road Master Lease",
        "lines": [
            {"idx": 0, "text": "Next comes your new best friend: the commercial landlord on 100-foot Road.", "pause_ms": 400},
            {"idx": 1, "text": "He demands four lakh fifty thousand rupees a month, ten months of security deposit upfront in cash, and an automatic eight percent escalation every single year.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_05",
        "title": "The Laptop Squatter Paradox",
        "lines": [
            {"idx": 0, "text": "In a regular restaurant, a table turns four times an afternoon. In a Bangalore specialty café, it turns zero point eight times.", "pause_ms": 500},
            {"idx": 1, "text": "Because two senior engineers will buy one two-hundred-rupee cold brew, plug in two MacBooks, use your gigabit Wi-Fi, and conduct five Zoom sprints over six hours.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_06",
        "title": "The Physical Conveyor Belt of Spoilage",
        "lines": [
            {"idx": 0, "text": "Coffee beans last months. But artisan pastries and fresh milk do not.", "pause_ms": 450},
            {"idx": 1, "text": "If you bake thirty sourdough sandwiches and sell twelve, the remaining eighteen go straight into the dumpster at 10:00 PM. That is an invisible thirty-thousand-rupee bleed every single month.", "pause_ms": 500}
        ]
    },
    {
        "id": "scene_07",
        "title": "The BESCOM & Genset Burn",
        "lines": [
            {"idx": 0, "text": "Cooling a fifty-seater glass greenhouse under the April Bangalore sun requires eight split air conditioners running continuously.", "pause_ms": 400},
            {"idx": 1, "text": "Between Karnataka's commercial electricity tariff and sixty liters of diesel for your backup generator, power alone eats one lakh eighty thousand rupees a month.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_08",
        "title": "The Barista Talent War",
        "lines": [
            {"idx": 0, "text": "A great café lives and dies by its head barista. But in Bangalore, specialty baristas are scouted like IPL cricketers.", "pause_ms": 450},
            {"idx": 1, "text": "The moment your barista masters swan latte art, the venture-funded chain across the street offers him a thirty percent raise, leaving you with burnt beans and untrained apprentices.", "pause_ms": 500}
        ]
    },
    {
        "id": "scene_09",
        "title": "The Whiteboard Cash-Flow Grinder",
        "lines": [
            {"idx": 0, "text": "When you feed your daily customer revenue through the actual operational machine, the math completely collapses.", "pause_ms": 500},
            {"idx": 1, "text": "Your four lakh fifty thousand rent, power, payroll, and spoilage chew up ninety percent of your incoming cash before you ever touch a single rupee.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_10",
        "title": "The True Monthly P&L",
        "lines": [
            {"idx": 0, "text": "At four hundred cups a day with food, an Indiranagar café generates ten lakh rupees in gross sales.", "pause_ms": 400},
            {"idx": 1, "text": "After deducting fixed rent, utilities, raw materials, GST, and payroll, the operator walks away with forty thousand rupees. In a bad monsoon month, they lose eighty-five thousand.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_11",
        "title": "The Secret Real Winners",
        "lines": [
            {"idx": 0, "text": "So who is actually making money in India's coffee boom?", "pause_ms": 600},
            {"idx": 1, "text": "Not the café owner. The real winners are the commercial property owners, and the B2B specialty roasters who sell thirty-ton pallets of beans to hundreds of hopeful entrepreneurs.", "pause_ms": 550}
        ]
    },
    {
        "id": "scene_12",
        "title": "The Final Executive Verdict",
        "lines": [
            {"idx": 0, "text": "If your dream is to sit in a beautiful sunlit room, drink specialty pour-overs, and curate indie playlists, do not open a café.", "pause_ms": 500},
            {"idx": 1, "text": "Just buy a six-hundred-rupee bag of beans, brew it at home, and keep your one point five crores in a simple index fund. Because opening a café in Bangalore does not make you a founder. It makes you an unpaid manager for your landlord's commercial property.", "pause_ms": 700}
        ]
    }
]

def synthesize_and_master():
    timing_data = {}
    total_audio_duration = 0.0

    print("🎙️ Starting Batch Voice Synthesis & DSP Mastering Rack...")
    for s_idx, scene in enumerate(SCENES):
        scene_id = scene["id"]
        scene_timing = {"title": scene["title"], "lines": []}
        scene_duration = 0.0

        for l_idx, line in enumerate(scene["lines"]):
            stem_name = f"{scene_id}_s{l_idx}"
            raw_mp3 = f"/tmp/{stem_name}_raw.mp3"
            mastered_wav = f"{OUT_DIR}/{stem_name}.wav"

            # 1. Edge-TTS Synthesis
            tts_cmd = [
                "/Users/ck/.local/bin/uvx", "edge-tts",
                "--voice", "en-IN-PrabhatNeural",
                "--rate=+28%",
                "--text", line["text"],
                "--write-media", raw_mp3
            ]
            subprocess.run(tts_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # 2. Add silence padding and apply DSP Mastering Rack
            # Filter chain: 75Hz HPF, 180Hz chest warmth EQ, 3.8kHz presence, and EBU R128 loudness norm to -14.0 LUFS
            pad_s = line["pause_ms"] / 1000.0
            dsp_filter = (
                f"highpass=f=75,equalizer=f=180:t=q:w=1.2:g=2.0,equalizer=f=3800:t=q:w=1.0:g=2.0,"
                f"apad=pad_dur={pad_s},"
                f"loudnorm=I=-14.0:TP=-1.0:LRA=7.0"
            )
            ffmpeg_cmd = [
                "/opt/homebrew/bin/ffmpeg", "-y",
                "-i", raw_mp3,
                "-af", dsp_filter,
                mastered_wav
            ]
            subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            # 3. Measure duration via ffprobe
            probe_cmd = [
                "/opt/homebrew/bin/ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                mastered_wav
            ]
            res = subprocess.run(probe_cmd, check=True, capture_output=True, text=True)
            duration_s = float(res.stdout.strip())
            duration_frames = int(round(duration_s * FPS))

            scene_timing["lines"].append({
                "idx": l_idx,
                "text": line["text"],
                "file": f"audio/cafe_v2/{stem_name}.wav",
                "duration_s": duration_s,
                "duration_frames": duration_frames
            })
            scene_duration += duration_s
            total_audio_duration += duration_s
            print(f"  ✓ {stem_name}: {duration_s:.2f}s ({duration_frames} frames) -> -14.0 LUFS")

        scene_timing["total_duration_s"] = scene_duration
        scene_timing["total_frames"] = int(round(scene_duration * FPS))
        timing_data[scene_id] = scene_timing

    timing_data["summary"] = {
        "total_scenes": len(SCENES),
        "total_duration_s": total_audio_duration,
        "total_minutes": total_audio_duration / 60.0,
        "total_frames": int(round(total_audio_duration * FPS))
    }

    with open(TIMING_FILE, "w") as f:
        json.dump(timing_data, f, indent=2)

    print(f"\n🎉 Voice Synthesis & Mastering Complete!")
    print(f"  Total Duration: {total_audio_duration:.2f}s ({total_audio_duration/60.0:.2f} minutes)")
    print(f"  Total Master Frames: {int(round(total_audio_duration * FPS))} @ 30fps")
    print(f"  Timing Manifest: {TIMING_FILE}")

if __name__ == "__main__":
    synthesize_and_master()
