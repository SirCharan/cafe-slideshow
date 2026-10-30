# 🎙️ SOP 03: Anurag Voice Synthesis & Broadcast DSP Mastering
**Standard**: ITU-R BS.1770 / EBU R128 Broadcast Compliance  
**Cadence Target**: 155 Words Per Minute (Unhurried Documentary Cadence)  
**Integrated Loudness Target**: Exactly -14.0 LUFS (±0.5 LUFS)  
**True Peak Ceiling**: -1.0 dBFS  

---

## 1. Speech Synthesis Architecture

### Parameter Specs (ElevenLabs / VoxCPM2):
- **Voice Profile**: Anurag Bansal (Confident, fast-paced analytical cadence, sharp rhetorical pauses, natural conversational warmth).
- **Stability**: `0.48` (allows natural micro-pitch inflection without tone wobble).
- **Similarity Boost**: `0.88` (locks signature timbre).
- **Style**: `0.22` (light narrative expressiveness).
- **Speaker Boost**: `True`.
- **Rhetorical Pause Rule**: Every narrative shift, dramatic reveal, or rhetorical question must include an explicit **350ms to 600ms** silence buffer.

---

## 2. DSP Mastering Rack (FFmpeg / DAW Chain)

The raw generated audio stems must pass through our 4-stage DSP mastering rack before entering Remotion:

```
[Raw Audio Stem] 
       │
       ▼
[Stage 1: High-Pass Filter @ 75Hz, 18dB/oct] (eliminates HVAC & sub-rumble)
       │
       ▼
[Stage 2: Parametric EQ: +2.0dB @ 180Hz (Chest Warmth), +2.0dB @ 3.8kHz (Presence)]
       │
       ▼
[Stage 3: Notch De-Esser: -4.5dB dynamic cut @ 7.0kHz, Q=2.5]
       │
       ▼
[Stage 4: Multiband Compressor (2.5:1 ratio, 30ms attack, 120ms release)]
       │
       ▼
[Stage 5: EBU R128 Loudness Normalizer (Target: -14.0 LUFS, TP: -1.0 dBFS)]
       │
       ▼
[Master Broadcast Audio Stem]
```

### CLI Command for Loudness Normalization:
```bash
./scripts/loudnorm.sh input.wav output_mastered.wav
```
Or via FFmpeg:
```bash
ffmpeg -i input.wav -af loudnorm=I=-14.0:TP=-1.0:LRA=7.0 output_mastered.wav
```
