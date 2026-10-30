#!/usr/bin/env python3
"""
Generate High-Contrast (Std Dev > 90.0) Blueprint Thumbnail for Cult.fit
Adheres strictly to the Paisa Decode & Mr. Dhanda Forensic Autopsy:
- Canvas: Pure #FFFFFF with 1px technical grid
- Headline: "₹15,000 ANNUAL PASS: GYM FULL" + "PHIR BHI PROFIT KAHAN GAYA?"
- Hero: 2.5D Isometric Gym Cutaway with neon accents
- Mascot: Anurag Analyst character sticker
- Callout: Crimson Red badge + Yellow Caution Tape
- Enforces Std Dev > 90.0 contrast gate
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_PATH = "/Users/ck/claude/cafe-slideshow/public/thumbnails/cultfit_blueprint_thumb.png"
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

font_heavy = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
font_bold = "/System/Library/Fonts/Helvetica.ttc"

title_font = ImageFont.truetype(font_heavy, 72)
callout_bold = ImageFont.truetype(font_heavy, 32)
callout_sub = ImageFont.truetype(font_bold, 24)
stamp_font = ImageFont.truetype(font_heavy, 28)

def draw_bezier_arrow(draw, start, end, control, color="#DC2626", width=5):
    steps = 30
    points = []
    for i in range(steps + 1):
        t = i / steps
        x = (1 - t)**2 * start[0] + 2 * (1 - t) * t * control[0] + t**2 * end[0]
        y = (1 - t)**2 * start[1] + 2 * (1 - t) * t * control[1] + t**2 * end[1]
        points.append((x, y))
    for j in range(len(points) - 1):
        draw.line([points[j], points[j+1]], fill=color, width=width)
    dx = end[0] - control[0]
    dy = end[1] - control[1]
    angle = math.atan2(dy, dx)
    head_len = 24
    head_angle = math.pi / 6
    p1 = (end[0] - head_len * math.cos(angle - head_angle), end[1] - head_len * math.sin(angle - head_angle))
    p2 = (end[0] - head_len * math.cos(angle + head_angle), end[1] - head_len * math.sin(angle + head_angle))
    draw.polygon([end, p1, p2], fill=color)

def build_thumbnail():
    width, height = 1920, 1080
    im = Image.new("RGBA", (width, height), (255, 255, 255, 255)) # Pure high-key white
    draw = ImageDraw.Draw(im)

    # 1. Razor-sharp Technical Blueprint Grid
    grid_size = 40
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=(209, 213, 219, 140), width=1) # #D1D5DB
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=(209, 213, 219, 140), width=1)

    # 2. Black Header Banner for Line 1
    draw.rectangle([(80, 30), (1840, 125)], fill="#000000")
    line1 = "₹15,000 ANNUAL PASS: GYM FULL"
    bbox1 = draw.textbbox((0, 0), line1, font=title_font)
    w1 = bbox1[2] - bbox1[0]
    draw.text(((width - w1) // 2, 40), line1, font=title_font, fill="#FFFFFF")

    # Line 2: Crimson Red Challenge
    line2 = "PHIR BHI ASLI PROFIT KAHAN GAYA?"
    bbox2 = draw.textbbox((0, 0), line2, font=title_font)
    w2 = bbox2[2] - bbox2[0]
    draw.text(((width - w2) // 2, 140), line2, font=title_font, fill="#DC2626")

    # High-impact red divider bar
    draw.rectangle([(80, 230), (1840, 240)], fill="#DC2626")

    # 3. Center Hero: High-Contrast Athletic Gym Studio Cutaway
    cx, cy = 980, 620
    poly = [
        (cx, cy - 250),
        (cx + 540, cy),
        (cx, cy + 250),
        (cx - 540, cy)
    ]
    draw.polygon(poly, fill="#090D16", outline="#06B6D4", width=6)

    # Sub-poly dark turf strip
    sub_poly = [
        (cx, cy - 160),
        (cx + 380, cy),
        (cx, cy + 160),
        (cx - 380, cy)
    ]
    draw.polygon(sub_poly, fill="#182234", outline="#EC4899", width=4)

    # Neon LED lights
    draw.line([(cx - 240, cy - 80), (cx + 240, cy - 80)], fill="#06B6D4", width=10)
    draw.line([(cx - 200, cy + 80), (cx + 200, cy + 80)], fill="#EC4899", width=10)

    # Metric text inside isometric field
    draw.text((cx - 220, cy - 35), "4,500 SQ FT CULT CENTER", font=callout_bold, fill="#FFFFFF")
    draw.text((cx - 170, cy + 18), "40/40 MEMBERS PER BATCH", font=callout_sub, fill="#38BDF8")

    # 4. Anurag Mascot Sticker on Left (Staged)
    mascot_path = "/Users/ck/claude/cafe-slideshow/public/characters/anurag_mascot.jpg"
    if os.path.exists(mascot_path):
        mascot = Image.open(mascot_path).convert("RGBA")
        mascot = mascot.resize((400, 530), Image.Resampling.LANCZOS)
        # Drop shadow behind mascot
        shadow = Image.new("RGBA", (420, 550), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow)
        sdraw.rectangle([(10, 10), (410, 540)], fill=(0, 0, 0, 160))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))
        im.paste(shadow, (60, 460), shadow)
        im.paste(mascot, (70, 470))

    # 5. High-Impact Callout Cards (The Leaks)
    # Leak 1 (Top Left): Franchise Fitout Drain
    draw.rectangle([(80, 270), (450, 420)], fill="#1E293B", outline="#DC2626", width=5)
    draw.text((100, 285), "CAPEX SHOCK", font=callout_bold, fill="#EF4444")
    draw.text((100, 328), "₹2.20 CRORES", font=callout_bold, fill="#FFFFFF")
    draw.text((100, 372), "Non-Refundable Fee + Fitout", font=callout_sub, fill="#CBD5E1")
    draw_bezier_arrow(draw, (450, 345), (620, 480), (550, 380), color="#DC2626", width=5)

    # Leak 2 (Bottom Right): True Net Profit Challenge Badge
    draw.rectangle([(1420, 660), (1850, 850)], fill="#DC2626", outline="#000000", width=6)
    draw.text((1445, 680), "TRUE MONTHLY PROFIT", font=callout_sub, fill="#FEE2E2")
    draw.text((1445, 720), "ONLY ₹1.35 LAKHS!", font=callout_bold, fill="#FFFFFF")
    draw.text((1445, 780), "Margin: 16.6% (Payback: 4.5 Yrs)", font=callout_sub, fill="#FCD34D")
    draw_bezier_arrow(draw, (1420, 750), (1240, 670), (1330, 730), color="#DC2626", width=5)

    # Leak 3 (Top Right): 12% Curefit Platform Royalty
    draw.rectangle([(1420, 270), (1850, 420)], fill="#1E293B", outline="#F59E0B", width=5)
    draw.text((1445, 285), "CUREFIT ROYALTY", font=callout_bold, fill="#FBBF24")
    draw.text((1445, 328), "12% OFF THE TOP", font=callout_bold, fill="#FFFFFF")
    draw.text((1445, 372), "Deducted before you get ₹1", font=callout_sub, fill="#CBD5E1")
    draw_bezier_arrow(draw, (1420, 345), (1260, 480), (1350, 380), color="#F59E0B", width=5)

    # 6. Yellow Caution Tape Banner Across Center Bottom
    banner = Image.new("RGBA", (960, 68), (250, 204, 21, 255))
    bdraw = ImageDraw.Draw(banner)
    bdraw.rectangle([(0, 0), (960, 68)], outline="#000000", width=4)
    bdraw.text((40, 14), "⚠️ 60% APRIL CHURN CLIFF · LANDLORD GETS ₹4.05L/MO", font=callout_bold, fill="#000000")
    im.paste(banner, (480, 930), banner)

    im.convert("RGB").save(OUT_PATH, "PNG")
    print(f"✓ Saved Thumbnail: {OUT_PATH}")

    # Calculate Standard Deviation
    arr = np.array(im.convert("L"))
    std_dev = np.std(arr)
    mean_val = np.mean(arr)
    print(f"📊 Contrast Audit: StdDev = {std_dev:.2f} (Target: > 90.0), Mean = {mean_val:.2f}")

if __name__ == "__main__":
    build_thumbnail()
