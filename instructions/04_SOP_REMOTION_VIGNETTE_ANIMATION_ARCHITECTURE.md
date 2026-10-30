# 🎬 SOP 04: Remotion Vignette & Motion Graphics Architecture
**Standard**: Editorial Hand-Inked Comic Vignettes + Physical Metaphors  
**Framework**: Remotion (React + TypeScript)  
**Resolution**: 1920x1080 @ 30fps  

---

## 1. Core Principles (Learned from Mr. Economics)

1. **Zero Frozen Slides**:
   - Every single scene must have continuous subtle camera drift (Ken Burns effect) using `interpolate(frame, [0, sceneDuration], [1.00, 1.06], { easing: Easing.bezier(...) })`.
2. **Physical Metaphors Over Boring Tables**:
   - Instead of a text bullet list of expenses, build animated physical metaphors:
     - **The Conveyor Belt**: Carries products (pastries, oat milk, biryani tubs) directly into a green trash dumpster labeled `100% LOSS (24-HR EXPIRY)`.
     - **The Whiteboard Gear System**: 100 customer currency bills enter on the left; giant rotating mechanical gears crush them into landlord rent, power bills, and payroll, leaving a tiny trickle of coins in the profit box.
     - **The Ticking Clock**: Digital wall clock spinning forward rapidly to visualize laptop squatters wasting table hours.
3. **The Recurring Anurag Mascot**:
   - Integrated into the corner or interacting with on-screen props: holding a magnifying glass to inspect bills, tapping a chalkboard with a clipboard, or holding up a forensic P&L sheet.
4. **Scene Pacing & Asset Density**:
   - Scene cut or asset transition every **3 to 5 seconds** to maximize Average View Duration (AVD).

---

## 2. Remotion Directory Structure
```
remotion/
├── Root.tsx                      # Master composition index
├── compositions/
│   ├── BangaloreCafeMaster.tsx    # 12-scene flagship cafe composition
│   ├── CultfitFranchiseMaster.tsx # 12-scene Cult.fit franchise composition
│   └── PgHostelMaster.tsx         # Bangalore PG empire composition
├── scenes/
│   ├── vignettes/                # Hand-inked comic backdrops
│   ├── characters/               # Anurag Mascot with expressions
│   └── mechanisms/               # Conveyor belts, gears, whiteboards
└── components/
    ├── KineticSubtitles.tsx      # Word-by-word synced glowing captions
    ├── BezierCallout.tsx         # Dynamic curved arrows
    └── ForensicTable.tsx         # Financial balance sheet overlay
```
