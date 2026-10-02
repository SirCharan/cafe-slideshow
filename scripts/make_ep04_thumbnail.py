#!/usr/bin/env python3
"""
Composite high-CTR typography onto the generated thumbnail background for Episode 04.
Output: 1920x1080 master thumbnail ready for YouTube.
"""

import os
from PIL import Image, ImageDraw, ImageFont

SRC_IMG = "/Users/ck/.gemini/antigravity/brain/6567f7d7-6f21-4175-85d5-cb6f3a0a2638/ep04_founder_house_thumb_1790931008893.jpg"
OUT_IMG = "/Users/ck/.gemini/antigravity/brain/6567f7d7-6f21-4175-85d5-cb6f3a0a2638/ep04_final_thumbnail.png"
PUBLIC_OUT = "/Users/ck/claude/cafe-slideshow/public/thumbnails/ep04_founder_house.png"

os.makedirs(os.path.dirname(PUBLIC_OUT), exist_ok=True)

def main():
    img = Image.open(SRC_IMG).convert("RGBA")
    img = img.resize((1920, 1080), Image.Resampling.LANCZOS)

    # Completely cover the right 50% with dark cinematic tone to wipe out background AI text
    vignette = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(920, 1920):
        # Progress from 0 to 255 (fully opaque after x=1040)
        progress = (x - 920) / 120.0
        alpha = min(255, int(progress * 255))
        v_draw.line([(x, 0), (x, 1080)], fill=(11, 14, 20, alpha))

    img = Image.alpha_composite(img, vignette)
    draw = ImageDraw.Draw(img)

    font_impact = "/System/Library/Fonts/Supplemental/Impact.ttf"
    font_arial_black = "/System/Library/Fonts/Supplemental/Arial Black.ttf"
    font_large = ImageFont.truetype(font_impact, 134)
    font_badge = ImageFont.truetype(font_arial_black, 42)

    tx = 1060
    ty = 190

    def draw_text_with_stroke(x, y, text, font, fill_color, stroke_color, stroke_w=8):
        for dx in range(-stroke_w, stroke_w + 1):
            for dy in range(-stroke_w, stroke_w + 1):
                if dx*dx + dy*dy <= stroke_w*stroke_w:
                    draw.text((x + dx, y + dy + 7), text, font=font, fill="#000000")
        for dx in range(-stroke_w, stroke_w + 1):
            for dy in range(-stroke_w, stroke_w + 1):
                if dx*dx + dy*dy <= stroke_w*stroke_w:
                    draw.text((x + dx, y + dy), text, font=font, fill=stroke_color)
        draw.text((x, y), text, font=font, fill=fill_color)

    # Line 1: THE ₹35,000 or THE 35K BED
    draw_text_with_stroke(tx, ty, "THE 35,000", font_large, "#FFE600", "#000000", stroke_w=9)

    # Line 2: FOUNDER HOUSE
    draw_text_with_stroke(tx, ty + 145, "FOUNDER HOUSE", font_large, "#FFFFFF", "#000000", stroke_w=9)

    # Line 3: TRAP
    draw_text_with_stroke(tx, ty + 290, "TRAP", font_large, "#FF3B30", "#000000", stroke_w=9)

    # Badge 1: [ 2 BEDS FROM RUIN ]
    badge_y = ty + 460
    badge_text = "2 BEDS FROM RUIN"
    bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]

    draw.rectangle([tx - 4, badge_y - 4 + 6, tx + bw + 44, badge_y + bh + 24 + 6], fill=(0, 0, 0, 160))
    draw.rectangle([tx, badge_y, tx + bw + 40, badge_y + bh + 20], fill="#E74C3C")
    draw.rectangle([tx, badge_y, tx + bw + 40, badge_y + bh + 20], outline="#FFFFFF", width=3)
    draw.text((tx + 20, badge_y + 8), badge_text, font=font_badge, fill="#FFFFFF")

    # Badge 2: [ 4.9L GROSS -> 70K PROFIT ]
    pill_y = badge_y + bh + 45
    pill_text = "4.9L GROSS  ->  70K PROFIT"
    pbox = draw.textbbox((0, 0), pill_text, font=font_badge)
    pw = pbox[2] - pbox[0]
    ph = pbox[3] - pbox[1]

    draw.rectangle([tx - 4, pill_y - 4 + 6, tx + pw + 44, pill_y + ph + 24 + 6], fill=(0, 0, 0, 160))
    draw.rectangle([tx, pill_y, tx + pw + 40, pill_y + ph + 20], fill="#2ECC71")
    draw.rectangle([tx, pill_y, tx + pw + 40, pill_y + ph + 20], outline="#FFFFFF", width=3)
    draw.text((tx + 20, pill_y + 8), pill_text, font=font_badge, fill="#0B0E14")

    # Save outputs
    final_rgb = img.convert("RGB")
    final_rgb.save(OUT_IMG, "PNG", quality=95)
    final_rgb.save(PUBLIC_OUT, "PNG", quality=95)
    print(f"✓ Saved master Episode 04 thumbnail: {OUT_IMG}")
    print(f"✓ Saved to public dir: {PUBLIC_OUT}")

if __name__ == "__main__":
    main()
