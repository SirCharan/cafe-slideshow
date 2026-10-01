#!/usr/bin/env python3
"""
Parse SCRIPT_PG_DRAMA.md and:
1. Export data/pg_manifest.json (24 lines for Anurag VoxCPM2 rendering in Colab)
2. Generate local draft audio files in public/audio/pg/{scene_id}_s{line_idx}.wav using macOS say (Rishi voice)
3. Compute exact audio durations (in seconds) for each line, so Remotion sequences can sync perfectly!
4. Export data/pg_scenes.json for remotion ScenePGEngine.tsx
"""

import json
import os
import re
import subprocess
from scipy.io import wavfile

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO_DIR = os.path.join(ROOT_DIR, "public", "audio", "pg")
DATA_DIR = os.path.join(ROOT_DIR, "data")
SCRIPT_MD = os.path.join(ROOT_DIR, "SCRIPT_PG_DRAMA.md")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# 12 SCENES DEFINITION WITH FULL METADATA FROM SCRIPT_PG_DRAMA.md
SCENES_DATA = [
    {
        "id": "scene_01",
        "name": "The Bangalore PG Illusion",
        "part": "PART 1 · THE CASH MACHINE ILLUSION",
        "isPartStart": True,
        "partTitle": "THE CASH MACHINE ILLUSION",
        "partSub": "Why every techie in Bangalore thinks PG owners print effortless cash",
        "env": "street",
        "characterIdentity": "pg_uncle",
        "characterPose": "point_keys",
        "characterEmotion": "neutral",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "If you walk through any lane in Marathahalli, BTM Layout, or Kundanahalli, you will see the exact same four-storey building wrapped in bright vinyl banners promising three times food, high-speed Wi-Fi, and luxury living.",
                "tts_text": "If you walk through any lane in Marathahalli, BTM Layout, or Kundanahalli, you will see the exact same four-storey building wrapped in bright vinyl banners promising three times food, high-speed Wi-Fi, and luxury living.",
                "pause_s": 0.50,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "MARATHAHALLI · BTM · HSR",
                "badgeColor": "#E74C3C",
                "title": "THE BANGALORE PG ILLUSION",
                "subtitle": "4 floors · 20 rooms · Vinyl flex banners on every corner",
                "highlights": ["Marathahalli", "BTM", "Layout", "four-storey", "vinyl", "banners", "luxury"],
            },
            {
                "idx": 1,
                "text": "And every engineer paying twelve thousand rupees for a cramped triple-sharing room looks at the owner sitting on a plastic chair in the lobby with a gold chain and thinks: this guy is printing pure cash.",
                "tts_text": "And every engineer paying twelve thousand rupees for a cramped triple-sharing room looks at the owner sitting on a plastic chair in the lobby with a gold chain and thinks: this guy is printing pure cash.",
                "pause_s": 0.50,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "TENANT ASSUMPTION",
                "badgeColor": "#F39C12",
                "title": "THE PLASTIC CHAIR CASH MACHINE",
                "subtitle": "Every techie thinks the PG owner prints effortless millions",
                "highlightMetric": {"value": "₹12,000 / BED", "label": "MONTHLY INMATE RENT", "color": "#F39C12"},
                "highlights": ["engineer", "twelve", "thousand", "triple-sharing", "gold", "chain", "printing", "pure", "cash"],
            },
        ],
    },
    {
        "id": "scene_02",
        "name": "The 60-Bed Napkin Math",
        "part": "PART 1 · THE CASH MACHINE ILLUSION",
        "env": "lobby",
        "characterIdentity": "techie_tenant",
        "characterPose": "carry_bag",
        "characterEmotion": "thinking",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "The napkin math is embarrassingly seductive.",
                "tts_text": "The napkin math is embarrassingly seductive.",
                "pause_s": 0.40,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "THE SEDUCTIVE SPREADSHEET",
                "badgeColor": "#3498DB",
                "title": "60 BEDS × ₹11,000 / MONTH",
                "subtitle": "Calculated before factoring in building lease or groceries",
                "highlights": ["napkin", "math", "embarrassingly", "seductive"],
            },
            {
                "idx": 1,
                "text": "A twenty-room building with triple sharing fits sixty paying beds. At eleven thousand rupees a month per bed, that is six lakh sixty thousand rupees hitting your bank account every single month like clockwork.",
                "tts_text": "A twenty-room building with triple sharing fits sixty paying beds. At eleven thousand rupees a month per bed, that is six lakh sixty thousand rupees hitting your bank account every single month like clockwork.",
                "pause_s": 0.60,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "GROSS REVENUE RUN RATE",
                "badgeColor": "#2ECC71",
                "title": "₹6,60,000 / MONTH CASHFLOW",
                "subtitle": "Over ₹79 Lakhs a year in gross tenant collections",
                "highlightMetric": {"value": "₹6,60,000", "label": "GROSS MONTHLY COLLECTIONS", "color": "#2ECC71"},
                "highlights": ["twenty-room", "sixty", "paying", "beds", "eleven", "thousand", "six", "lakh", "sixty", "thousand"],
            },
        ],
    },
    {
        "id": "scene_03",
        "name": "The Master-Lease Lockup",
        "part": "PART 1 · THE CASH MACHINE ILLUSION",
        "env": "lobby",
        "characterIdentity": "master_landlord",
        "characterPose": "hold_lease",
        "characterEmotion": "proud",
        "characterSide": "right",
        "lines": [
            {
                "idx": 0,
                "text": "Here is the first secret ninety percent of outsiders miss: most PG operators do not own the building.",
                "tts_text": "Here is the first secret ninety percent of outsiders miss: most PG operators do not own the building.",
                "pause_s": 0.50,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "COMMERCIAL MASTER LEASE",
                "badgeColor": "#9B59B6",
                "title": "OPERATORS DON'T OWN THE BUILDING",
                "subtitle": "They rent the bare concrete shell from local landlords",
                "highlights": ["secret", "ninety", "percent", "operators", "do", "not", "own", "building"],
            },
            {
                "idx": 1,
                "text": "They lease the entire concrete shell on a commercial master lease for two lakh eighty thousand rupees a month, and the landlord locks twenty-eight lakh rupees of upfront security deposit at zero percent interest.",
                "tts_text": "They lease the entire concrete shell on a commercial master lease for two lakh eighty thousand rupees a month, and the landlord locks twenty-eight lakh rupees of upfront security deposit at zero percent interest.",
                "pause_s": 0.60,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "UPFRONT CAPITAL DRAIN",
                "badgeColor": "#E74C3C",
                "title": "₹28,00,000 SECURITY DEPOSIT",
                "subtitle": "10 months upfront dead cash + ₹2.8L monthly rent check",
                "highlightMetric": {"value": "₹28,00,000", "label": "FROZEN DEPOSIT (0% INTEREST)", "color": "#E74C3C"},
                "highlights": ["commercial", "master", "lease", "two", "lakh", "eighty", "thousand", "twenty-eight", "lakh", "deposit"],
            },
        ],
    },
    {
        "id": "scene_04",
        "name": "The ₹18 Lakh Fitout Capex",
        "part": "PART 2 · THE 8:00 AM RUSH & THE BURN",
        "isPartStart": True,
        "partTitle": "THE 8:00 AM RUSH & THE BURN",
        "partSub": "Where fixed costs, commercial utility bills, and food factories eat margins",
        "env": "room",
        "characterIdentity": "pg_uncle",
        "characterPose": "point_keys",
        "characterEmotion": "explaining",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "Before a single tenant moves in, that empty concrete shell demands eighteen to twenty-two lakh rupees in raw furniture capex.",
                "tts_text": "Before a single tenant moves in, that empty concrete shell demands eighteen to twenty-two lakh rupees in raw furniture capex.",
                "pause_s": 0.40,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "FITOUT EXPENDITURE",
                "badgeColor": "#E67E22",
                "title": "₹18,50,000 MINIMUM CAPEX",
                "subtitle": "Bunk beds, foam mattresses, wardrobes, wiring & plumbing",
                "highlights": ["empty", "concrete", "demands", "eighteen", "twenty-two", "lakh", "furniture", "capex"],
            },
            {
                "idx": 1,
                "text": "Sixty steel beds, sixty coir mattresses, twenty geysers, five commercial washing machines, commercial kitchen vessels, biometric locks, and CCTV wiring on every floor.",
                "tts_text": "Sixty steel beds, sixty coir mattresses, twenty geysers, five commercial washing machines, commercial kitchen vessels, biometric locks, and CCTV wiring on every floor.",
                "pause_s": 0.60,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "THE HARDWARE BILL",
                "badgeColor": "#C0392B",
                "title": "20 GEYSERS + 5 WASHING MACHINES",
                "subtitle": "Biometric attendance, CCTV, and industrial kitchen setup",
                "highlightMetric": {"value": "₹18.5 LAKHS", "label": "UNRECOVERABLE FITOUT CAPEX", "color": "#C0392B"},
                "highlights": ["Sixty", "steel", "beds", "twenty", "geysers", "five", "washing", "machines", "biometric", "CCTV"],
            },
        ],
    },
    {
        "id": "scene_05",
        "name": "The 8:00 AM BESCOM Power Surge",
        "part": "PART 2 · THE 8:00 AM RUSH & THE BURN",
        "env": "room",
        "characterIdentity": "techie_tenant",
        "characterPose": "scold_phone",
        "characterEmotion": "stressed",
        "characterSide": "right",
        "lines": [
            {
                "idx": 0,
                "text": "Then comes eight o'clock on a chilly Bangalore morning when sixty engineers wake up simultaneously to catch their company shuttles.",
                "tts_text": "Then comes eight o'clock on a chilly Bangalore morning when sixty engineers wake up simultaneously to catch their company shuttles.",
                "pause_s": 0.50,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "PEAK DEMAND SURGE",
                "badgeColor": "#F1C40F",
                "title": "8:00 AM GEYSER LOAD SPIKE",
                "subtitle": "60 tenants competing for hot water before office shuttles",
                "highlights": ["eight", "o'clock", "chilly", "sixty", "engineers", "simultaneously", "company", "shuttles"],
            },
            {
                "idx": 1,
                "text": "Twenty geysers switch on at the exact same moment. Under commercial LT-3 power tariffs, that three-phase electricity meter spins at ten rupees a unit, generating a forty-five thousand rupee power bill every month.",
                "tts_text": "Twenty geysers switch on at the exact same moment. Under commercial LT-3 power tariffs, that three-phase electricity meter spins at ten rupees a unit, generating a forty-five thousand rupee power bill every month.",
                "pause_s": 0.60,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "COMMERCIAL TARIFF TRAP",
                "badgeColor": "#E74C3C",
                "title": "₹45,00,00 / MONTH BESCOM BILL",
                "subtitle": "LT-3 commercial rate at ₹9.80/unit on 3-phase industrial line",
                "highlightMetric": {"value": "₹45,000", "label": "MONTHLY BESCOM ELECTRICITY", "color": "#E74C3C"},
                "highlights": ["Twenty", "geysers", "commercial", "LT-3", "ten", "rupees", "unit", "forty-five", "thousand", "bill"],
            },
        ],
    },
    {
        "id": "scene_06",
        "name": "The Cabbage & Watery Sambar Math",
        "part": "PART 2 · THE 8:00 AM RUSH & THE BURN",
        "env": "kitchen",
        "characterIdentity": "kitchen_cook",
        "characterPose": "stir_pot",
        "characterEmotion": "neutral",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "Three times food is the biggest tenant hook in Bangalore, and it is also the operator's most brutal daily migraine.",
                "tts_text": "Three times food is the biggest tenant hook in Bangalore, and it is also the operator's most brutal daily migraine.",
                "pause_s": 0.50,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "FOOD FACTORY ECONOMICS",
                "badgeColor": "#E67E22",
                "title": "5,400 MEALS EVERY MONTH",
                "subtitle": "Breakfast, lunch dabba packing, and dinner for 60 adults",
                "highlights": ["Three", "times", "food", "biggest", "tenant", "hook", "brutal", "daily", "migraine"],
            },
            {
                "idx": 1,
                "text": "Sixty inmates eating three meals means five thousand four hundred plates a month. To survive, the food budget is capped at ninety rupees per person per day: fifty-five thousand for the cook, and mountains of wholesale cabbage, potatoes, and watery sambar.",
                "tts_text": "Sixty inmates eating three meals means five thousand four hundred plates a month. To survive, the food budget is capped at ninety rupees per person per day: fifty-five thousand for the cook, and mountains of wholesale cabbage, potatoes, and watery sambar.",
                "pause_s": 0.60,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "CABBAGE ECONOMICS",
                "badgeColor": "#D35400",
                "title": "BUDGET: STRICTLY ₹90 / DAY / HEAD",
                "subtitle": "₹55K cook wages + ₹1.1L wholesale vegetables and bulk grain",
                "highlightMetric": {"value": "₹90 / DAY", "label": "PER HEAD FOOD BUDGET", "color": "#D35400"},
                "highlights": ["five", "thousand", "four", "hundred", "ninety", "rupees", "fifty-five", "cabbage", "potatoes", "watery", "sambar"],
            },
        ],
    },
    {
        "id": "scene_07",
        "name": "The Summer Water Tanker Crisis",
        "part": "PART 3 · CHURN & DEFAULT FRICTION",
        "isPartStart": True,
        "partTitle": "CHURN & DEFAULT FRICTION",
        "partSub": "When dry borewells, midnight skips, and holiday vacancies crush cashflow",
        "env": "street",
        "characterIdentity": "pg_uncle",
        "characterPose": "scold_phone",
        "characterEmotion": "stressed",
        "characterSide": "right",
        "lines": [
            {
                "idx": 0,
                "text": "By March, the borewell in the parking basement runs bone dry.",
                "tts_text": "By March, the borewell in the parking basement runs bone dry.",
                "pause_s": 0.40,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "THE SUMMER SHOCK",
                "badgeColor": "#3498DB",
                "title": "10,000 LITRES / DAY CONSUMPTION",
                "subtitle": "Showers, washing machines, flushing, and commercial kitchen",
                "highlights": ["March", "borewell", "parking", "basement", "bone", "dry"],
            },
            {
                "idx": 1,
                "text": "Sixty people consume ten thousand litres of water every single day. At two thousand rupees per private tanker, water alone bleeds forty thousand rupees a month straight out of the operator's pocket.",
                "tts_text": "Sixty people consume ten thousand litres of water every single day. At two thousand rupees per private tanker, water alone bleeds forty thousand rupees a month straight out of the operator's pocket.",
                "pause_s": 0.60,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "PRIVATE TANKER BLEED",
                "badgeColor": "#2980B9",
                "title": "₹40,000 / MONTH IN WATER BILLS",
                "subtitle": "₹2,000 per 6,000L tanker during peak Bangalore summer",
                "highlightMetric": {"value": "₹40,000", "label": "MONTHLY PRIVATE TANKER DRAIN", "color": "#3498DB"},
                "highlights": ["ten", "thousand", "litres", "water", "two", "thousand", "tanker", "bleeds", "forty", "thousand"],
            },
        ],
    },
    {
        "id": "scene_08",
        "name": "The Midnight Runaway Tenant",
        "part": "PART 3 · CHURN & DEFAULT FRICTION",
        "env": "lobby",
        "characterIdentity": "techie_tenant",
        "characterPose": "carry_bag",
        "characterEmotion": "stressed",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "And then there is tenant default and midnight skips.",
                "tts_text": "And then there is tenant default and midnight skips.",
                "pause_s": 0.40,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "TENANT CHURN & RISK",
                "badgeColor": "#E74C3C",
                "title": "THE MIDNIGHT RUNAWAY",
                "subtitle": "Notice period violations and middle-of-the-night departures",
                "highlights": ["tenant", "default", "midnight", "skips"],
            },
            {
                "idx": 1,
                "text": "A tenant packs their trolley bag at two in the morning, slips past the biometric gate without paying the last month's rent, and your one-month deposit barely covers their unpaid electricity bill and broken closet door.",
                "tts_text": "A tenant packs their trolley bag at two in the morning, slips past the biometric gate without paying the last month's rent, and your one-month deposit barely covers their unpaid electricity bill and broken closet door.",
                "pause_s": 0.60,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "DEPOSIT FORFEITURE",
                "badgeColor": "#C0392B",
                "title": "1-MONTH DEPOSIT IS INSUFFICIENT",
                "subtitle": "Unpaid last month rent + repairs instantly wipe out deposit buffer",
                "highlightMetric": {"value": "15% CHURN", "label": "MONTHLY TENANT TURNOVER", "color": "#E74C3C"},
                "highlights": ["trolley", "bag", "two", "morning", "biometric", "gate", "unpaid", "rent", "deposit", "broken"],
            },
        ],
    },
    {
        "id": "scene_09",
        "name": "The 68% Break-Even Floor",
        "part": "PART 3 · CHURN & DEFAULT FRICTION",
        "env": "room",
        "characterIdentity": "pg_uncle",
        "characterPose": "count_cash",
        "characterEmotion": "stressed",
        "characterSide": "right",
        "lines": [
            {
                "idx": 0,
                "text": "Add up master rent of two point eight lakhs, kitchen expenses of one point six, power and water of eighty-five thousand, and housekeeping wages.",
                "tts_text": "Add up master rent of two point eight lakhs, kitchen expenses of one point six, power and water of eighty-five thousand, and housekeeping wages.",
                "pause_s": 0.50,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "FIXED MONTHLY BURN",
                "badgeColor": "#8E44AD",
                "title": "₹5,60,000 OPERATING EXPENSE",
                "subtitle": "Building rent + cook/groceries + BESCOM + water tankers",
                "highlightMetric": {"value": "₹5.6L BURN", "label": "FIXED MONTHLY OVERHEAD", "color": "#8E44AD"},
                "highlights": ["two", "point", "eight", "lakhs", "one", "point", "six", "eighty-five", "thousand", "housekeeping"],
            },
            {
                "idx": 1,
                "text": "Your fixed monthly burn is five lakh sixty thousand rupees. You need forty-one out of sixty beds occupied—sixty-eight percent occupancy—just to break exactly even.",
                "tts_text": "Your fixed monthly burn is five lakh sixty thousand rupees. You need forty-one out of sixty beds occupied—sixty-eight percent occupancy—just to break exactly even.",
                "pause_s": 0.60,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "THE SURVIVAL FLOOR",
                "badgeColor": "#E74C3C",
                "title": "BREAK-EVEN: 41 BEDS (68%)",
                "subtitle": "Below 41 occupied beds, the operator pays out of pocket",
                "highlightMetric": {"value": "68% FLOOR", "label": "MINIMUM BREAK-EVEN OCCUPANCY", "color": "#E74C3C"},
                "highlights": ["five", "lakh", "sixty", "thousand", "forty-one", "sixty-eight", "percent", "break", "even"],
            },
        ],
    },
    {
        "id": "scene_10",
        "name": "Dissecting the ₹11,000 Bed",
        "part": "PART 4 · THE OPERATOR'S SURVIVOR PLAYBOOK",
        "isPartStart": True,
        "partTitle": "THE OPERATOR'S SURVIVOR PLAYBOOK",
        "partSub": "Unit economics, sub-metering rules, and the 100-bed cluster scale",
        "env": "breakdown",
        "characterIdentity": "pg_uncle",
        "characterPose": "count_cash",
        "characterEmotion": "explaining",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "So when a techie hands over eleven thousand rupees for their bed on the fifth of every month, where does that money actually go?",
                "tts_text": "So when a techie hands over eleven thousand rupees for their bed on the fifth of every month, where does that money actually go?",
                "pause_s": 0.50,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "UNIT BED ECONOMICS",
                "badgeColor": "#2ECC71",
                "title": "DISSECTING THE ₹11,000 BED",
                "subtitle": "Where does a single inmate's monthly fee actually go?",
                "highlights": ["eleven", "thousand", "rupees", "fifth", "where", "money", "actually", "go"],
            },
            {
                "idx": 1,
                "text": "Forty-seven hundred goes to the building landlord, twenty-seven hundred to food and cook salaries, eleven hundred to power and water tankers, and nine hundred to Wi-Fi and repairs. That leaves the operator with barely sixteen hundred rupees of true net profit per bed.",
                "tts_text": "Forty-seven hundred goes to the building landlord, twenty-seven hundred to food and cook salaries, eleven hundred to power and water tankers, and nine hundred to Wi-Fi and repairs. That leaves the operator with barely sixteen hundred rupees of true net profit per bed.",
                "pause_s": 0.60,
                "ref_audio": "ref4",
                "cfg": 1.7,
                "badge": "TRUE OPERATING MARGIN",
                "badgeColor": "#2ECC71",
                "title": "TRUE NET PROFIT: ONLY ₹1,600 / BED",
                "subtitle": "Building Lease (₹4.7K) · Food (₹2.7K) · Power/Water (₹1.1K) · Ops (₹900)",
                "highlightMetric": {"value": "₹1,600", "label": "NET PROFIT / BED (14.5%)", "color": "#2ECC71"},
                "highlights": ["Forty-seven", "twenty-seven", "eleven", "nine", "sixteen", "hundred", "true", "net", "profit"],
            },
        ],
    },
    {
        "id": "scene_11",
        "name": "The Sub-Metering & Premium Yield Secret",
        "part": "PART 4 · THE OPERATOR'S SURVIVOR PLAYBOOK",
        "env": "room",
        "characterIdentity": "pg_uncle",
        "characterPose": "point_keys",
        "characterEmotion": "proud",
        "characterSide": "left",
        "lines": [
            {
                "idx": 0,
                "text": "The operators who survive and print consistent cash do two things differently.",
                "tts_text": "The operators who survive and print consistent cash do two things differently.",
                "pause_s": 0.40,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "INSIDER PLAYBOOK",
                "badgeColor": "#F39C12",
                "title": "THE 2 SURVIVOR RULES",
                "subtitle": "How top operators protect margins and eliminate waste",
                "highlights": ["operators", "survive", "print", "consistent", "two", "things", "differently"],
            },
            {
                "idx": 1,
                "text": "First: they install digital sub-meters in every room, billing electricity separately at twelve rupees a unit to stop geyser abuse. Second: they convert corner rooms into single-occupancy suites with air conditioning for twenty thousand rupees, instantly doubling their yield per square foot.",
                "tts_text": "First: they install digital sub-meters in every room, billing electricity separately at twelve rupees a unit to stop geyser abuse. Second: they convert corner rooms into single-occupancy suites with air conditioning for twenty thousand rupees, instantly doubling their yield per square foot.",
                "pause_s": 0.60,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "YIELD MULTIPLIER",
                "badgeColor": "#27AE60",
                "title": "DIGITAL SUB-METERS + SINGLE SUITES",
                "subtitle": "Charge power at ₹12/unit + Single AC rooms command ₹20,000",
                "highlightMetric": {"value": "2X YIELD", "label": "PER SQUARE FOOT REVENUE", "color": "#27AE60"},
                "highlights": ["digital", "sub-meters", "twelve", "rupees", "single-occupancy", "twenty", "thousand", "doubling", "yield"],
            },
        ],
    },
    {
        "id": "scene_12",
        "name": "Scale or Perish (The 100-Bed Cluster Rule)",
        "part": "PART 4 · THE OPERATOR'S SURVIVOR PLAYBOOK",
        "env": "street",
        "characterIdentity": "pg_uncle",
        "characterPose": "point_keys",
        "characterEmotion": "proud",
        "characterSide": "right",
        "lines": [
            {
                "idx": 0,
                "text": "Single thirty-bed PGs are an operational death trap. The real money only unlocks when you control eighty to a hundred beds across two adjacent buildings.",
                "tts_text": "Single thirty-bed PGs are an operational death trap. The real money only unlocks when you control eighty to a hundred beds across two adjacent buildings.",
                "pause_s": 0.50,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "THE CLUSTER SCALE LAW",
                "badgeColor": "#E74C3C",
                "title": "MINIMUM 80–100 BEDS FOR REAL PROFIT",
                "subtitle": "Single standalone 30-bed PGs bleed out on kitchen overhead",
                "highlights": ["Single", "thirty-bed", "death", "trap", "eighty", "hundred", "beds", "two", "buildings"],
            },
            {
                "idx": 1,
                "text": "At that scale, one central kitchen feeds everyone, cook salaries amortize, and your net profit crosses two lakh rupees a month. If you don't own the concrete, scale is the only thing standing between you and the landlord's rent cheque.",
                "tts_text": "At that scale, one central kitchen feeds everyone, cook salaries amortize, and your net profit crosses two lakh rupees a month. If you don't own the concrete, scale is the only thing standing between you and the landlord's rent cheque.",
                "pause_s": 0.70,
                "ref_audio": "ref_expressive_1",
                "cfg": 1.8,
                "badge": "EPISODE 02 CONCLUSION",
                "badgeColor": "#2ECC71",
                "title": "SCALE IS YOUR ONLY SHIELD",
                "subtitle": "Central kitchen amortizes cook wages; net profit hits ₹2L+/month",
                "highlightMetric": {"value": "≥ 80 BEDS", "label": "MINIMUM VIABLE SCALE", "color": "#2ECC71"},
                "highlights": ["central", "kitchen", "cook", "amortize", "two", "lakh", "profit", "scale", "only", "shield"],
            },
        ],
    },
]

def synthesize_line(text, out_wav):
    """Synthesize speech using macOS say with Indian English voice Rishi, with zero click/dc offset."""
    tmp_aiff = out_wav.replace(".wav", ".aiff")
    # say command
    cmd = ["say", "-v", "Rishi", "-r", "185", "-o", tmp_aiff, text]
    subprocess.run(cmd, check=True)
    # Convert to 44.1kHz 16-bit WAV with gentle 15ms cosine fade in/out to avoid clicks/beeps!
    cmd_ffmpeg = [
        "ffmpeg", "-y", "-i", tmp_aiff,
        "-af", "afade=t=in:ss=0:d=0.015,afade=t=out:st=0:d=0.015,aresample=44100",
        "-c:a", "pcm_s16le", out_wav
    ]
    subprocess.run(cmd_ffmpeg, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(tmp_aiff):
        os.remove(tmp_aiff)

def get_wav_duration(wav_path):
    sr, data = wavfile.read(wav_path)
    return len(data) / float(sr)

def main():
    colab_manifest = []
    scenes_processed = []

    print("Synthesizing local draft audio and processing scenes...")
    for s_idx, scene in enumerate(SCENES_DATA):
        sid = scene["id"]
        scene_copy = dict(scene)
        scene_copy["lineDurs"] = []

        for line in scene["lines"]:
            l_idx = line["idx"]
            wav_name = f"{sid}_s{l_idx}.wav"
            out_wav = os.path.join(AUDIO_DIR, wav_name)

            # Synthesize draft audio
            synthesize_line(line["text"], out_wav)
            dur = get_wav_duration(out_wav)
            line["durationSec"] = round(dur, 2)
            scene_copy["lineDurs"].append(round(dur, 2))

            # Add to colab manifest
            entry = {
                "id": f"{sid}_s{l_idx}",
                "scene_id": sid,
                "sentence_idx": l_idx,
                "filename": wav_name,
                "text": line["text"],
                "tts_text": line["tts_text"],
                "pause_s": line["pause_s"],
                "ref_audio": line["ref_audio"],
                "cfg": line["cfg"],
            }
            colab_manifest.append(entry)
            print(f"[{sid}_s{l_idx}] {dur:.2f}s | {line['text'][:55]}...")

        # Compute scene total duration
        # duration = padding + line0 + pause0 + line1 + pause1 + outro_cushion
        padding = 1.6 if scene.get("isPartStart") else 0.8
        l0_dur = scene_copy["lineDurs"][0]
        p0 = scene["lines"][0]["pause_s"]
        l1_dur = scene_copy["lineDurs"][1]
        p1 = scene["lines"][1]["pause_s"]
        cushion = 1.2
        total_sec = round(padding + l0_dur + p0 + l1_dur + p1 + cushion, 1)

        scene_copy["durationSec"] = total_sec
        scene_copy["line0Dur"] = l0_dur
        scene_copy["line1Dur"] = l1_dur
        scene_copy["pause"] = p0
        scenes_processed.append(scene_copy)

    # Save data/pg_manifest.json
    manifest_path = os.path.join(DATA_DIR, "pg_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(colab_manifest, f, indent=2)
    print(f"\nSaved Colab manifest with {len(colab_manifest)} lines to {manifest_path}")

    # Save data/pg_scenes.json
    scenes_path = os.path.join(DATA_DIR, "pg_scenes.json")
    with open(scenes_path, "w", encoding="utf-8") as f:
        json.dump(scenes_processed, f, indent=2)
    print(f"Saved processed scenes metadata to {scenes_path}")

    total_video_sec = sum(s["durationSec"] for s in scenes_processed)
    print(f"Total Video Runtime: {total_video_sec:.1f}s ({total_video_sec/60:.2f} minutes, {int(total_video_sec*30)} frames @ 30fps)")

if __name__ == "__main__":
    main()
