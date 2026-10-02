#!/usr/bin/env python3
"""
Synthesize the complete soundscape suite for Not a Startup (Paisa Decode Style):
1. 18 bespoke diegetic foley sound effects in public/audio/sfx/
2. Lo-Fi acoustic rhythm BGM bed in public/audio/bgm/cafe_groove.mp3
"""

import os
import subprocess
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SFX_DIR = os.path.join(ROOT_DIR, "public", "audio", "sfx")
BGM_DIR = os.path.join(ROOT_DIR, "public", "audio", "bgm")

os.makedirs(SFX_DIR, exist_ok=True)
os.makedirs(BGM_DIR, exist_ok=True)

SR = 44100  # High quality audio

def butter_bandpass_filter(data, lowcut, highcut, fs, order=4):
    nyq = 0.5 * fs
    low = max(0.001, lowcut / nyq)
    high = min(0.999, highcut / nyq)
    b, a = butter(order, [low, high], btype='band')
    return lfilter(b, a, data)

def butter_lowpass_filter(data, cutoff, fs, order=4):
    nyq = 0.5 * fs
    normal_cutoff = min(0.999, cutoff / nyq)
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    return lfilter(b, a, data)

def normalize(audio, target_db=-6.0):
    peak = np.max(np.abs(audio))
    if peak > 0:
        factor = (10 ** (target_db / 20.0)) / peak
        return audio * factor
    return audio

def save_wav(filename, audio, sr=SR):
    audio_norm = normalize(audio, target_db=-4.0)
    audio_int16 = (audio_norm * 32767).astype(np.int16)
    out_path = os.path.join(SFX_DIR, filename)
    wavfile.write(out_path, sr, audio_int16)
    print(f"Generated: {filename} ({len(audio)/sr:.2f}s)")

# -------------------------------------------------------------
# 1. FOLEY SOUND EFFECTS GENERATOR
# -------------------------------------------------------------

def gen_door_chime():
    # Two-tone brass bell chime (E5: 659.25Hz -> G5: 783.99Hz)
    t = np.linspace(0, 1.4, int(SR * 1.4), False)
    decay1 = np.exp(-t * 4.5)
    decay2 = np.exp(-np.maximum(0, t - 0.25) * 4.0) * (t >= 0.25)
    
    # Tone 1 with bell overtones
    s1 = (np.sin(2 * np.pi * 659.25 * t) + 
          0.4 * np.sin(2 * np.pi * 1318.5 * t) + 
          0.2 * np.sin(2 * np.pi * 2637 * t)) * decay1
    # Tone 2
    s2 = (np.sin(2 * np.pi * 783.99 * t) + 
          0.4 * np.sin(2 * np.pi * 1568 * t) + 
          0.2 * np.sin(2 * np.pi * 3136 * t)) * decay2
    return s1 + s2

def gen_portafilter_clack():
    # Heavy brass click + metallic lock ring
    t = np.linspace(0, 0.25, int(SR * 0.25), False)
    # Impact transient
    click = np.random.normal(0, 1, len(t)) * np.exp(-t * 120)
    click = butter_bandpass_filter(click, 1200, 4800, SR)
    # Brass body resonance
    ring = np.sin(2 * np.pi * 320 * t) * np.exp(-t * 25) + np.sin(2 * np.pi * 840 * t) * np.exp(-t * 40)
    return click * 1.5 + ring * 0.8

def gen_steam_wand_hiss():
    # Espresso steam burst with high pressure hiss
    t = np.linspace(0, 1.8, int(SR * 1.8), False)
    noise = np.random.normal(0, 1, len(t))
    # Bandpass hiss
    hiss = butter_bandpass_filter(noise, 2500, 8500, SR)
    # Attack and slow decay
    env = np.clip(t / 0.08, 0, 1) * np.exp(-t * 1.2)
    return hiss * env

def gen_screen_tap():
    # Tactile smartphone tap
    t = np.linspace(0, 0.06, int(SR * 0.06), False)
    pop = np.sin(2 * np.pi * 1200 * (1 - t * 12) * t) * np.exp(-t * 90)
    return pop

def gen_calculator_taps():
    # 4 rapid subtle screen taps
    total_len = int(SR * 0.7)
    out = np.zeros(total_len)
    tap = gen_screen_tap()
    for offset_s in [0.05, 0.18, 0.32, 0.48]:
        idx = int(offset_s * SR)
        out[idx:idx + len(tap)] += tap * (0.8 + np.random.rand() * 0.4)
    return out

def gen_paper_unroll():
    # Texture of rolling out architectural blueprint
    t = np.linspace(0, 0.8, int(SR * 0.8), False)
    noise = np.random.normal(0, 1, len(t))
    f_noise = butter_bandpass_filter(noise, 600, 2600, SR)
    env = np.sin(np.pi * t / 0.8) ** 1.5
    return f_noise * env

def gen_measuring_tape():
    # Tape measure pull and click snap
    t = np.linspace(0, 0.6, int(SR * 0.6), False)
    out = np.zeros(len(t))
    for i in range(12):
        pos = int((0.04 + i * 0.035) * SR)
        click_t = np.linspace(0, 0.015, int(SR * 0.015), False)
        click = np.sin(2 * np.pi * 2800 * click_t) * np.exp(-click_t * 300)
        out[pos:pos+len(click)] += click
    # Snap at the end
    snap_pos = int(0.5 * SR)
    snap_t = np.linspace(0, 0.08, int(SR * 0.08), False)
    snap = np.sin(2 * np.pi * 1600 * snap_t) * np.exp(-snap_t * 80)
    out[snap_pos:snap_pos+len(snap)] += snap * 2.0
    return out

def gen_stamp_thud():
    # Heavy rubber stamp slamming onto desk
    t = np.linspace(0, 0.35, int(SR * 0.35), False)
    thud = np.sin(2 * np.pi * 110 * np.exp(-t * 20) * t) * np.exp(-t * 18)
    slap = np.random.normal(0, 1, len(t)) * np.exp(-t * 80)
    slap = butter_bandpass_filter(slap, 800, 3200, SR)
    return thud * 1.4 + slap * 0.7

def gen_safe_door_slam():
    # Massive heavy iron vault door slam + metallic resonance
    t = np.linspace(0, 1.6, int(SR * 1.6), False)
    sub = np.sin(2 * np.pi * 65 * np.exp(-t * 8) * t) * np.exp(-t * 5)
    metal = (np.sin(2 * np.pi * 420 * t) + 0.6 * np.sin(2 * np.pi * 780 * t)) * np.exp(-t * 9)
    thud = np.random.normal(0, 1, len(t)) * np.exp(-t * 40)
    thud = butter_lowpass_filter(thud, 400, SR)
    return sub * 1.8 + metal * 0.6 + thud * 1.2

def gen_monsoon_rain_window():
    # Ambient Bangalore monsoon rain patter
    t = np.linspace(0, 3.5, int(SR * 3.5), False)
    noise = np.random.normal(0, 1, len(t))
    rain_bed = butter_bandpass_filter(noise, 400, 3800, SR)
    # Random water droplet impacts
    droplets = np.zeros(len(t))
    num_drops = 45
    drop_indices = np.random.randint(0, len(t) - 1000, num_drops)
    for idx in drop_indices:
        dt = np.linspace(0, 0.02, int(SR * 0.02), False)
        drop = np.sin(2 * np.pi * (1800 + np.random.rand() * 1200) * dt) * np.exp(-dt * 250)
        droplets[idx:idx+len(drop)] += drop * (0.3 + np.random.rand() * 0.5)
    return rain_bed * 0.4 + droplets * 0.6

def gen_wall_clock_tick():
    # Clock tick and tock
    t = np.linspace(0, 1.2, int(SR * 1.2), False)
    out = np.zeros(len(t))
    # Tick at 0.1s
    p1 = int(0.1 * SR)
    t1 = np.linspace(0, 0.04, int(SR * 0.04), False)
    tick = np.sin(2 * np.pi * 1850 * t1) * np.exp(-t1 * 140)
    out[p1:p1+len(tick)] += tick
    # Tock at 0.6s
    p2 = int(0.6 * SR)
    t2 = np.linspace(0, 0.04, int(SR * 0.04), False)
    tock = np.sin(2 * np.pi * 1420 * t2) * np.exp(-t2 * 140)
    out[p2:p2+len(tock)] += tock * 0.9
    return out

def gen_receipt_printer():
    # Thermal receipt printer stepper motor buzz & paper advance
    t = np.linspace(0, 1.2, int(SR * 1.2), False)
    # Stepper frequency oscillation
    motor = np.sign(np.sin(2 * np.pi * 280 * t)) * 0.3
    chatter = np.random.normal(0, 1, len(t)) * (np.sin(2 * np.pi * 18 * t) > 0)
    chatter = butter_bandpass_filter(chatter, 1500, 5000, SR)
    env = np.clip(t / 0.1, 0, 1) * np.clip((1.2 - t) / 0.1, 0, 1)
    return (motor + chatter * 0.7) * env

def gen_cup_saucer_clink():
    # Fine ceramic porcelain cup landing on saucer
    t = np.linspace(0, 0.8, int(SR * 0.8), False)
    clink = (np.sin(2 * np.pi * 4200 * t) + 
             0.5 * np.sin(2 * np.pi * 6300 * t) + 
             0.3 * np.sin(2 * np.pi * 8400 * t)) * np.exp(-t * 16)
    tap = np.random.normal(0, 1, len(t)) * np.exp(-t * 90)
    tap = butter_bandpass_filter(tap, 2000, 6000, SR)
    return clink * 1.2 + tap * 0.5

def gen_slice_laser():
    # Crisp laser slice whoosh
    t = np.linspace(0, 0.4, int(SR * 0.4), False)
    freq = 3200 * np.exp(-t * 9) + 200
    laser = np.sin(2 * np.pi * freq * t) * np.sin(np.pi * t / 0.4)
    return laser

def gen_mechanical_gear():
    # Ratchet gear wheel turning
    t = np.linspace(0, 0.7, int(SR * 0.7), False)
    out = np.zeros(len(t))
    clicks = 12
    for i in range(clicks):
        pos = int((i * 0.05) * SR)
        ct = np.linspace(0, 0.02, int(SR * 0.02), False)
        click = np.sin(2 * np.pi * 2200 * ct) * np.exp(-ct * 220)
        out[pos:pos+len(click)] += click
    return out

def gen_upi_success():
    # High crisp UPI payment confirmation chime (C6 -> E6 -> G6 -> C7 glissando)
    t = np.linspace(0, 1.5, int(SR * 1.5), False)
    out = np.zeros(len(t))
    notes = [1046.5, 1318.5, 1568.0, 2093.0] # C6, E6, G6, C7
    for i, freq in enumerate(notes):
        start_t = i * 0.09
        idx = int(start_t * SR)
        nt = np.linspace(0, 0.9, int(SR * 0.9), False)
        note = (np.sin(2 * np.pi * freq * nt) + 
                0.3 * np.sin(2 * np.pi * freq * 2 * nt)) * np.exp(-nt * 5.0)
        out[idx:idx+len(note)] += note
    return out

def gen_whip_whoosh():
    # Fast camera whip whoosh
    t = np.linspace(0, 0.35, int(SR * 0.35), False)
    noise = np.random.normal(0, 1, len(t))
    whoosh = butter_bandpass_filter(noise, 300, 2200, SR)
    env = (np.sin(np.pi * t / 0.35)) ** 2
    return whoosh * env

def gen_plate_table_clatter():
    # Plate landing on wooden table
    t = np.linspace(0, 0.4, int(SR * 0.4), False)
    wood = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 25)
    ceramic = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 50)
    return wood * 1.2 + ceramic * 0.8

print("Synthesizing 18 diegetic foley sound effects...")
save_wav("door_chime.wav", gen_door_chime())
save_wav("portafilter_clack.wav", gen_portafilter_clack())
save_wav("steam_wand_hiss.wav", gen_steam_wand_hiss())
save_wav("screen_tap.wav", gen_screen_tap())
save_wav("calculator_taps.wav", gen_calculator_taps())
save_wav("paper_unroll.wav", gen_paper_unroll())
save_wav("measuring_tape.wav", gen_measuring_tape())
save_wav("stamp_thud.wav", gen_stamp_thud())
save_wav("safe_door_slam.wav", gen_safe_door_slam())
save_wav("monsoon_rain_window.wav", gen_monsoon_rain_window())
save_wav("wall_clock_tick.wav", gen_wall_clock_tick())
save_wav("receipt_printer.wav", gen_receipt_printer())
save_wav("cup_saucer_clink.wav", gen_cup_saucer_clink())
save_wav("slice_laser.wav", gen_slice_laser())
save_wav("mechanical_gear.wav", gen_mechanical_gear())
save_wav("upi_success_voice.wav", gen_upi_success())
save_wav("whip_whoosh.wav", gen_whip_whoosh())
save_wav("plate_table_clatter.wav", gen_plate_table_clatter())

# -------------------------------------------------------------
# 2. LO-FI BGM GROOVE GENERATOR (Seamless 45s loop)
# -------------------------------------------------------------
print("\nSynthesizing Lo-Fi acoustic rhythm BGM bed (cafe_groove.mp3)...")

BPM = 84
BEAT_DUR = 60.0 / BPM
BAR_DUR = BEAT_DUR * 4
NUM_BARS = 16  # ~45.7 seconds
TOTAL_DURATION = BAR_DUR * NUM_BARS
TOTAL_SAMPLES = int(SR * TOTAL_DURATION)

# Frequencies for Rhodes chords (Dmaj9 -> C#m7 -> Bm9 -> A13)
chord_prog = [
    # Bar 1: Dmaj9
    [146.83, 220.00, 277.18, 329.63, 369.99], # D3, A3, C#4, E4, F#4
    # Bar 2: C#m7
    [138.59, 207.65, 246.94, 329.63, 369.99], # C#3, G#3, B3, E4, F#4
    # Bar 3: Bm9
    [123.47, 185.00, 220.00, 277.18, 293.66], # B2, F#3, A3, C#4, D4
    # Bar 4: A13
    [110.00, 164.81, 220.00, 277.18, 329.63, 440.00], # A2, E3, A3, C#4, E4, A4
]

bgm_audio = np.zeros(TOTAL_SAMPLES)

# 1. Electric Piano / Rhodes Synth
for bar in range(NUM_BARS):
    chord = chord_prog[bar % 4]
    bar_start_sample = int(bar * BAR_DUR * SR)
    t_chord = np.linspace(0, BAR_DUR, int(BAR_DUR * SR), False)
    
    # Rhodes chord with warm envelope and tremolo
    tremolo = 1.0 + 0.15 * np.sin(2 * np.pi * 4.5 * t_chord)
    chord_wave = np.zeros(len(t_chord))
    for freq in chord:
        # Harmonics for chime-like Rhodes tone
        tone = (np.sin(2 * np.pi * freq * t_chord) + 
                0.35 * np.sin(2 * np.pi * 2 * freq * t_chord) + 
                0.12 * np.sin(2 * np.pi * 3 * freq * t_chord))
        chord_wave += tone
    
    # Smooth attack and slow decay
    env = np.clip(t_chord / 0.05, 0, 1) * np.exp(-t_chord * 0.45)
    bgm_audio[bar_start_sample:bar_start_sample + len(t_chord)] += chord_wave * env * tremolo * 0.35

# 2. Warm Sub Bass
for bar in range(NUM_BARS):
    root_freq = chord_prog[bar % 4][0] / 2.0  # 1 octave lower
    bar_start_sample = int(bar * BAR_DUR * SR)
    # Bass notes: root on 1, fifth on 3
    t_bass1 = np.linspace(0, BEAT_DUR * 1.8, int(BEAT_DUR * 1.8 * SR), False)
    bass1 = (np.sin(2 * np.pi * root_freq * t_bass1) + 0.25 * np.sin(2 * np.pi * root_freq * 2 * t_bass1)) * np.exp(-t_bass1 * 0.8)
    
    fifth_freq = root_freq * 1.5
    t_bass2 = np.linspace(0, BEAT_DUR * 1.8, int(BEAT_DUR * 1.8 * SR), False)
    bass2 = (np.sin(2 * np.pi * fifth_freq * t_bass2) + 0.25 * np.sin(2 * np.pi * fifth_freq * 2 * t_bass2)) * np.exp(-t_bass2 * 0.8)
    
    bgm_audio[bar_start_sample:bar_start_sample + len(t_bass1)] += bass1 * 0.55
    second_beat = int(bar_start_sample + BEAT_DUR * 2 * SR)
    if second_beat + len(t_bass2) <= TOTAL_SAMPLES:
        bgm_audio[second_beat:second_beat + len(t_bass2)] += bass2 * 0.45

# 3. Soft Lo-Fi Drum Kit
kick_t = np.linspace(0, 0.22, int(0.22 * SR), False)
kick = np.sin(2 * np.pi * 55 * np.exp(-kick_t * 16) * kick_t) * np.exp(-kick_t * 14)

snare_t = np.linspace(0, 0.18, int(0.18 * SR), False)
snare_noise = np.random.normal(0, 1, len(snare_t)) * np.exp(-snare_t * 25)
snare_noise = butter_bandpass_filter(snare_noise, 800, 4500, SR)
snare_tone = np.sin(2 * np.pi * 210 * snare_t) * np.exp(-snare_t * 40)
snare = (snare_noise * 0.8 + snare_tone * 0.4) * 0.7

hihat_t = np.linspace(0, 0.05, int(0.05 * SR), False)
hihat = butter_bandpass_filter(np.random.normal(0, 1, len(hihat_t)), 5000, 12000, SR) * np.exp(-hihat_t * 90) * 0.35

for bar in range(NUM_BARS):
    for beat in range(4):
        beat_idx = int((bar * 4 + beat) * BEAT_DUR * SR)
        # Kick on 1 and 3 (with swing)
        if beat == 0 or beat == 2:
            if beat_idx + len(kick) <= TOTAL_SAMPLES:
                bgm_audio[beat_idx:beat_idx + len(kick)] += kick * 0.6
        # Snare on 2 and 4
        if beat == 1 or beat == 3:
            if beat_idx + len(snare) <= TOTAL_SAMPLES:
                bgm_audio[beat_idx:beat_idx + len(snare)] += snare * 0.55
        # Swung Hi-Hats
        if beat_idx + len(hihat) <= TOTAL_SAMPLES:
            bgm_audio[beat_idx:beat_idx + len(hihat)] += hihat
        # 8th note swing
        swung_idx = int(beat_idx + BEAT_DUR * 0.58 * SR)
        if swung_idx + len(hihat) <= TOTAL_SAMPLES:
            bgm_audio[swung_idx:swung_idx + len(hihat)] += hihat * 0.7

# 4. Subtle Vinyl Crackle / Warmth
vinyl_noise = np.random.normal(0, 1, TOTAL_SAMPLES)
vinyl_crackle = butter_bandpass_filter(vinyl_noise, 1500, 6000, SR) * 0.012
bgm_audio += vinyl_crackle

# Normalize BGM to -14 dBFS
bgm_norm = normalize(bgm_audio, target_db=-14.0)
bgm_int16 = (bgm_norm * 32767).astype(np.int16)

raw_bgm_wav = os.path.join(BGM_DIR, "cafe_groove.wav")
out_bgm_mp3 = os.path.join(BGM_DIR, "cafe_groove.mp3")

wavfile.write(raw_bgm_wav, SR, bgm_int16)

# Convert to 192kbps MP3 via ffmpeg
subprocess.run([
    "ffmpeg", "-y", "-i", raw_bgm_wav,
    "-codec:a", "libmp3lame", "-b:a", "192k",
    out_bgm_mp3
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

os.remove(raw_bgm_wav)
print(f"BGM Generated: {out_bgm_mp3} ({TOTAL_DURATION:.1f}s loop)")
print("Soundscape generation complete!")
