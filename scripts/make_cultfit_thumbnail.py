#!/usr/bin/env python3
"""
Generate Infographic Blueprint Thumbnail for Cult.fit Franchise Teardown
"""

import os
from PIL import Image, ImageDraw, ImageFont
import math

OUT_FILE = "/Users/ck/claude/cafe-slideshow/public/thumbnails/cultfit_blueprint_thumb.png"
font_heavy = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
font_bold = "/System/Library/Fonts/Helvetica.ttc"

title_font = ImageFont.truetype(font_heavy, 76)
callout_bold = ImageFont.truetype(font_heavy, 26)
callout_sub = ImageFont.truetype(font_bold, 22)
stamp_font = ImageFont.truetype(font_heavy, 22)

def draw_bezier_arrow(draw, start, end, control, color="#111827", width=3):
    steps = 25
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
    head_len = 16
    head_angle = math.pi / 6
    p1 = (end[0] - head_len * math.cos(angle - head_angle), end[1] - head_len * math.sin(angle - head_angle))
    p2 = (end[0] - head_len * math.cos(angle + head_angle), end[1] - head_len * math.sin(angle + head_angle))
    draw.polygon([end, p1, p2], fill=color)

def make_cultfit_thumb():
    width, height = 1920, 1080
    im = Image.new("RGBA", (width, height), (250, 248, 245, 255))
    draw = ImageDraw.Draw(im)

    # 1. Graph Paper Grid
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(226, 220, 212, 160), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(226, 220, 212, 160), width=1)

    # 2. Headline
    line1 = "SO YOU WANT TO OWN A"
    bbox1 = draw.textbbox((0, 0), line1, font=title_font)
    w1 = bbox1[2] - bbox1[0]
    draw.text(((width - w1) // 2, 45), line1, font=title_font, fill="#111827")

    prefix = "CULT.FIT "
    target = "FRANCHISE?"
    b_pre = draw.textbbox((0, 0), prefix, font=title_font)
    b_tar = draw.textbbox((0, 0), target, font=title_font)
    w_pre = b_pre[2] - b_pre[0]
    w_tar = b_tar[2] - b_tar[0]
    total_w2 = w_pre + w_tar
    start_x2 = (width - total_w2) // 2

    draw.text((start_x2, 135), prefix, font=title_font, fill="#DC2626")
    draw.text((start_x2 + w_pre, 135), target, font=title_font, fill="#111827")

    underline_y = 235
    draw.line([(start_x2 - 30, underline_y), (start_x2 + total_w2 + 30, underline_y)], fill="#DC2626", width=8)

    # 3. Hero Cutaway Illustration (Procedural Cult Center: Turf, Kettlebells, Heavy Sound Rig)
    cx, cy = 960, 630
    # Center Gym Box Cutaway
    draw.polygon([(cx - 320, cy + 200), (cx + 320, cy + 200), (cx + 320, cy - 200), (cx - 320, cy - 200)], fill="#0F172A", outline="#DC2626", width=4)
    # Green Sprint Turf in Middle
    draw.rectangle([cx - 280, cy + 80, cx + 280, cy + 180], fill="#16A34A", outline="#15803D", width=3)
    draw.text((cx, cy + 130), "50M INDOOR SPRINT TURF", font=callout_sub, fill="#FFFFFF", anchor="mm")
    # Cult Screen on Wall
    draw.rectangle([cx - 160, cy - 170, cx + 160, cy - 60], fill="#1E293B", outline="#F43F5E", width=3)
    draw.text((cx, cy - 115), "CULT LIVE WORKOUT DISPLAY", font=callout_sub, fill="#FDA4AF", anchor="mm")
    # Punching bags and Kettlebell Racks
    for bx in [cx - 240, cx - 180, cx + 180, cx + 240]:
        draw.rounded_rectangle([bx - 15, cy - 40, bx + 15, cy + 40], radius=8, fill="#DC2626", outline="#7F1D1D", width=2)

    # 4. 6 Forensic Callout Boxes with Bezier Arrows
    callouts = [
        {"tx": 100, "ty": 300, "header": "₹2.2 CR FITOUT CAPEX", "detail": "Acoustic flooring + Rig + HVAC", "start": (480, 320), "end": (cx - 260, cy - 140), "control": (600, 310), "color": "#DC2626"},
        {"tx": 80, "ty": 530, "header": "4,500 SQ FT LEASE", "detail": "₹4,20,000 / mo in prime tech hub", "start": (460, 550), "end": (cx - 280, cy + 20), "control": (620, 560), "color": "#DC2626"},
        {"tx": 100, "ty": 760, "header": "50-TON HVAC POWER", "detail": "₹1,40,000 / mo electricity bill", "start": (450, 780), "end": (cx - 200, cy + 160), "control": (620, 800), "color": "#B45309"},
        {"tx": 1380, "ty": 300, "header": "12% CUREFIT ROYALTY", "detail": "Cut taken from total collections", "start": (1360, 320), "end": (cx + 260, cy - 140), "control": (1220, 310), "color": "#111827"},
        {"tx": 1380, "ty": 530, "header": "60% ANNUAL CHURN", "detail": "Subscribers quit after 3 months", "start": (1360, 550), "end": (cx + 280, cy + 20), "control": (1220, 560), "color": "#DC2626"},
        {"tx": 1380, "ty": 760, "header": "TRUE PAYBACK PERIOD", "detail": "54 Months (Pitch deck said 18)", "start": (1360, 780), "end": (cx + 200, cy + 160), "control": (1220, 820), "color": "#047857"},
    ]

    for c in callouts:
        draw.text((c["tx"], c["ty"]), c["header"], font=callout_bold, fill=c["color"])
        draw.text((c["tx"], c["ty"] + 32), c["detail"], font=callout_sub, fill="#374151")
        draw_bezier_arrow(draw, c["start"], c["end"], c["control"], color="#111827", width=3)

    # 5. Stamp
    badge_w, badge_h = 440, 60
    bx = (width - badge_w) // 2
    by = height - 90
    draw.rectangle([bx, by, bx + badge_w, by + badge_h], fill="#111827")
    draw.text((bx + badge_w // 2, by + badge_h // 2), "NOT A STARTUP · CULT.FIT FRANCHISE P&L", font=stamp_font, fill="#FCD34D", anchor="mm")

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    im.save(OUT_FILE, "PNG")
    print(f"✓ Cult.fit Blueprint Thumbnail rendered: {OUT_FILE}")

if __name__ == "__main__":
    make_cultfit_thumb()
