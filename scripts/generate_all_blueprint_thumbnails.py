#!/usr/bin/env python3
"""
Studio Creative Suite: Generate All Blueprint Thumbnails
Adheres to Mr. Economics Infographic Blueprint Architecture:
- Canvas: #FAF8F5 Cream Graph Paper Grid (1920x1080)
- Top Challenge Title: "SO YOU WANT TO OWN A [BUSINESS]?"
- Hero: 2.5D Isometric Architectural Cutaway / Metaphor
- 6 Hand-Drawn Curved Bezier Arrows pointing to hidden operational leaks
- Contrast & Scalability compliance: std dev > 35.0
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "/Users/ck/claude/cafe-slideshow/public/thumbnails"
os.makedirs(OUT_DIR, exist_ok=True)

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

def build_base_canvas():
    width, height = 1920, 1080
    im = Image.new("RGBA", (width, height), (250, 248, 245, 255)) # Cream graph paper
    draw = ImageDraw.Draw(im)
    grid_size = 40
    for x in range(0, width, grid_size):
        draw.line([(x, 0), (x, height)], fill=(226, 220, 212, 160), width=1)
    for y in range(0, height, grid_size):
        draw.line([(0, y), (width, y)], fill=(226, 220, 212, 160), width=1)
    return im, draw

def render_thumbnail(config):
    im, draw = build_base_canvas()
    width, height = 1920, 1080

    # 1. Headline
    line1 = "SO YOU WANT TO OWN A"
    bbox1 = draw.textbbox((0, 0), line1, font=title_font)
    w1 = bbox1[2] - bbox1[0]
    draw.text(((width - w1) // 2, 45), line1, font=title_font, fill="#111827")

    prefix = config["title_prefix"]
    target = config["title_target"]
    b_pre = draw.textbbox((0, 0), prefix, font=title_font)
    b_tar = draw.textbbox((0, 0), target, font=title_font)
    w_pre = b_pre[2] - b_pre[0]
    w_tar = b_tar[2] - b_tar[0]
    total_w2 = w_pre + w_tar
    start_x2 = (width - total_w2) // 2

    draw.text((start_x2, 135), prefix, font=title_font, fill="#111827")
    draw.text((start_x2 + w_pre, 135), target, font=title_font, fill="#DC2626")

    # Red Underline Bar
    underline_y = 235
    draw.line([(start_x2 - 30, underline_y), (start_x2 + total_w2 + 30, underline_y)], fill="#DC2626", width=8)

    # 2. Hero Cutaway Graphic
    cx, cy = 960, 630
    if "hero_image" in config and os.path.exists(config["hero_image"]):
        raw_cutaway = Image.open(config["hero_image"]).convert("RGBA")
        target_size = (780, 780)
        cutaway_resized = raw_cutaway.resize(target_size, Image.Resampling.LANCZOS)
        # soft feather white to cream
        datas = cutaway_resized.getdata()
        new_data = []
        for item in datas:
            avg = (item[0] + item[1] + item[2]) / 3.0
            if avg > 248:
                new_data.append((item[0], item[1], item[2], 0))
            elif avg > 235:
                alpha = int(255 * (1.0 - (avg - 235) / 13.0))
                new_data.append((item[0], item[1], item[2], alpha))
            else:
                new_data.append((item[0], item[1], item[2], 255))
        cutaway_resized.putdata(new_data)
        paste_x = (width - target_size[0]) // 2
        paste_y = 250
        im.paste(cutaway_resized, (paste_x, paste_y), cutaway_resized)
        draw = ImageDraw.Draw(im)
    else:
        # Procedural Blueprint Schematic
        config["procedural_hero"](draw, cx, cy)

    # 3. Callout Boxes & Bezier Arrows
    for c in config["callouts"]:
        # Header + Subtext
        draw.text((c["tx"], c["ty"]), c["header"], font=callout_bold, fill=c.get("header_color", "#DC2626"))
        draw.text((c["tx"], c["ty"] + 32), c["detail"], font=callout_sub, fill="#374151")
        # Curved Arrow
        draw_bezier_arrow(draw, c["start"], c["end"], c["control"], color="#111827", width=3)

    # 4. Stamp Badge
    badge_w, badge_h = 420, 60
    bx = (width - badge_w) // 2
    by = height - 90
    draw.rectangle([bx, by, bx + badge_w, by + badge_h], fill="#111827")
    draw.text((bx + badge_w // 2, by + badge_h // 2), config["stamp_text"], font=stamp_font, fill="#FCD34D", anchor="mm")

    # 5. Save
    im.save(config["out_file"], "PNG")
    print(f"✓ Generated: {config['out_file']}")

# Helper Procedural Heroes for Episodes without standalone AI art yet:
def draw_pg_hero(draw, cx, cy):
    # 5-Story Concrete Matchbox PG Building Cutaway
    draw.polygon([(cx - 240, cy + 220), (cx + 240, cy + 220), (cx + 240, cy - 240), (cx - 240, cy - 240)], fill="#E2E8F0", outline="#1E293B", width=4)
    # Floor dividers
    for floor_y in [cy - 140, cy - 40, cy + 60, cy + 160]:
        draw.line([(cx - 240, floor_y), (cx + 240, floor_y)], fill="#94A3B8", width=2)
    # Water Tanker on Roof
    draw.rectangle([cx - 80, cy - 300, cx + 80, cy - 240], fill="#38BDF8", outline="#0284C7", width=3)
    draw.text((cx, cy - 270), "WATER TANKER MAFIA", font=callout_sub, fill="#0F172A", anchor="mm")
    # Tiny Bunk Beds inside floors
    for fy in [cy - 100, cy, cy + 100]:
        for fx in [cx - 160, cx + 40]:
            draw.rectangle([fx, fy - 20, fx + 100, fy + 40], fill="#FDE68A", outline="#B45309", width=2)
            draw.text((fx + 50, fy + 10), "4-BUNK", font=callout_sub, fill="#78350F", anchor="mm")

def draw_cloud_kitchen_hero(draw, cx, cy):
    # Back-alley Commercial Kitchen Cross-section
    draw.polygon([(cx - 280, cy + 200), (cx + 280, cy + 200), (cx + 280, cy - 200), (cx - 280, cy - 200)], fill="#F1F5F9", outline="#0F172A", width=4)
    # Commercial Hood & Exhaust Ducts
    draw.rectangle([cx - 200, cy - 180, cx + 200, cy - 120], fill="#64748B", outline="#334155", width=3)
    # Industrial Stove & Giant Biryani Degs
    for dx in [cx - 150, cx - 30, cx + 90]:
        draw.ellipse([dx, cy + 20, dx + 70, cy + 90], fill="#D97706", outline="#78350F", width=3)
    # Delivery Rider Pickup Window
    draw.rectangle([cx + 160, cy + 40, cx + 260, cy + 180], fill="#FEF08A", outline="#CA8A04", width=3)
    draw.text((cx + 210, cy + 110), "SWIGGY\nWINDOW", font=callout_sub, fill="#78350F", anchor="mm")

def draw_founder_house_hero(draw, cx, cy):
    # 8-BHK HSR Layout Luxury Villa Cutaway
    draw.polygon([(cx - 300, cy + 200), (cx + 300, cy + 200), (cx + 300, cy - 180), (cx - 300, cy - 180)], fill="#FAF5FF", outline="#581C87", width=4)
    # Pitched roof
    draw.polygon([(cx - 320, cy - 180), (cx, cy - 300), (cx + 320, cy - 180)], fill="#A855F7", outline="#581C87", width=4)
    draw.text((cx, cy - 240), "HSR HACKER MANSION", font=callout_bold, fill="#FFFFFF", anchor="mm")
    # Living Room Pitch Deck Whiteboard
    draw.rectangle([cx - 140, cy - 120, cx + 140, cy - 20], fill="#FFFFFF", outline="#7E22CE", width=3)
    draw.text((cx, cy - 70), "PEAK XV\nPITCH DECK", font=callout_sub, fill="#4C1D95", anchor="mm")
    # Dorm Bunks
    draw.rectangle([cx - 240, cy + 60, cx - 80, cy + 160], fill="#E9D5FF", outline="#7E22CE", width=2)
    draw.text((cx - 160, cy + 110), "₹35K / BED", font=callout_bold, fill="#581C87", anchor="mm")

def draw_real_estate_hero(draw, cx, cy):
    # 42-Story Sarjapur Mud Tower vs Construction Crane
    draw.polygon([(cx - 180, cy + 220), (cx + 180, cy + 220), (cx + 180, cy - 280), (cx - 180, cy - 280)], fill="#E0F2FE", outline="#0369A1", width=4)
    # Tower Floor Grids
    for y in range(cy - 240, cy + 200, 40):
        draw.line([(cx - 180, y), (cx + 180, y)], fill="#38BDF8", width=2)
    # Tower Sign
    draw.rectangle([cx - 160, cy - 320, cx + 160, cy - 280], fill="#0284C7")
    draw.text((cx, cy - 300), "PRE-LAUNCH TOWER 4", font=callout_sub, fill="#FFFFFF", anchor="mm")
    # Foundation Mud Pit
    draw.rectangle([cx - 240, cy + 220, cx + 240, cy + 270], fill="#78350F", outline="#451A03", width=3)
    draw.text((cx, cy + 245), "WATERLOGGED MUD PIT", font=callout_sub, fill="#FEF3C7", anchor="mm")

# MASTER CONFIGURATIONS
CONFIGS = [
    # Episode 02: Bangalore PG Hostel
    {
        "out_file": f"{OUT_DIR}/ep02_blueprint_pg.png",
        "title_prefix": "BANGALORE ",
        "title_target": "PG HOSTEL?",
        "procedural_hero": draw_pg_hero,
        "stamp_text": "NOT A STARTUP · PG HOSTEL FORENSIC P&L",
        "callouts": [
            {"tx": 100, "ty": 300, "header": "COMMERCIAL MASTER LEASE", "detail": "₹3.8L / mo (Guaranteed to landlord)", "start": (480, 320), "end": (960 - 240, 630 - 180), "control": (600, 310), "header_color": "#DC2626"},
            {"tx": 80, "ty": 530, "header": "WATER TANKER EXTORTION", "detail": "₹90,000 / mo in peak summer", "start": (460, 550), "end": (960 - 100, 630 - 260), "control": (620, 480), "header_color": "#DC2626"},
            {"tx": 100, "ty": 760, "header": "BESCOM TARIFF RATE", "detail": "Commercial Slab @ ₹12 / unit", "start": (450, 780), "end": (960 - 180, 630 + 100), "control": (620, 800), "header_color": "#B45309"},
            {"tx": 1380, "ty": 300, "header": "FOOD + MAID CHURN", "detail": "Cook leaves every 45 days", "start": (1360, 320), "end": (960 + 200, 630 - 80), "control": (1220, 310), "header_color": "#111827"},
            {"tx": 1380, "ty": 530, "header": "UNPAID DEPOSITS", "detail": "Tenants ghost with 1-mo dues", "start": (1360, 550), "end": (960 + 220, 630 + 40), "control": (1220, 560), "header_color": "#DC2626"},
            {"tx": 1380, "ty": 760, "header": "TRUE NET PROFIT", "detail": "₹55,000 / mo (11% margin)", "start": (1360, 780), "end": (960 + 160, 630 + 180), "control": (1220, 820), "header_color": "#047857"},
        ]
    },
    # Episode 03: Bangalore Cloud Kitchen
    {
        "out_file": f"{OUT_DIR}/ep03_blueprint_cloud_kitchen.png",
        "title_prefix": "A CLOUD ",
        "title_target": "KITCHEN?",
        "procedural_hero": draw_cloud_kitchen_hero,
        "stamp_text": "NOT A STARTUP · ₹350 BIRYANI ILLUSION",
        "callouts": [
            {"tx": 100, "ty": 300, "header": "SWIGGY/ZOMATO COMMISSION", "detail": "33% cut taken off top line", "start": (480, 320), "end": (960 - 240, 630 - 80), "control": (600, 310), "header_color": "#DC2626"},
            {"tx": 80, "ty": 530, "header": "AD BIDDING TREADMILL", "detail": "18% of revenue to rank on page 1", "start": (460, 550), "end": (960 - 200, 630 + 20), "control": (620, 560), "header_color": "#DC2626"},
            {"tx": 100, "ty": 760, "header": "PACKAGING & SPILLAGE", "detail": "₹28 leak per plastic tub", "start": (450, 780), "end": (960 - 120, 630 + 120), "control": (620, 800), "header_color": "#B45309"},
            {"tx": 1380, "ty": 300, "header": "DISCOUNT MATCHING", "detail": "Forced 40% OFF coupons", "start": (1360, 320), "end": (960 + 200, 630 - 60), "control": (1220, 310), "header_color": "#111827"},
            {"tx": 1380, "ty": 530, "header": "REPEAT CUSTOMER: 0%", "detail": "Customer belongs to aggregator", "start": (1360, 550), "end": (960 + 220, 630 + 60), "control": (1220, 560), "header_color": "#DC2626"},
            {"tx": 1380, "ty": 760, "header": "TRUE MARGIN PER BIRYANI", "detail": "₹11 profit on a ₹350 order (3.1%)", "start": (1360, 780), "end": (960 + 160, 630 + 160), "control": (1220, 820), "header_color": "#047857"},
        ]
    },
    # Episode 04: Bangalore Founder House
    {
        "out_file": f"{OUT_DIR}/ep04_blueprint_founder_house.png",
        "title_prefix": "A FOUNDER ",
        "title_target": "MANSION?",
        "procedural_hero": draw_founder_house_hero,
        "stamp_text": "NOT A STARTUP · HSR HACKER HOUSE REALITY",
        "callouts": [
            {"tx": 100, "ty": 300, "header": "8-BHK MASTER LEASE", "detail": "₹2,60,000 / mo in HSR Sector 4", "start": (480, 320), "end": (960 - 240, 630 - 100), "control": (600, 310), "header_color": "#DC2626"},
            {"tx": 80, "ty": 530, "header": "DUAL LEASED LINE", "detail": "ACT + Airtel commercial fiber", "start": (460, 550), "end": (960 - 220, 630 + 20), "control": (620, 560), "header_color": "#DC2626"},
            {"tx": 100, "ty": 760, "header": "EVICTION THREAT", "detail": "RWA bans commercial hostel use", "start": (450, 780), "end": (960 - 160, 630 + 140), "control": (620, 800), "header_color": "#B45309"},
            {"tx": 1380, "ty": 300, "header": "3 MEALS + FULL COOK", "detail": "High-protein meal requirement", "start": (1360, 320), "end": (960 + 220, 630 - 60), "control": (1220, 310), "header_color": "#111827"},
            {"tx": 1380, "ty": 530, "header": "MIDNIGHT DEPARTURES", "detail": "Runway dies ➔ founder vanishes", "start": (1360, 550), "end": (960 + 240, 630 + 40), "control": (1220, 560), "header_color": "#DC2626"},
            {"tx": 1380, "ty": 760, "header": "OPERATOR PROFIT", "detail": "₹70,000 / mo for 24/7 drama", "start": (1360, 780), "end": (960 + 180, 630 + 160), "control": (1220, 820), "header_color": "#047857"},
        ]
    },
    # Episode 06: Sarjapur Real Estate Tower
    {
        "out_file": f"{OUT_DIR}/ep06_blueprint_real_estate.png",
        "title_prefix": "PRE-LAUNCH ",
        "title_target": "REAL ESTATE?",
        "procedural_hero": draw_real_estate_hero,
        "stamp_text": "NOT A STARTUP · SARJAPUR PRE-LAUNCH TRAP",
        "callouts": [
            {"tx": 100, "ty": 300, "header": "PRE-EMI INTEREST", "detail": "₹65,000 / mo while still renting", "start": (480, 320), "end": (960 - 160, 630 - 180), "control": (600, 310), "header_color": "#DC2626"},
            {"tx": 80, "ty": 530, "header": "RERA GRACE PERIOD", "detail": "Developer takes legal +2 yr buffer", "start": (460, 550), "end": (960 - 160, 630 + 20), "control": (620, 560), "header_color": "#DC2626"},
            {"tx": 100, "ty": 760, "header": "CARPET AREA LOSS", "detail": "34% lost to super-built-up loading", "start": (450, 780), "end": (960 - 140, 630 + 160), "control": (620, 800), "header_color": "#B45309"},
            {"tx": 1380, "ty": 300, "header": "SARJAPUR WATER LOG", "detail": "No Cauvery water connection", "start": (1360, 320), "end": (960 + 160, 630 - 140), "control": (1220, 310), "header_color": "#111827"},
            {"tx": 1380, "ty": 530, "header": "42-STORY LIFT JAM", "detail": "12-minute wait for morning lift", "start": (1360, 550), "end": (960 + 160, 630 + 40), "control": (1220, 560), "header_color": "#DC2626"},
            {"tx": 1380, "ty": 760, "header": "REAL ANNUALIZED IRR", "detail": "6.2% post-tax (Below FD)", "start": (1360, 780), "end": (960 + 140, 630 + 180), "control": (1220, 820), "header_color": "#047857"},
        ]
    }
]

if __name__ == "__main__":
    for cfg in CONFIGS:
        render_thumbnail(cfg)
    print("✓ All studio blueprint thumbnails successfully rendered!")
