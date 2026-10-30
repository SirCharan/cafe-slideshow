#!/usr/bin/env python3
"""
Composite a Mr. Economics style Blueprint Thumbnail for Bangalore Cafe Teardown:
1. Cream grid notebook background (#FAF8F5)
2. Bold grotesque headline: "SO YOU WANT TO OWN A BANGALORE CAFÉ?" with red highlight
3. High-res 2.5D Isometric Architectural Cutaway blended seamlessly
4. Hand-drawn curved arrows with forensic financial callouts
5. Saved to public/thumbnails/ep01_blueprint_cafe.png and public/thumbnails/ep05_blueprint_cafe.png
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageChops

CAFE_ILLUST = "/Users/ck/.gemini/antigravity/brain/6567f7d7-6f21-4175-85d5-cb6f3a0a2638/isometric_cafe_cutaway_notext_1793357357397.jpg"
OUT_PATH = "/Users/ck/.gemini/antigravity/brain/6567f7d7-6f21-4175-85d5-cb6f3a0a2638/benchmarks/blueprint_thumbnail_master.png"
PUBLIC_EP01 = "/Users/ck/claude/cafe-slideshow/public/thumbnails/ep01_blueprint_cafe.png"
PUBLIC_EP05 = "/Users/ck/claude/cafe-slideshow/public/thumbnails/ep05_blueprint_cafe.png"

def make_thumbnail():
    width, height = 1920, 1080
    bg_color = (250, 248, 245, 255) # #FAF8F5 warm cream paper
    im = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(im)

    # 1. Graph Paper Grid
    grid_size = 40
    grid_color = (226, 220, 212, 160)
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)

    # Fonts
    font_heavy = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
    font_bold = "/System/Library/Fonts/Helvetica.ttc"
    
    title_font = ImageFont.truetype(font_heavy, 78)
    callout_bold = ImageFont.truetype(font_heavy, 27)
    callout_sub = ImageFont.truetype(font_bold, 23)

    # 2. Headline: "SO YOU WANT TO OWN A"
    line1 = "SO YOU WANT TO OWN A"
    bbox1 = draw.textbbox((0, 0), line1, font=title_font)
    w1 = bbox1[2] - bbox1[0]
    draw.text(((width - w1) // 2, 45), line1, font=title_font, fill="#111827")

    # Headline Line 2: "BANGALORE CAFÉ?" (with "BANGALORE" in red)
    prefix = "BANGALORE "
    suffix = "CAFÉ?"
    b_pre = draw.textbbox((0, 0), prefix, font=title_font)
    b_suf = draw.textbbox((0, 0), suffix, font=title_font)
    w_pre = b_pre[2] - b_pre[0]
    w_suf = b_suf[2] - b_suf[0]
    total_w2 = w_pre + w_suf
    start_x2 = (width - total_w2) // 2
    
    draw.text((start_x2, 135), prefix, font=title_font, fill="#DC2626")
    draw.text((start_x2 + w_pre, 135), suffix, font=title_font, fill="#111827")

    # Red Marker Underline Bar
    underline_y = 235
    draw.line([(start_x2 - 30, underline_y), (start_x2 + total_w2 + 30, underline_y)], fill="#DC2626", width=8)

    # 3. Blend 2.5D Isometric Building Illustration
    if os.path.exists(CAFE_ILLUST):
        raw_cutaway = Image.open(CAFE_ILLUST).convert("RGBA")
        
        # Multiply blend onto cream background so white paper becomes cream grid
        target_size = (780, 780)
        cutaway_resized = raw_cutaway.resize(target_size, Image.Resampling.LANCZOS)
        
        # Convert near-white background pixels to transparent with soft feather
        cutaway_rgba = cutaway_resized.copy()
        datas = cutaway_rgba.getdata()
        new_data = []
        for item in datas:
            # item is (r, g, b, a)
            # if pixel is close to white (>245 in all channels)
            avg = (item[0] + item[1] + item[2]) / 3.0
            if avg > 248:
                new_data.append((item[0], item[1], item[2], 0))
            elif avg > 235:
                alpha = int(255 * (1.0 - (avg - 235) / 13.0))
                new_data.append((item[0], item[1], item[2], alpha))
            else:
                new_data.append((item[0], item[1], item[2], 255))
        cutaway_rgba.putdata(new_data)
        
        # Position cutaway in the center lower quadrant
        paste_x = (width - target_size[0]) // 2
        paste_y = 250
        im.paste(cutaway_rgba, (paste_x, paste_y), cutaway_rgba)
    
    # 4. Helper for Hand-Drawn style Curved Arrows and Callout Blocks
    draw = ImageDraw.Draw(im)

    def draw_curved_arrow(start, end, control, color="#111827", width_val=3):
        # Draw quadratic bezier curve
        points = []
        steps = 30
        for i in range(steps + 1):
            t = i / steps
            # B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
            x = (1 - t)**2 * start[0] + 2 * (1 - t) * t * control[0] + t**2 * end[0]
            y = (1 - t)**2 * start[1] + 2 * (1 - t) * t * control[1] + t**2 * end[1]
            points.append((x, y))
        for j in range(len(points) - 1):
            draw.line([points[j], points[j+1]], fill=color, width=width_val)
        
        # Arrowhead at end
        # Tangent vector at t=1: 2(end - control)
        dx = end[0] - control[0]
        dy = end[1] - control[1]
        angle = math.atan2(dy, dx)
        head_len = 16
        head_angle = math.pi / 6
        p1 = (end[0] - head_len * math.cos(angle - head_angle), end[1] - head_len * math.sin(angle - head_angle))
        p2 = (end[0] - head_len * math.cos(angle + head_angle), end[1] - head_len * math.sin(angle + head_angle))
        draw.polygon([end, p1, p2], fill=color)

    def draw_callout_box(tx, ty, header, detail, arrow_start, arrow_target, arrow_control, header_color="#DC2626"):
        # Header text
        draw.text((tx, ty), header, font=callout_bold, fill=header_color)
        draw.text((tx, ty + 34), detail, font=callout_sub, fill="#374151")
        # Draw curved arrow pointing from text to visual cutaway target
        draw_curved_arrow(arrow_start, arrow_target, arrow_control, color="#111827", width_val=3)

    cx = 960
    cy = 640

    # Callout 1 (Top Left): Indiranagar 100ft Road Rent
    draw_callout_box(
        tx=100, ty=300,
        header="INDIRANAGAR LEASE",
        detail="₹4,50,000 / mo (Fixed)",
        arrow_start=(420, 320),
        arrow_target=(cx - 240, cy - 240),
        arrow_control=(580, 310),
        header_color="#DC2626"
    )

    # Callout 2 (Mid Left): Capex / La Marzocco
    draw_callout_box(
        tx=80, ty=530,
        header="₹1.5 CR FITOUT CAPEX",
        detail="La Marzocco + Microcement",
        arrow_start=(450, 550),
        arrow_target=(cx - 280, cy - 20),
        arrow_control=(580, 560),
        header_color="#DC2626"
    )

    # Callout 3 (Bottom Left): The Laptop Squatter
    draw_callout_box(
        tx=100, ty=760,
        header="65% LAPTOP SQUATTERS",
        detail="5 Hours on one ₹220 Cold Brew",
        arrow_start=(480, 780),
        arrow_target=(cx - 180, cy + 180),
        arrow_control=(620, 820),
        header_color="#B45309"
    )

    # Callout 4 (Top Right): Power / Genset
    draw_callout_box(
        tx=1380, ty=300,
        header="BESCOM + DIESEL GENSET",
        detail="₹1,80,000 / mo for 8 Split ACs",
        arrow_start=(1360, 320),
        arrow_target=(cx + 240, cy - 220),
        arrow_control=(1220, 310),
        header_color="#111827"
    )

    # Callout 5 (Mid Right): Table Turnover Collapse
    draw_callout_box(
        tx=1380, ty=530,
        header="TURNOVER: 0.8X / DAY",
        detail="Normal Restaurant: 4.5X",
        arrow_start=(1360, 550),
        arrow_target=(cx + 280, cy + 20),
        arrow_control=(1220, 560),
        header_color="#DC2626"
    )

    # Callout 6 (Bottom Right): True Payback Period
    draw_callout_box(
        tx=1380, ty=760,
        header="TRUE PAYBACK PERIOD",
        detail="76 Months (If Survived)",
        arrow_start=(1360, 780),
        arrow_target=(cx + 200, cy + 200),
        arrow_control=(1220, 820),
        header_color="#047857"
    )

    # 5. Editorial Stamp Badge on Bottom Center
    badge_w, badge_h = 440, 70
    bx = (width - badge_w) // 2
    by = height - 100
    draw.rectangle([bx, by, bx + badge_w, by + badge_h], fill="#111827")
    stamp_font = ImageFont.truetype(font_heavy, 24)
    draw.text((bx + badge_w // 2, by + badge_h // 2), "NOT A STARTUP · FORENSIC P&L", font=stamp_font, fill="#FCD34D", anchor="mm")

    # 6. Save
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    os.makedirs(os.path.dirname(PUBLIC_EP01), exist_ok=True)
    im.save(OUT_PATH, "PNG")
    im.save(PUBLIC_EP01, "PNG")
    im.save(PUBLIC_EP05, "PNG")
    print(f"✓ Master Blueprint Thumbnail rendered successfully:")
    print(f"  Artifact: {OUT_PATH}")
    print(f"  Public Ep01: {PUBLIC_EP01}")
    print(f"  Public Ep05: {PUBLIC_EP05}")

if __name__ == "__main__":
    make_thumbnail()
