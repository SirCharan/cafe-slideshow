# 🎨 SOP 02: Infographic Blueprint Thumbnail Engine
**Standard**: Mr. Economics High-CTR Infographic Blueprint  
**Tooling**: Python 3 + Pillow + Bezier Math Engine (`scripts/generate_all_blueprint_thumbnails.py`)  

---

## 1. Specification Checklist

Every thumbnail created in the studio must pass the following 7 gates:
1. **Canvas**: Exactly 1920x1080 resolution, `#FAF8F5` cream graph paper grid (40px step, `#E2DDD5` 1px lines at 60% opacity).
2. **Top Headline**:
   - Line 1: `SO YOU WANT TO OWN A` (Arial Black / Futura Heavy, 76pt, `#111827`)
   - Line 2: `[LOCATION/PREFIX] ` (`#111827`) + `[TARGET BUSINESS]?` in Crimson (`#DC2626`).
   - Red marker underline bar (8px stroke, `#DC2626`) spanning the entire width of Line 2.
3. **Hero Illustration**: 
   - 2.5D Isometric Architectural Cutaway / Cross-section or hand-inked comic prop centered at `cx=960, cy=630`.
   - Multiply-blended onto the cream paper texture (near-white pixels feathered to alpha so grid shows through).
4. **Curiosity Callouts (6 Total)**:
   - 3 Left Callouts (Top-Left, Mid-Left, Bottom-Left).
   - 3 Right Callouts (Top-Right, Mid-Right, Bottom-Right).
   - Format: Bold Headline (26pt `#DC2626` or `#111827`) + Context Detail (22pt `#374151`).
   - **Curiosity Rule**: Must point to hidden leaks (*"₹4.5L/mo Master Lease"*, *"Water Tanker Extortion"*). NEVER spoil the final net profit on the thumbnail.
5. **Hand-Drawn Bezier Arrows**:
   - Smooth quadratic bezier curves connecting each callout box to its visual target inside the cutaway.
   - Clean solid arrowhead pointing into the building department.
6. **Editorial Stamp Badge**:
   - Centered at the bottom (`bx=740, by=990, width=440, height=60`).
   - Dark pill (`#111827`) with gold lettering (`#FCD34D`): `NOT A STARTUP · [EPISODE] FORENSIC P&L`.
7. **Mobile Contrast & Scalability Gate**:
   - Full-res Luminance Standard Deviation must exceed **35.0** (Target: > 60.0).
   - Mobile thumbnail downscaled to 320x180 must maintain high legibility in dark-mode YouTube feed.

---

## 2. CLI Execution Instructions

To regenerate all thumbnails across the catalog:
```bash
python3 scripts/generate_all_blueprint_thumbnails.py
```

To generate a custom new episode blueprint thumbnail:
```bash
python3 scripts/make_blueprint_thumbnail.py
```

Outputs are automatically saved to:
- `public/thumbnails/ep01_blueprint_cafe.png`
- `public/thumbnails/ep02_blueprint_pg.png`
- `public/thumbnails/ep03_blueprint_cloud_kitchen.png`
- `public/thumbnails/ep04_blueprint_founder_house.png`
- `public/thumbnails/ep05_blueprint_cafe.png`
- `public/thumbnails/ep06_blueprint_real_estate.png`
- `public/thumbnails/cultfit_blueprint_thumb.png`
