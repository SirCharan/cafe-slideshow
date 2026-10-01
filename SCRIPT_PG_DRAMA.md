# SCRIPT: The Economics of Bangalore PG Hostels
## Not a Startup — Episode 02

- **Format:** 2.5D Animated Motion Explainer (Paisa Decode Style)
- **Target Runtime:** ~5.0 Minutes (~700 spoken words across 12 narrative scenes)
- **Voice Profile:** Anurag LoRA (VoxCPM2)
  - *Narrative, Street Reality & Tenant Drama:* `ref_expressive_1` (CFG 1.8)
  - *Financial Math, Master Leases & Capex:* `ref4` (CFG 1.7)
- **Soundscape:** Organic Foley Only (Soft air whooshes, keychains, water tankers, cooking vessels — zero synthetic beeps)
- **Layout Architecture:** Strict Zero-Overlap Split Grid (Characters Left/Right, Data Cards Opposite, Subtitles Elevated Bottom)

---

## Dramatic Arc Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│               THE 4-BEAT PG HOSTEL DRAMATIC ARC (~5 MIN)               │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 1: The Cash Machine Illusion (Scenes 01–03 | 0:00 - 1:15)         │
│         Marathahalli PG street, 60-bed napkin math (₹6.6L gross),      │
│         and the commercial master-lease lockup (₹28L deposit).          │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 2: The 8:00 AM Morning Rush (Scenes 04–06 | 1:15 - 2:30)          │
│         20 geysers BESCOM power spike, the watery sambar kitchen math, │
│         and the summer water tanker crisis.                            │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 3: Churn & Default Friction (Scenes 07–09 | 2:30 - 3:45)          │
│         Midnight runaway techies, December holiday empty beds,         │
│         and the ruthless 68% break-even occupancy floor.               │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 4: The Operator's Survivor Playbook (Scenes 10–12 | 3:45 - 5:00)  │
│         Sub-metering electricity rule, single-room conversion yield,   │
│         and the 80+ bed cluster scale model.                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Scene by Scene Breakdown

---

### SCENE 01: The Marathahalli Goldmine Illusion
- **Scene ID:** `scene_01`
- **Dramatic Beat:** Beat 1 · The Cash Machine Illusion
- **Target Duration:** 24.0s (Voice ~18.0s + 6.0s establishing)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Intimate, knowing, conversational hook
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `pg_uncle` anchored strictly **LEFT** (`left: 140px, bottom: 140px`), wearing white shirt, gold chain, looking at a 4-storey building with colorful flex banners.
  - *Data Card Zone:* Anchored strictly **RIGHT** (`right: 100px, bottom: 320px`).
- **Narration:**
  > **Line 1.1** (warm hook)  
  > Spoken: *"If you walk through any lane in Marathahalli, BTM Layout, or Kundanahalli, you will see the exact same four-storey building wrapped in bright vinyl banners promising three times food, high-speed Wi-Fi, and luxury living."*  
  > Phonetic (`tts_text`): *"If you walk through any lane in Marathahalli, BTM Layout, or Kundanahalli, you will see the exact same four-storey building wrapped in bright vinyl banners promising three times food, high-speed Wi-Fi, and luxury living."*  
  > Pause: `0.50s`  
  > **Line 1.2** (ironic observation)  
  > Spoken: *"And every engineer paying twelve thousand rupees for a cramped triple-sharing room looks at the owner sitting on a plastic chair in the lobby with a gold chain and thinks: this guy is printing pure cash."*  
  > Phonetic (`tts_text`): *"And every engineer paying twelve thousand rupees for a cramped triple-sharing room looks at the owner sitting on a plastic chair in the lobby with a gold chain and thinks: this guy is printing pure cash."*  
  > Pause: `0.50s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `MARATHAHALLI · BTM · HSR`, Title: `THE BANGALORE PG ILLUSION`, Subtitle: `4 floors · 20 rooms · Vinyl flex banners on every corner`
  - *Line 1:* Badge: `TENANT ASSUMPTION`, Title: `THE PLASTIC CHAIR CASH MACHINE`, Subtitle: `Every techie thinks the PG owner prints effortless millions`, Highlight Metric: `₹12,000 / BED`

---

### SCENE 02: The 60-Bed Napkin Math
- **Scene ID:** `scene_02`
- **Dramatic Beat:** Beat 1 · The Cash Machine Illusion
- **Target Duration:** 22.0s (Voice ~16.5s + 5.5s HUD calculation)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Energetic, building illusion
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `techie_tenant` anchored strictly **LEFT** (`left: 140px, bottom: 140px`), backpack on shoulders, tapping smartphone calculator.
  - *Data Card Zone:* Anchored strictly **RIGHT** (`right: 100px, bottom: 320px`).
- **Narration:**
  > **Line 2.1** (playful calculation)  
  > Spoken: *"The napkin math is embarrassingly seductive."*  
  > Phonetic (`tts_text`): *"The napkin math is embarrassingly seductive."*  
  > Pause: `0.40s`  
  > **Line 2.2** (rapid numbers)  
  > Spoken: *"A twenty-room building with triple sharing fits sixty paying beds. At eleven thousand rupees a month per bed, that is six lakh sixty thousand rupees hitting your bank account every single month like clockwork."*  
  > Phonetic (`tts_text`): *"A twenty-room building with triple sharing fits sixty paying beds. At eleven thousand rupees a month per bed, that is six lakh sixty thousand rupees hitting your bank account every single month like clockwork."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `THE SEDUCTIVE SPREADSHEET`, Title: `60 BEDS × ₹11,000 / MONTH`, Subtitle: `Calculated before factor in building lease or groceries`
  - *Line 1:* Badge: `GROSS REVENUE RUN RATE`, Title: `₹6,60,000 / MONTH CASHFLOW`, Subtitle: `Over ₹79 Lakhs a year in gross tenant collections`, Highlight Metric: `₹6,60,000` (Gross Monthly)

---

### SCENE 03: The Master-Lease Lockup
- **Scene ID:** `scene_03`
- **Dramatic Beat:** Beat 1 · The Cash Machine Illusion
- **Target Duration:** 25.0s (Voice ~19.0s + 6.0s lease inspection)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Serious mentor, grounded legal reality
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `master_landlord` anchored strictly **RIGHT** (`right: 140px, bottom: 140px`), safari suit, holding Karnataka stamp paper lease agreement.
  - *Data Card Zone:* Anchored strictly **LEFT** (`left: 100px, bottom: 320px`).
- **Narration:**
  > **Line 3.1** (the ownership twist)  
  > Spoken: *"Here is the first secret ninety percent of outsiders miss: most PG operators do not own the building."*  
  > Phonetic (`tts_text`): *"Here is the first secret ninety percent of outsiders miss: most PG operators do not own the building."*  
  > Pause: `0.50s`  
  > **Line 3.2** (commercial lease drain)  
  > Spoken: *"They lease the entire concrete shell on a commercial master lease for two lakh eighty thousand rupees a month, and the landlord locks twenty-eight lakh rupees of upfront security deposit at zero percent interest."*  
  > Phonetic (`tts_text`): *"They lease the entire concrete shell on a commercial master lease for two lakh eighty thousand rupees a month, and the landlord locks twenty-eight lakh rupees of upfront security deposit at zero percent interest."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `COMMERCIAL MASTER LEASE`, Title: `OPERATORS DON'T OWN THE BUILDING`, Subtitle: `They rent the bare concrete shell from local landlords`
  - *Line 1:* Badge: `UPFRONT CAPITAL DRAIN`, Title: `₹28,00,000 SECURITY DEPOSIT`, Subtitle: `10 months upfront dead cash + ₹2.8L monthly rent check`, Highlight Metric: `₹28,00,000` (Frozen Deposit)

---

### SCENE 04: The ₹18 Lakh Fitout Capex
- **Scene ID:** `scene_04`
- **Dramatic Beat:** Beat 2 · The 8:00 AM Rush & The Burn
- **Target Duration:** 24.0s (Voice ~18.0s + 6.0s furniture ledger)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Rigorous capex breakdown
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `pg_uncle` anchored strictly **LEFT** (`left: 140px, bottom: 140px`), looking over room furniture blueprint.
  - *Data Card Zone:* Anchored strictly **RIGHT** (`right: 100px, bottom: 320px`).
- **Narration:**
  > **Line 4.1** (the empty shell)  
  > Spoken: *"Before a single tenant moves in, that empty concrete shell demands eighteen to twenty-two lakh rupees in raw furniture capex."*  
  > Phonetic (`tts_text`): *"Before a single tenant moves in, that empty concrete shell demands eighteen to twenty-two lakh rupees in raw furniture capex."*  
  > Pause: `0.40s`  
  > **Line 4.2** (equipment bill)  
  > Spoken: *"Sixty steel beds, sixty coir mattresses, twenty geysers, five commercial washing machines, commercial kitchen vessels, biometric locks, and CCTV wiring on every floor."*  
  > Phonetic (`tts_text`): *"Sixty steel beds, sixty coir mattresses, twenty geysers, five commercial washing machines, commercial kitchen vessels, biometric locks, and CCTV wiring on every floor."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `FITOUT EXPENDITURE`, Title: `₹18,50,000 MINIMUM CAPEX`, Subtitle: `Bunk beds, foam mattresses, wardrobes, wiring & plumbing`
  - *Line 1:* Badge: `THE HARDWARE BILL`, Title: `20 GEYSERS + 5 WASHING MACHINES`, Subtitle: `Biometric attendance, CCTV, and industrial kitchen setup`, Highlight Metric: `₹18.5 LAKHS` (Actual Capex)

---

### SCENE 05: The 8:00 AM BESCOM Power Surge
- **Scene ID:** `scene_05`
- **Dramatic Beat:** Beat 2 · The 8:00 AM Rush & The Burn
- **Target Duration:** 25.0s (Voice ~19.0s + 6.0s meter animation)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Fast, visceral, morning chaos
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `techie_tenant` anchored strictly **RIGHT** (`right: 140px, bottom: 140px`), towel on shoulder, complaining about geyser tripping.
  - *Data Card Zone:* Anchored strictly **LEFT** (`left: 100px, bottom: 320px`).
- **Narration:**
  > **Line 5.1** (morning rush)  
  > Spoken: *"Then comes eight o'clock on a chilly Bangalore morning when sixty engineers wake up simultaneously to catch their company shuttles."*  
  > Phonetic (`tts_text`): *"Then comes eight o'clock on a chilly Bangalore morning when sixty engineers wake up simultaneously to catch their company shuttles."*  
  > Pause: `0.50s`  
  > **Line 5.2** (electricity meter surge)  
  > Spoken: *"Twenty geysers switch on at the exact same moment. Under commercial LT-3 power tariffs, that three-phase electricity meter spins at ten rupees a unit, generating a forty-five thousand rupee power bill every month."*  
  > Phonetic (`tts_text`): *"Twenty geysers switch on at the exact same moment. Under commercial LT-3 power tariffs, that three-phase electricity meter spins at ten rupees a unit, generating a forty-five thousand rupee power bill every month."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `PEAK DEMAND SURGE`, Title: `8:00 AM GEYSER LOAD SPIKE`, Subtitle: `60 tenants competing for hot water before office shuttles`
  - *Line 1:* Badge: `COMMERCIAL TARIFF TRAP`, Title: `₹45,000 / MONTH BESCOM BILL`, Subtitle: `LT-3 commercial rate at ₹9.80/unit on 3-phase industrial line`, Highlight Metric: `₹45,000` (Monthly Power)

---

### SCENE 06: The Cabbage & Watery Sambar Math
- **Scene ID:** `scene_06`
- **Dramatic Beat:** Beat 2 · The 8:00 AM Rush & The Burn
- **Target Duration:** 26.0s (Voice ~19.5s + 6.5s kitchen economics)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Gritty, behind the scenes, relatable
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `kitchen_cook` anchored strictly **LEFT** (`left: 140px, bottom: 140px`), steel ladle in 60L pot, chopping board with cabbage.
  - *Data Card Zone:* Anchored strictly **RIGHT** (`right: 100px, bottom: 320px`).
- **Narration:**
  > **Line 6.1** (the food promise)  
  > Spoken: *"Three times food is the biggest tenant hook in Bangalore, and it is also the operator's most brutal daily migraine."*  
  > Phonetic (`tts_text`): *"Three times food is the biggest tenant hook in Bangalore, and it is also the operator's most brutal daily migraine."*  
  > Pause: `0.50s`  
  > **Line 6.2** (the per-head budget)  
  > Spoken: *"Sixty inmates eating three meals means five thousand four hundred plates a month. To survive, the food budget is capped at ninety rupees per person per day: fifty-five thousand for the cook, and mountains of wholesale cabbage, potatoes, and watery sambar."*  
  > Phonetic (`tts_text`): *"Sixty inmates eating three meals means five thousand four hundred plates a month. To survive, the food budget is capped at ninety rupees per person per day: fifty-five thousand for the cook, and mountains of wholesale cabbage, potatoes, and watery sambar."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `FOOD FACTORY ECONOMICS`, Title: `5,400 MEALS EVERY MONTH`, Subtitle: `Breakfast, lunch dabba packing, and dinner for 60 adults`
  - *Line 1:* Badge: `CABBAGE ECONOMICS`, Title: `BUDGET: STRICTLY ₹90 / DAY / HEAD`, Subtitle: `₹55K cook wages + ₹1.1L wholesale vegetables and bulk grain`, Highlight Metric: `₹90 / DAY` (Per Head Food)

---

### SCENE 07: The Summer Water Tanker Crisis
- **Scene ID:** `scene_07`
- **Dramatic Beat:** Beat 3 · Churn & Default Friction
- **Target Duration:** 24.0s (Voice ~18.0s + 6.0s tanker alert)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Operational friction, resource scarcity
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `pg_uncle` anchored strictly **RIGHT** (`right: 140px, bottom: 140px`), looking at dry borewell water pipe, on phone with tanker driver.
  - *Data Card Zone:* Anchored strictly **LEFT** (`left: 100px, bottom: 320px`).
- **Narration:**
  > **Line 7.1** (borewell failure)  
  > Spoken: *"By March, the borewell in the parking basement runs bone dry."*  
  > Phonetic (`tts_text`): *"By March, the borewell in the parking basement runs bone dry."*  
  > Pause: `0.40s`  
  > **Line 7.2** (tanker bleed)  
  > Spoken: *"Sixty people consume ten thousand litres of water every single day. At two thousand rupees per private tanker, water alone bleeds forty thousand rupees a month straight out of the operator's pocket."*  
  > Phonetic (`tts_text`): *"Sixty people consume ten thousand litres of water every single day. At two thousand rupees per private tanker, water alone bleeds forty thousand rupees a month straight out of the operator's pocket."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `THE SUMMER SHOCK`, Title: `10,000 LITRES / DAY CONSUMPTION`, Subtitle: `Showers, washing machines, flushing, and commercial kitchen`
  - *Line 1:* Badge: `PRIVATE TANKER BLEED`, Title: `₹40,000 / MONTH IN WATER BILLS`, Subtitle: `₹2,000 per 6,000L tanker during peak Bangalore summer`, Highlight Metric: `₹40,000` (Summer Water Bleed)

---

### SCENE 08: The Midnight Runaway Tenant
- **Scene ID:** `scene_08`
- **Dramatic Beat:** Beat 3 · Churn & Default Friction
- **Target Duration:** 25.0s (Voice ~18.5s + 6.5s biometric log)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Dark comedy, tenant friction
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `techie_tenant` anchored strictly **LEFT** (`left: 140px, bottom: 140px`), rolling trolley suitcase at midnight past security door.
  - *Data Card Zone:* Anchored strictly **RIGHT** (`right: 100px, bottom: 320px`).
- **Narration:**
  > **Line 8.1** (tenant evasion)  
  > Spoken: *"And then there is tenant default and midnight skips."*  
  > Phonetic (`tts_text`): *"And then there is tenant default and midnight skips."*  
  > Pause: `0.40s`  
  > **Line 8.2** (deposit erosion)  
  > Spoken: *"A tenant packs their trolley bag at two in the morning, slips past the biometric gate without paying the last month's rent, and your one-month deposit barely covers their unpaid electricity bill and broken closet door."*  
  > Phonetic (`tts_text`): *"A tenant packs their trolley bag at two in the morning, slips past the biometric gate without paying the last month's rent, and your one-month deposit barely covers their unpaid electricity bill and broken closet door."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `TENANT CHURN & RISK`, Title: `THE MIDNIGHT RUNAWAY`, Subtitle: `Notice period violations and middle-of-the-night departures`
  - *Line 1:* Badge: `DEPOSIT FORFEITURE`, Title: `1-MONTH DEPOSIT IS INSUFFICIENT`, Subtitle: `Unpaid last month rent + repairs instantly wipe out deposit buffer`, Highlight Metric: `15% CHURN` (Monthly Turnover)

---

### SCENE 09: The 68% Break-Even Floor
- **Scene ID:** `scene_09`
- **Dramatic Beat:** Beat 3 · Churn & Default Friction
- **Target Duration:** 26.0s (Voice ~19.5s + 6.5s threshold meter)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Mathematical reality check
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `pg_uncle` anchored strictly **RIGHT** (`right: 140px, bottom: 140px`), looking stressed at empty third-floor beds.
  - *Data Card Zone:* Anchored strictly **LEFT** (`left: 100px, bottom: 320px`).
- **Narration:**
  > **Line 9.1** (the fixed cost reality)  
  > Spoken: *"Add up master rent of two point eight lakhs, kitchen expenses of one point six, power and water of eighty-five thousand, and housekeeping wages."*  
  > Phonetic (`tts_text`): *"Add up master rent of two point eight lakhs, kitchen expenses of one point six, power and water of eighty-five thousand, and housekeeping wages."*  
  > Pause: `0.50s`  
  > **Line 9.2** (break-even threshold)  
  > Spoken: *"Your fixed monthly burn is five lakh sixty thousand rupees. You need forty-one out of sixty beds occupied—sixty-eight percent occupancy—just to break exactly even."*  
  > Phonetic (`tts_text`): *"Your fixed monthly burn is five lakh sixty thousand rupees. You need forty-one out of sixty beds occupied—sixty-eight percent occupancy—just to break exactly even."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `FIXED MONTHLY BURN`, Title: `₹5,60,000 OPERATING EXPENSE`, Subtitle: `Building rent + cook/groceries + BESCOM + water tankers`, Highlight Metric: `₹5.6L BURN` (Fixed Overhead)
  - *Line 1:* Badge: `THE SURVIVAL FLOOR`, Title: `BREAK-EVEN: 41 BEDS (68%)`, Subtitle: `Below 41 occupied beds, the operator pays out of pocket`, Highlight Metric: `68% FLOOR` (Minimum Occupancy)

---

### SCENE 10: Dissecting the ₹11,000 Bed
- **Scene ID:** `scene_10`
- **Dramatic Beat:** Beat 4 · The Operator's Survivor Playbook
- **Target Duration:** 27.0s (Voice ~20.0s + 7.0s 2.5D exploded bed)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Clean financial dissection
- **Staging & Zero-Overlap Layout:**
  - *Central Visual:* 2.5D Exploded Bed Drawer in center (`top: 180px`).
  - *Data Card Zone:* Anchored strictly **LEFT** (`left: 80px, top: 100px`).
  - *Zero character overlap.*
- **Narration:**
  > **Line 10.1** (unit dissection)  
  > Spoken: *"So when a techie hands over eleven thousand rupees for their bed on the fifth of every month, where does that money actually go?"*  
  > Phonetic (`tts_text`): *"So when a techie hands over eleven thousand rupees for their bed on the fifth of every month, where does that money actually go?"*  
  > Pause: `0.50s`  
  > **Line 10.2** (the slice breakdown)  
  > Spoken: *"Forty-seven hundred goes to the building landlord, twenty-seven hundred to food and cook salaries, eleven hundred to power and water tankers, and nine hundred to Wi-Fi and repairs. That leaves the operator with barely sixteen hundred rupees of true net profit per bed."*  
  > Phonetic (`tts_text`): *"Forty-seven hundred goes to the building landlord, twenty-seven hundred to food and cook salaries, eleven hundred to power and water tankers, and nine hundred to Wi-Fi and repairs. That leaves the operator with barely sixteen hundred rupees of true net profit per bed."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `UNIT BED ECONOMICS`, Title: `DISSECTING THE ₹11,000 BED`, Subtitle: `Where does a single inmate's monthly fee actually go?`
  - *Line 1:* Badge: `TRUE OPERATING MARGIN`, Title: `TRUE NET PROFIT: ONLY ₹1,600 / BED`, Subtitle: `Building Lease (₹4.7K) · Food (₹2.7K) · Power/Water (₹1.1K) · Ops (₹900)`, Highlight Metric: `₹1,600` (Net Profit / Bed: 14.5%)

---

### SCENE 11: The Sub-Metering & Premium Yield Secret
- **Scene ID:** `scene_11`
- **Dramatic Beat:** Beat 4 · The Operator's Survivor Playbook
- **Target Duration:** 25.0s (Voice ~18.5s + 6.5s meter sub-display)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Sharp insider strategy
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `pg_uncle` anchored strictly **LEFT** (`left: 140px, bottom: 140px`), installing digital sub-meter box outside AC room.
  - *Data Card Zone:* Anchored strictly **RIGHT** (`right: 100px, bottom: 320px`).
- **Narration:**
  > **Line 11.1** (the survival shift)  
  > Spoken: *"The operators who survive and print consistent cash do two things differently."*  
  > Phonetic (`tts_text`): *"The operators who survive and print consistent cash do two things differently."*  
  > Pause: `0.40s`  
  > **Line 11.2** (sub-metering rule)  
  > Spoken: *"First: they install digital sub-meters in every room, billing electricity separately at twelve rupees a unit to stop geyser abuse. Second: they convert corner rooms into single-occupancy suites with air conditioning for twenty thousand rupees, instantly doubling their yield per square foot."*  
  > Phonetic (`tts_text`): *"First: they install digital sub-meters in every room, billing electricity separately at twelve rupees a unit to stop geyser abuse. Second: they convert corner rooms into single-occupancy suites with air conditioning for twenty thousand rupees, instantly doubling their yield per square foot."*  
  > Pause: `0.60s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `INSIDER PLAYBOOK`, Title: `THE 2 SURVIVOR RULES`, Subtitle: `How top operators protect margins and eliminate waste`
  - *Line 1:* Badge: `YIELD MULTIPLIER`, Title: `DIGITAL SUB-METERS + SINGLE SUITES`, Subtitle: `Charge power at ₹12/unit + Single AC rooms command ₹20,000`, Highlight Metric: `2X YIELD` (Per Sq Ft)

---

### SCENE 12: Scale or Perish (The 100-Bed Cluster Rule)
- **Scene ID:** `scene_12`
- **Dramatic Beat:** Beat 4 · The Operator's Survivor Playbook
- **Target Duration:** 28.0s (Voice ~20.0s + 8.0s concluding takeaways)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Authoritative, cinematic conclusion
- **Staging & Zero-Overlap Layout:**
  - *Character Zone:* `pg_uncle` anchored strictly **RIGHT** (`right: 140px, bottom: 140px`), keys on ring, standing confident outside twin buildings.
  - *Data Card Zone:* Anchored strictly **LEFT** (`left: 100px, bottom: 320px`).
- **Narration:**
  > **Line 12.1** (scale threshold)  
  > Spoken: *"Single thirty-bed PGs are an operational death trap. The real money only unlocks when you control eighty to a hundred beds across two adjacent buildings."*  
  > Phonetic (`tts_text`): *"Single thirty-bed PGs are an operational death trap. The real money only unlocks when you control eighty to a hundred beds across two adjacent buildings."*  
  > Pause: `0.50s`  
  > **Line 12.2** (the final lesson)  
  > Spoken: *"At that scale, one central kitchen feeds everyone, cook salaries amortize, and your net profit crosses two lakh rupees a month. If you don't own the concrete, scale is the only thing standing between you and the landlord's rent cheque."*  
  > Phonetic (`tts_text`): *"At that scale, one central kitchen feeds everyone, cook salaries amortize, and your net profit crosses two lakh rupees a month. If you don't own the concrete, scale is the only thing standing between you and the landlord's rent cheque."*  
  > Pause: `0.70s`  
- **Kinetic Overlays:**
  - *Line 0:* Badge: `THE CLUSTER SCALE LAW`, Title: `MINIMUM 80–100 BEDS FOR REAL PROFIT`, Subtitle: `Single standalone 30-bed PGs bleed out on kitchen overhead`
  - *Line 1:* Badge: `EPISODE 02 CONCLUSION`, Title: `SCALE IS YOUR ONLY SHIELD`, Subtitle: `Central kitchen amortizes cook wages; net profit hits ₹2L+/month`, Highlight Metric: `≥ 80 BEDS` (Minimum Viable Scale)
