#!/usr/bin/env python3
"""
Generate data/cultfit_scenes.json for Remotion CultfitFranchiseMaster composition.
Combines exact audio timing from data/cultfit_timing.json with rich visual metadata:
- Badges & Colors
- Titles & Subtitles
- Kinetic Highlight Keywords
- Financial Metrics & Infographic overlays
"""

import json
from pathlib import Path

ROOT = Path("/Users/ck/claude/cafe-slideshow")
TIMING_FILE = ROOT / "data" / "cultfit_timing.json"
OUT_FILE = ROOT / "data" / "cultfit_scenes.json"

with open(TIMING_FILE, "r") as f:
    timing = json.load(f)["scenes"]

METADATA = [
    {
        "id": "scene_01",
        "name": "The Cult Tech Dream",
        "part": "ACT 1 · THE TECH CONCERT GYM",
        "isPartStart": True,
        "partTitle": "THE TECH CONCERT GYM",
        "partSub": "Dark rooms, neon rigs, and the 7:00 PM Bangalore rush",
        "env": "cult_neon_studio",
        "characterSide": "left",
        "lines_meta": [
            {
                "badge": "7:00 PM BANGALORE RUSH",
                "badgeColor": "#06B6D4",
                "title": "THE NEON FITNESS TEMPLE",
                "subtitle": "House beats, synchronized movements, and Bangalore techies",
                "highlights": ["Bangalore", "techies", "neon", "lighting", "house", "beats"]
            },
            {
                "badge": "THE FORENSIC DECODE",
                "badgeColor": "#DC2626",
                "title": "NOT A STARTUP EXCLUSIVE",
                "subtitle": "My name is Anurag Bansal, let's decode the ₹2.2 Crore balance sheet",
                "highlights": ["gym", "concert", "Anurag", "Bansal", "Not", "Startup"]
            }
        ]
    },
    {
        "id": "scene_02",
        "name": "The Seduction",
        "part": "ACT 1 · THE TECH CONCERT GYM",
        "env": "cult_gamified_app",
        "characterSide": "right",
        "lines_meta": [
            {
                "badge": "THE APP ECOSYSTEM",
                "badgeColor": "#3B82F6",
                "title": "GAMIFIED FITNESS REVOLUTION",
                "subtitle": "No rusty barbells—just app streaks, energy meters, and brand halo",
                "highlights": ["Cult.fit", "revolutionized", "gamified", "app", "synchronized"]
            },
            {
                "badge": "FRANCHISE PITCH DECK",
                "badgeColor": "#10B981",
                "title": "THE ₹2 CRORE PROMISE",
                "subtitle": "Franchise pitch deck promises predictable automated cash flow",
                "highlights": ["investor", "two", "crores", "franchise", "money", "machine"]
            }
        ]
    },
    {
        "id": "scene_03",
        "name": "The Seductive Math",
        "part": "ACT 1 · THE TECH CONCERT GYM",
        "env": "cult_revenue_dashboard",
        "characterSide": "left",
        "lines_meta": [
            {
                "badge": "UNIT ECONOMICS HOOK",
                "badgeColor": "#F59E0B",
                "title": "TOP-LINE SUBSCRIPTION MATH",
                "subtitle": "4,500 sq ft · 450 active members · ₹1,800 monthly realization",
                "highlights": ["4,500", "square-foot", "450", "subscribers", "₹1,800"]
            },
            {
                "badge": "GROSS CASH INFLOW",
                "badgeColor": "#10B981",
                "title": "₹8.1 LAKHS MONTHLY REVENUE",
                "subtitle": "Automated recurring UPI collections hitting the bank every month",
                "highlights": ["eight", "lakh", "rupees", "automated", "subscription", "cash"]
            }
        ]
    },
    {
        "id": "scene_04",
        "name": "The Upfront Fitout",
        "part": "ACT 2 · THE ₹2.2 CRORE SUNK COST",
        "isPartStart": True,
        "partTitle": "THE ₹2.2 CRORE SUNK COST",
        "partSub": "Acoustic flooring, neon lighting rigs, and non-refundable fees",
        "env": "cult_construction_site",
        "characterSide": "right",
        "lines_meta": [
            {
                "badge": "CAPEX SHOCK",
                "badgeColor": "#EF4444",
                "title": "DAY ZERO CAPITAL DRAIN",
                "subtitle": "Before a single sneaker laces up, your bank account enters ICU",
                "highlights": ["member", "sneakers", "bank", "account", "massive", "hit"]
            },
            {
                "badge": "FITOUT INVOICE",
                "badgeColor": "#DC2626",
                "title": "₹1.05 CRORES UPFRONT FITOUT",
                "subtitle": "₹20L franchise fee + ₹85L acoustic flooring, neon rigs, and luxury showers",
                "highlights": ["₹20", "Lakh", "non-refundable", "acoustic", "flooring", "₹85", "Lakhs"]
            }
        ]
    },
    {
        "id": "scene_05",
        "name": "The Equipment Capex",
        "part": "ACT 2 · THE ₹2.2 CRORE SUNK COST",
        "env": "cult_equipment_rig",
        "characterSide": "left",
        "lines_meta": [
            {
                "badge": "HARDWARE INVENTORY",
                "badgeColor": "#8B5CF6",
                "title": "₹55 LAKH HARDWARE ARSENAL",
                "subtitle": "Concept-2 rowers, assault bikes, urethane dumbbells, and custom rigs",
                "highlights": ["Concept-2", "assault", "bikes", "pull-up", "rigs", "₹55", "Lakhs"]
            },
            {
                "badge": "TOTAL SUNK CAPITAL",
                "badgeColor": "#DC2626",
                "title": "₹2.20 CRORES INVESTED",
                "subtitle": "Pre-op marketing, security deposit, and equipment before Day 1",
                "highlights": ["pre-operative", "security", "deposits", "₹2.2", "Crores", "day", "one"]
            }
        ]
    },
    {
        "id": "scene_06",
        "name": "The High Street Rent Trap",
        "part": "ACT 2 · THE ₹2.2 CRORE SUNK COST",
        "env": "cult_commercial_lease",
        "characterSide": "right",
        "lines_meta": [
            {
                "badge": "COMMERCIAL REAL ESTATE",
                "badgeColor": "#D97706",
                "title": "THE HIGH STREET REQUIREMENT",
                "subtitle": "No quiet basements: 4,500 sq ft floor plate on 100ft Road or HSR Layout",
                "highlights": ["4,500", "square-foot", "high-street", "Indiranagar", "HSR", "Layout"]
            },
            {
                "badge": "MONTHLY FIXED RENT",
                "badgeColor": "#EF4444",
                "title": "₹4,05,000 / MONTH LEASE",
                "subtitle": "₹90/sq ft locked rent due on the 1st of every month without fail",
                "highlights": ["₹90", "square", "foot", "₹4,05,000", "landlord", "first"]
            }
        ]
    },
    {
        "id": "scene_07",
        "name": "The Electricity Shock",
        "part": "ACT 3 · THE OPERATIONAL MEAT GRINDER",
        "isPartStart": True,
        "partTitle": "THE OPERATIONAL MEAT GRINDER",
        "partSub": "Commercial BESCOM tariffs, trainer wars, and Curefit platform royalty",
        "env": "cult_hvac_burn",
        "characterSide": "left",
        "lines_meta": [
            {
                "badge": "50-TON COMMERCIAL HVAC",
                "badgeColor": "#0284C7",
                "title": "THE COOLING ARMAGEDDON",
                "subtitle": "Cooling 40 sweaty techies during an HRX session 16 hours a day",
                "highlights": ["Cooling", "4,500", "forty", "sweaty", "50-ton", "HVAC"]
            },
            {
                "badge": "COMMERCIAL POWER BILL",
                "badgeColor": "#EF4444",
                "title": "₹1,40,000 / MONTH BESCOM",
                "subtitle": "Karnataka commercial tariff eats 17% of total monthly cash flow",
                "highlights": ["Karnataka", "commercial", "tariff", "bill", "crosses", "₹1,40,000"]
            }
        ]
    },
    {
        "id": "scene_08",
        "name": "The Trainer Talent War",
        "part": "ACT 3 · THE OPERATIONAL MEAT GRINDER",
        "env": "cult_trainer_stage",
        "characterSide": "right",
        "lines_meta": [
            {
                "badge": "TALENT DEPENDENCY",
                "badgeColor": "#EC4899",
                "title": "THE CHARISMATIC COACH TRAP",
                "subtitle": "Cult's secret weapon is charismatic trainers—and they don't come cheap",
                "highlights": ["secret", "weapon", "charismatic", "trainers", "cheap"]
            },
            {
                "badge": "PAYROLL & ATTRITION RISK",
                "badgeColor": "#DC2626",
                "title": "₹2,50,000 / MONTH PAYROLL",
                "subtitle": "4 Cult trainers + 2 coaches; if the lead coach quits, 20 members walk",
                "highlights": ["Four", "trainers", "₹2,50,000", "lead", "trainer", "twenty", "members"]
            }
        ]
    },
    {
        "id": "scene_09",
        "name": "The Brand Squeeze",
        "part": "ACT 3 · THE OPERATIONAL MEAT GRINDER",
        "env": "cult_platform_tax",
        "characterSide": "left",
        "lines_meta": [
            {
                "badge": "PLATFORM ROYALTY",
                "badgeColor": "#7C3AED",
                "title": "THE 12% CUREFIT TAX",
                "subtitle": "Cult.fit deducts 12% off top-line collections before you touch a rupee",
                "highlights": ["platform", "tax", "Cult.fit", "12%", "royalty", "collections"]
            },
            {
                "badge": "DISCOUNT PROMO SQUEEZE",
                "badgeColor": "#EF4444",
                "title": "PER-SESSION PAYOUT DILUTION",
                "subtitle": "Cult Pass Elite discount campaigns shrink your per-session payout",
                "highlights": ["promotional", "sales", "Cult", "Pass", "Elite", "costs", "locked"]
            }
        ]
    },
    {
        "id": "scene_10",
        "name": "The Annual Churn Collapse",
        "part": "ACT 4 · THE 60% CHURN & TRUE VERDICT",
        "isPartStart": True,
        "partTitle": "THE 60% CHURN & TRUE VERDICT",
        "partSub": "The January illusion versus the brutal April ghost town",
        "env": "cult_churn_graveyard",
        "characterSide": "right",
        "lines_meta": [
            {
                "badge": "CHURN METRICS",
                "badgeColor": "#DC2626",
                "title": "THE APRIL RESOLUTION CLIFF",
                "subtitle": "Packed in January, but 60% of members vanish completely by April",
                "highlights": ["January", "overflowing", "April", "sixty", "percent", "stopped"]
            },
            {
                "badge": "ALGORITHMIC PENALTY",
                "badgeColor": "#B91C1C",
                "title": "THE UTILIZATION PUNISHMENT",
                "subtitle": "Unlike traditional gyms, lower footfalls cause Curefit to deprioritize you",
                "highlights": ["traditional", "gym", "absentee", "utilization", "Curefit", "deprioritizing"]
            }
        ]
    },
    {
        "id": "scene_11",
        "name": "The True Net Profit",
        "part": "ACT 4 · THE 60% CHURN & TRUE VERDICT",
        "env": "cult_pl_ledger",
        "characterSide": "left",
        "lines_meta": [
            {
                "badge": "MONTHLY FORENSIC P&L",
                "badgeColor": "#D97706",
                "title": "₹1,35,000 TRUE NET PROFIT",
                "subtitle": "Subtract Rent (₹4.05L), BESCOM (₹1.4L), Payroll (₹2.5L), Royalty (₹97K)",
                "highlights": ["subtract", "rent", "electricity", "trainer", "net", "profit", "₹1,35,000"]
            },
            {
                "badge": "NET PROFIT MARGIN",
                "badgeColor": "#DC2626",
                "title": "A MEAGER 16% MARGIN",
                "subtitle": "Managing broken assault bikes, flooded showers, and member anxiety",
                "highlights": ["16%", "net", "margin", "broken", "assault", "bikes", "complaints"]
            }
        ]
    },
    {
        "id": "scene_12",
        "name": "The Final Payback Verdict",
        "part": "ACT 4 · THE 60% CHURN & TRUE VERDICT",
        "env": "cult_verdict_podium",
        "characterSide": "right",
        "lines_meta": [
            {
                "badge": "PAYBACK HORIZON",
                "badgeColor": "#EF4444",
                "title": "54-MONTH CAPITAL RECOVERY",
                "subtitle": "Four and a half years just to break even; senior debt beats the return",
                "highlights": ["fifty-four", "months", "four", "half", "years", "₹2.2", "Crores", "sleeping"]
            },
            {
                "badge": "THE FINAL VERDICT",
                "badgeColor": "#DC2626",
                "title": "WHO ACTUALLY WINS?",
                "subtitle": "You are not disrupting fitness—you are financing Curefit's real estate footprint",
                "highlights": ["Cult.fit", "consumer", "brand", "franchisee", "financing", "Curefit", "real", "estate"]
            }
        ]
    }
]

cultfit_scenes = []

for item in METADATA:
    s_id = item["id"]
    t_scene = timing[s_id]
    lines = []
    
    for l_idx, l_timing in enumerate(t_scene["lines"]):
        l_meta = item["lines_meta"][l_idx]
        lines.append({
            "idx": l_idx,
            "text": l_timing["text"],
            "pause_s": 0.45 if l_idx == 0 else 0.50,
            "durationSec": l_timing["duration_s"],
            "badge": l_meta["badge"],
            "badgeColor": l_meta["badgeColor"],
            "title": l_meta["title"],
            "subtitle": l_meta["subtitle"],
            "highlights": l_meta["highlights"]
        })

    cultfit_scenes.append({
        "id": s_id,
        "name": item["name"],
        "part": item["part"],
        "isPartStart": item.get("isPartStart", False),
        "partTitle": item.get("partTitle", ""),
        "partSub": item.get("partSub", ""),
        "env": item["env"],
        "characterSide": item["characterSide"],
        "durationSec": t_scene["total_duration_s"],
        "line0Dur": t_scene["lines"][0]["duration_s"],
        "line1Dur": t_scene["lines"][1]["duration_s"],
        "pause": 0.5,
        "lines": lines
    })

with open(OUT_FILE, "w") as f:
    json.dump(cultfit_scenes, f, indent=2)

print(f"✓ Generated {OUT_FILE} with {len(cultfit_scenes)} scenes.")
