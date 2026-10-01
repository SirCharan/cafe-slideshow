#!/usr/bin/env python3
"""
Generate an organic, natural soundscape suite for Episode 02: The Economics of Bangalore PG Hostels.
STRICT RULE: Zero harsh synthetic sine sweeps, zero beeps, zero metallic artifacts.
Only organic acoustic textures with soft roll-offs and smooth envelopes.
"""

import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 44100
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SFX_DIR = os.path.join(ROOT_DIR, "public", "audio", "sfx", "pg")
os.makedirs(SFX_DIR, exist_ok=True)

def butter_lowpass(data, cutoff, fs, order=3):
    nyq = 0.5 * fs
    normal_cutoff = min(0.999, cutoff / nyq)
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    return lfilter(b, a, data)

def butter_bandpass(data, lowcut, highcut, fs, order=3):
    nyq = 0.5 * fs
    low = max(0.001, lowcut / nyq)
    high = min(0.999, highcut / nyq)
    b, a = butter(order, [low, high], btype='band')
    return lfilter(b, a, data)

def normalize(audio, target_db=-6.0):
    peak = np.max(np.abs(audio))
    if peak > 0:
        factor = (10 ** (target_db / 20.0)) / peak
        return audio * factor
    return audio

def save_wav(name, audio, target_db=-6.0):
    audio_norm = normalize(audio, target_db=target_db)
    audio_int16 = (audio_norm * 32767).astype(np.int16)
    path = os.path.join(SFX_DIR, name)
    wavfile.write(path, SR, audio_int16)
    print(f"Generated: {name} ({len(audio)/SR:.2f}s, target: {target_db} dB)")

# 1. WHOOSH SOFT: Natural acoustic air draft (NO sine waves, low-passed pink noise)
def gen_whoosh_soft():
    duration = 0.45
    t = np.linspace(0, duration, int(SR * duration), False)
    # Pink noise approximation (1/f)
    white = np.random.normal(0, 1, len(t))
    # Low-pass filter to keep it deep and mellow (350Hz - 950Hz)
    body = butter_bandpass(white, 200, 950, SR)
    # Smooth Hann window envelope (gentle ramp up and down)
    env = np.sin(np.pi * t / duration) ** 2
    return body * env

# 2. KEYS JINGLE: Subtle brass key chain rattle (PG uncle holding room keys)
def gen_keys_jingle():
    duration = 0.65
    t = np.linspace(0, duration, int(SR * duration), False)
    out = np.zeros(len(t))
    clinks = [0.02, 0.12, 0.22, 0.36, 0.48]
    freqs = [2400, 3100, 2750, 3400, 2900]
    for c_t, f in zip(clinks, freqs):
        idx = int(c_t * SR)
        dt = np.linspace(0, 0.08, int(SR * 0.08), False)
        clink = np.sin(2 * np.pi * f * dt) * np.exp(-dt * 90)
        noise = np.random.normal(0, 0.3, len(dt)) * np.exp(-dt * 120)
        out[idx:idx+len(dt)] += (clink + noise) * 0.5
    return butter_lowpass(out, 5000, SR)

# 3. CASH COUNT: Paper rupee notes snapping / shuffling
def gen_cash_count():
    duration = 0.70
    t = np.linspace(0, duration, int(SR * duration), False)
    out = np.zeros(len(t))
    flips = [0.05, 0.16, 0.28, 0.40, 0.52]
    for flip_t in flips:
        idx = int(flip_t * SR)
        dt = np.linspace(0, 0.06, int(SR * 0.06), False)
        # Texture of stiff paper sliding
        flick = np.random.normal(0, 1, len(dt))
        flick = butter_bandpass(flick, 800, 3200, SR) * np.exp(-dt * 70)
        out[idx:idx+len(dt)] += flick * 0.7
    return out

# 4. GEYSER CLICK: Bi-metallic relay thermostat click
def gen_geyser_click():
    duration = 0.30
    t = np.linspace(0, duration, int(SR * duration), False)
    out = np.zeros(len(t))
    # Dual heavy relay mechanical click
    dt1 = np.linspace(0, 0.03, int(SR * 0.03), False)
    click1 = np.sin(2 * np.pi * 950 * dt1) * np.exp(-dt1 * 140)
    out[0:len(dt1)] += click1
    dt2 = np.linspace(0, 0.04, int(SR * 0.04), False)
    click2 = np.sin(2 * np.pi * 650 * dt2) * np.exp(-dt2 * 110)
    out[int(0.04 * SR):int(0.04 * SR)+len(dt2)] += click2 * 0.8
    return out

# 5. WATER TANKER RUMBLE: Distant low diesel truck thrum & water slosh
def gen_water_tanker():
    duration = 1.8
    t = np.linspace(0, duration, int(SR * duration), False)
    # Low-frequency diesel engine rumble (45Hz - 120Hz)
    motor = (np.sin(2 * np.pi * 52 * t) + 0.5 * np.sin(2 * np.pi * 104 * t)) * 0.6
    # Low-passed filtered rumble
    noise = np.random.normal(0, 0.4, len(t))
    noise_sub = butter_lowpass(noise, 220, SR)
    env = np.clip(t / 0.3, 0, 1) * np.clip((duration - t) / 0.4, 0, 1)
    return (motor + noise_sub) * env

# 6. LADLE STIR: Gentle stainless steel pot contact
def gen_ladle_stir():
    duration = 0.85
    t = np.linspace(0, duration, int(SR * duration), False)
    out = np.zeros(len(t))
    # Soft stainless clang with liquid damping
    scrapes = [0.08, 0.32, 0.58]
    for s_t in scrapes:
        idx = int(s_t * SR)
        dt = np.linspace(0, 0.12, int(SR * 0.12), False)
        scrape = (np.sin(2 * np.pi * 1650 * dt) + 0.4 * np.sin(2 * np.pi * 2200 * dt)) * np.exp(-dt * 45)
        out[idx:idx+len(dt)] += scrape * 0.4
    return out

# 7. BIOMETRIC CHIRP: Quiet, subtle double acknowledgment tick
def gen_biometric_chirp():
    duration = 0.28
    t = np.linspace(0, duration, int(SR * duration), False)
    out = np.zeros(len(t))
    # Two very soft, low-volume rounded blips (1200Hz, warm, short 25ms)
    dt = np.linspace(0, 0.025, int(SR * 0.025), False)
    blip1 = np.sin(2 * np.pi * 1250 * dt) * (np.sin(np.pi * dt / 0.025) ** 2)
    blip2 = np.sin(2 * np.pi * 1500 * dt) * (np.sin(np.pi * dt / 0.025) ** 2)
    out[0:len(dt)] += blip1 * 0.5
    out[int(0.06 * SR):int(0.06 * SR)+len(dt)] += blip2 * 0.6
    return out

# 8. SUB-METER TICK: Discrete electric impulse tick
def gen_submeter_tick():
    duration = 0.15
    t = np.linspace(0, duration, int(SR * duration), False)
    dt = np.linspace(0, 0.02, int(SR * 0.02), False)
    tick = np.sin(2 * np.pi * 1800 * dt) * np.exp(-dt * 180)
    out = np.zeros(len(t))
    out[0:len(dt)] = tick
    return out

if __name__ == "__main__":
    print("Generating PG organic soundscape suite...")
    save_wav("whoosh_soft.wav", gen_whoosh_soft(), target_db=-8.0)
    save_wav("keys_jingle.wav", gen_keys_jingle(), target_db=-7.0)
    save_wav("cash_count.wav", gen_cash_count(), target_db=-6.0)
    save_wav("geyser_click.wav", gen_geyser_click(), target_db=-9.0)
    save_wav("water_tanker_rumble.wav", gen_water_tanker(), target_db=-10.0)
    save_wav("ladle_stir.wav", gen_ladle_stir(), target_db=-8.0)
    save_wav("biometric_chirp.wav", gen_biometric_chirp(), target_db=-12.0)
    save_wav("submeter_tick.wav", gen_submeter_tick(), target_db=-10.0)
    print("Soundscape generation complete! All files saved in public/audio/sfx/pg/")
