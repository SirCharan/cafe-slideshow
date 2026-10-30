#!/usr/bin/env python3
"""
Generate data/cafe_v2_scenes.json for Remotion Composition
Combines timing data from data/cafe_v2_timing.json with rich narrative visual metadata.
"""

import json

TIMING_FILE = "/Users/ck/claude/cafe-slideshow/data/cafe_v2_timing.json"
OUT_FILE = "/Users/ck/claude/cafe-slideshow/data/cafe_v2_scenes.json"

with open(TIMING_FILE, "r") as f:
    timing = json.load(f)

scenes_meta = [
    {
        "id": "scene_01",
        "name": "The Indie Coffee Illusion",
        "part": "PART 1 · THE INDIE CAFE SEDUCTION",
        "isPartStart": True,
        "partTitle": "THE INDIE CAFE SEDUCTION",
        "partSub": "Sunlight, smooth jazz, and the myth of romantic hospitality",
        "env": "indiranagar_street",
        "characterSide": "left",
        "line0": {
            "badge": "INDIRANAGAR 100FT ROAD",
            "badgeColor": "#D97706",
            "title": "THE SUNLIT SPECIALTY OASIS",
            "subtitle": "Glass storefronts, smooth jazz, and Ethiopian roast aroma",
            "highlights": ["Indiranagar", "young", "techies", "sunlight", "Ethiopian", "beans"]
        },
        "line1": {
            "badge": "THE FORENSIC DECODE",
            "badgeColor": "#DC2626",
            "title": "NOT A STARTUP EXCLUSIVE",
            "subtitle": "My name is Anurag Bansal, and let's decode the real balance sheet",
            "highlights": ["peaceful", "romantic", "profitable", "Anurag", "Bansal"]
        }
    },
    {
        "id": "scene_02",
        "name": "The Pitch Deck Fantasy",
        "part": "PART 1 · THE INDIE CAFE SEDUCTION",
        "isPartStart": False,
        "env": "arithmetic_dream",
        "characterSide": "right",
        "line0": {
            "badge": "75% GROSS MARGIN",
            "badgeColor": "#059669",
            "title": "THE ARITHMETIC DREAM",
            "subtitle": "₹60 beans + ₹30 oat milk sold for ₹240 a cup",
            "highlights": ["arithmetic", "dream", "sixty", "rupees", "seventy-five", "margin"]
        },
        "line1": {
            "badge": "₹3,00,000 / MO ILLUSION",
            "badgeColor": "#B45309",
            "title": "THE 150 CUPS/DAY PROJECTION",
            "subtitle": "Automatic cash flow before operational reality hits",
            "highlights": ["one", "hundred", "fifty", "three", "lakh", "profit"]
        }
    },
    {
        "id": "scene_03",
        "name": "The ₹1.5 Crore Vanity Fitout",
        "part": "PART 2 · THE SUNK CAPITAL TRAP",
        "isPartStart": True,
        "partTitle": "THE SUNK CAPITAL TRAP",
        "partSub": "La Marzocco machines, microcement, and the Bangalore design arms race",
        "env": "la_marzocco_counter",
        "characterSide": "left",
        "line0": {
            "badge": "BANK ACCOUNT IN ICU",
            "badgeColor": "#DC2626",
            "title": "DAY ZERO REALITY",
            "subtitle": "Before you pour a single espresso, your capital is trapped",
            "highlights": ["pour", "single", "espresso", "bank", "account", "ICU"]
        },
        "line1": {
            "badge": "₹1.2 CR FITOUT CAPEX",
            "badgeColor": "#DC2626",
            "title": "THE DESIGN ARMS RACE",
            "subtitle": "₹12L La Marzocco + terrazzo counters + curated Scandinavian chairs",
            "highlights": ["design", "arms", "race", "twelve-lakh", "La", "Marzocco", "Scandinavian"]
        }
    },
    {
        "id": "scene_04",
        "name": "The 100-Foot Road Master Lease",
        "part": "PART 2 · THE SUNK CAPITAL TRAP",
        "isPartStart": False,
        "env": "landlord_lease",
        "characterSide": "right",
        "line0": {
            "badge": "THE COMMERCIAL LANDLORD",
            "badgeColor": "#7C3AED",
            "title": "YOUR NEW 50% PARTNER",
            "subtitle": "Prime Indiranagar 100ft road commercial property deed",
            "highlights": ["commercial", "landlord", "100-foot", "Road"]
        },
        "line1": {
            "badge": "₹4,50,000 / MONTH FIXED",
            "badgeColor": "#DC2626",
            "title": "10-MONTH SECURITY DEPOSIT",
            "subtitle": "₹45 Lakhs locked in cash + guaranteed 8% annual escalation",
            "highlights": ["four", "lakh", "fifty", "ten", "months", "deposit", "escalation"]
        }
    },
    {
        "id": "scene_05",
        "name": "The Laptop Squatter Paradox",
        "part": "PART 3 · THE OPERATIONAL MEAT GRINDER",
        "isPartStart": True,
        "partTitle": "THE OPERATIONAL MEAT GRINDER",
        "partSub": "Laptop squatters, perishable pastries, and BESCOM power bills",
        "env": "laptop_squatters",
        "characterSide": "left",
        "line0": {
            "badge": "0.8X TABLE TURNOVER",
            "badgeColor": "#DC2626",
            "title": "TABLE COLLAPSE",
            "subtitle": "Regular restaurants turn 4x; specialty cafes turn 0.8x",
            "highlights": ["table", "turns", "four", "times", "zero", "point", "eight"]
        },
        "line1": {
            "badge": "6 HOURS · 1 COLD BREW",
            "badgeColor": "#B45309",
            "title": "THE SQUATTER EQUATION",
            "subtitle": "Two senior techies consume 6 hours of Wi-Fi on a single ₹200 drink",
            "highlights": ["two", "senior", "engineers", "MacBooks", "Wi-Fi", "Zoom", "sprints"]
        }
    },
    {
        "id": "scene_06",
        "name": "The Physical Conveyor Belt of Spoilage",
        "part": "PART 3 · THE OPERATIONAL MEAT GRINDER",
        "isPartStart": False,
        "env": "conveyor_dumpster",
        "characterSide": "right",
        "line0": {
            "badge": "PERISHABLE EXPIRY",
            "badgeColor": "#DC2626",
            "title": "THE 24-HOUR CLOCK",
            "subtitle": "Coffee beans last months; fresh pastries expire daily",
            "highlights": ["beans", "months", "artisan", "pastries", "milk"]
        },
        "line1": {
            "badge": "₹30,000 / MO DUMPSTER LOSS",
            "badgeColor": "#DC2626",
            "title": "THE INVISIBLE FOOD BLEED",
            "subtitle": "Bake 30, sell 12... 18 artisanal sandwiches go to the dumpster at 10 PM",
            "highlights": ["thirty", "sandwiches", "dumpster", "thirty-thousand", "bleed"]
        }
    },
    {
        "id": "scene_07",
        "name": "The BESCOM & Genset Burn",
        "part": "PART 3 · THE OPERATIONAL MEAT GRINDER",
        "isPartStart": False,
        "env": "bescom_genset",
        "characterSide": "left",
        "line0": {
            "badge": "8 SPLIT AIR CONDITIONERS",
            "badgeColor": "#0284C7",
            "title": "COOLING THE GREENHOUSE",
            "subtitle": "50-seater glass facade under brutal 36°C summer heat",
            "highlights": ["fifty-seater", "glass", "greenhouse", "split", "air", "conditioners"]
        },
        "line1": {
            "badge": "₹1,80,000 / MONTH POWER",
            "badgeColor": "#DC2626",
            "title": "NON-DOMESTIC TARIFF + DIESEL",
            "subtitle": "Commercial power slab plus 60L diesel for backup generator",
            "highlights": ["commercial", "tariff", "diesel", "generator", "one", "lakh", "eighty"]
        }
    },
    {
        "id": "scene_08",
        "name": "The Barista Talent War",
        "part": "PART 3 · THE OPERATIONAL MEAT GRINDER",
        "isPartStart": False,
        "env": "barista_poach",
        "characterSide": "right",
        "line0": {
            "badge": "THE HEAD BARISTA",
            "badgeColor": "#D97706",
            "title": "THE CRITICAL ASSET",
            "subtitle": "Specialty baristas scouted like IPL cricketers across Bangalore",
            "highlights": ["café", "head", "barista", "scouted", "IPL", "cricketers"]
        },
        "line1": {
            "badge": "30% POACHING HIKE",
            "badgeColor": "#DC2626",
            "title": "THE SPECIALTY TALENT SQUEEZE",
            "subtitle": "The venture-backed chain across 100ft road poaches your trained talent",
            "highlights": ["swan", "latte", "art", "venture-funded", "thirty", "percent", "raise"]
        }
    },
    {
        "id": "scene_09",
        "name": "The Whiteboard Cash-Flow Grinder",
        "part": "PART 4 · THE TRUE BALANCE SHEET & VERDICT",
        "isPartStart": True,
        "partTitle": "THE TRUE BALANCE SHEET & VERDICT",
        "partSub": "The mechanical cash grinder, true unit economics, and the final verdict",
        "env": "whiteboard_grinder",
        "characterSide": "left",
        "line0": {
            "badge": "THE MECHANICAL GRINDER",
            "badgeColor": "#DC2626",
            "title": "REVENUE MEETS REALITY",
            "subtitle": "When customer cash enters the operational gear system",
            "highlights": ["customer", "revenue", "operational", "machine", "math", "collapses"]
        },
        "line1": {
            "badge": "90% CASH CRUSHED",
            "badgeColor": "#DC2626",
            "title": "THE LINE-ITEM EXECUTION",
            "subtitle": "Rent, BESCOM, payroll, and spoilage swallow every single note",
            "highlights": ["four", "fifty", "rent", "power", "payroll", "ninety", "percent"]
        }
    },
    {
        "id": "scene_10",
        "name": "The True Monthly P&L",
        "part": "PART 4 · THE TRUE BALANCE SHEET & VERDICT",
        "isPartStart": False,
        "env": "true_pnl_clipboard",
        "characterSide": "right",
        "line0": {
            "badge": "₹10,00,000 GROSS SALES",
            "badgeColor": "#059669",
            "title": "THE 400 CUPS/DAY CEILING",
            "subtitle": "Packed weekends and full food orders on high street",
            "highlights": ["four", "hundred", "cups", "ten", "lakh", "gross", "sales"]
        },
        "line1": {
            "badge": "₹40,000 TRUE NET PROFIT",
            "badgeColor": "#DC2626",
            "title": "THE 4% OWNER RESIDUAL",
            "subtitle": "In good months: ₹40K profit. In monsoon months: -₹85K loss",
            "highlights": ["deducting", "rent", "forty", "thousand", "monsoon", "eighty-five"]
        }
    },
    {
        "id": "scene_11",
        "name": "The Secret Real Winners",
        "part": "PART 4 · THE TRUE BALANCE SHEET & VERDICT",
        "isPartStart": False,
        "env": "b2b_roasters",
        "characterSide": "left",
        "line0": {
            "badge": "WHO ACTUALLY WINS?",
            "badgeColor": "#7C3AED",
            "title": "THE COFFEE BOOM PYRAMID",
            "subtitle": "Follow the capital to the actual extraction point",
            "highlights": ["making", "money", "India's", "coffee", "boom"]
        },
        "line1": {
            "badge": "LANDLORDS & B2B ROASTERS",
            "badgeColor": "#059669",
            "title": "THE PICK & SHOVEL WINNERS",
            "subtitle": "Selling 30-ton wholesale bean pallets to 500 hopeful entrepreneurs",
            "highlights": ["commercial", "property", "B2B", "specialty", "roasters", "pallets"]
        }
    },
    {
        "id": "scene_12",
        "name": "The Final Executive Verdict",
        "part": "PART 4 · THE TRUE BALANCE SHEET & VERDICT",
        "isPartStart": False,
        "env": "anurag_verdict",
        "characterSide": "right",
        "line0": {
            "badge": "THE FOUNDER'S ADVICE",
            "badgeColor": "#059669",
            "title": "SAVE YOUR CAPITAL",
            "subtitle": "If you want indie pour-overs and playlists... do not open a cafe",
            "highlights": ["dream", "sunlit", "pour-overs", "playlists", "do", "not", "open"]
        },
        "line1": {
            "badge": "UNPAID PROPERTY MANAGERS",
            "badgeColor": "#DC2626",
            "title": "THE COLD REALITY",
            "subtitle": "You didn't become a founder. You became an unpaid manager for your landlord",
            "highlights": ["six-hundred", "beans", "one", "point", "five", "crores", "unpaid", "manager"]
        }
    }
]

output_scenes = []
for meta in scenes_meta:
    sid = meta["id"]
    t_data = timing[sid]
    l0_dur = t_data["lines"][0]["duration_s"]
    l1_dur = t_data["lines"][1]["duration_s"]
    total_dur = t_data["total_duration_s"]

    scene_obj = {
        "id": sid,
        "name": meta["name"],
        "part": meta["part"],
        "isPartStart": meta["isPartStart"],
        "partTitle": meta.get("partTitle", ""),
        "partSub": meta.get("partSub", ""),
        "env": meta["env"],
        "characterSide": meta["characterSide"],
        "durationSec": total_dur,
        "line0Dur": l0_dur,
        "line1Dur": l1_dur,
        "pause": 0.5,
        "lines": [
            {
                "idx": 0,
                "text": t_data["lines"][0]["text"],
                "pause_s": 0.45,
                "badge": meta["line0"]["badge"],
                "badgeColor": meta["line0"]["badgeColor"],
                "title": meta["line0"]["title"],
                "subtitle": meta["line0"]["subtitle"],
                "highlights": meta["line0"]["highlights"],
                "durationSec": l0_dur
            },
            {
                "idx": 1,
                "text": t_data["lines"][1]["text"],
                "pause_s": 0.50,
                "badge": meta["line1"]["badge"],
                "badgeColor": meta["line1"]["badgeColor"],
                "title": meta["line1"]["title"],
                "subtitle": meta["line1"]["subtitle"],
                "highlights": meta["line1"]["highlights"],
                "durationSec": l1_dur
            }
        ]
    }
    output_scenes.append(scene_obj)

with open(OUT_FILE, "w") as f:
    json.dump(output_scenes, f, indent=2)

print(f"✓ Successfully generated {OUT_FILE} with {len(output_scenes)} scenes!")
