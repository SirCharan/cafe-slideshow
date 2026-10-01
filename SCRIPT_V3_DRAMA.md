# SCRIPT V3: The Economics of a Bangalore Café
## Not a Startup — Episode 01

- **Format:** 2.5D Animated Motion Explainer (Paisa Decode Style)
- **Target Runtime:** ~5.0 Minutes (~700 spoken words across 12 narrative scenes)
- **Voice Profile:** Anurag LoRA (VoxCPM2)
  - *Narrative & Hooks:* `ref_expressive_1` (CFG 1.8–2.0)
  - *Analytical & Math:* `ref4` (CFG 1.7)
- **Soundscape:** 4-Layer Dynamic Audio Mix (Voice + Ducked Lo-Fi BGM + Environmental Ambiance + Diegetic Foley)
- **Camera Philosophy:** Rule of 4 Seconds (Continuous pushes, whip pans, parallax shifts, zero static frames >4s)

---

## Dramatic Arc Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 4-BEAT NARRATIVE ARC (5 MIN)                     │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 1: The Golden Dream    (Scenes 01–03 | 0:00 - 1:15)               │
│         The Sunday illusion, the napkin math, and the square-foot trap │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 2: The Hidden Trap     (Scenes 04–06 | 1:15 - 2:30)               │
│         10-month deposit lockup, Tuesday 3 PM reality, capex blowout   │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 3: Street Friction     (Scenes 07–09 | 2:30 - 3:45)               │
│         Dissecting the ₹280 cup, delivery app claw, daily burn clock   │
├────────────────────────────────────────────────────────────────────────┤
│ Beat 4: Survivor's Math     (Scenes 10–12 | 3:45 - 5:00)               │
│         The food margin secret, side-street playbook, the runway rule  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Scene by Scene Breakdown

---

### SCENE 01: The Sunday Morning Illusion
- **Scene ID:** `scene_01_the_dream`
- **Dramatic Beat:** Beat 1 · The Golden Dream
- **Target Duration:** 24.0s (Voice ~18.5s + 5.5s establishing & foley)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Intimate, knowing, conversational hook
- **Camera & Staging:**
  - *0:00 - 0:03:* Wide establishing shot of 100 Feet Road Indiranagar café exterior. Morning sunbeams, leafy canopy swaying.
  - *0:03 - 0:08:* Smooth 1.08x camera push through glass door into bustling interior.
  - *0:08 - 0:15:* Pan across wooden communal table: 4 customers typing on aluminum laptops, steam rising from ceramic mugs.
  - *0:15 - 0:24:* Medium close-up of Barista locking portafilter and frothing milk pitcher.
- **Audio & Soundscape:**
  - *BGM:* Lo-Fi beat enters softly at -18dB (`bgm/cafe_groove.mp3`).
  - *Ambiance:* Indiranagar morning street traffic + subtle café chatter (`-24dB`).
  - *Foley:*
    - `0:02` Distant auto-rickshaw horn (`sfx/traffic_muffled.wav`)
    - `0:07` Glass door chime (`sfx/door_chime.wav`)
    - `0:14` Portafilter metal lock-in (`sfx/portafilter_clack.wav`)
    - `0:17` Espresso steam wand hiss (`sfx/steam_wand_hiss.wav`)

#### Spoken Dialogue & Narration
> **Line 1.1** (warm, reflective)  
> Spoken: *"Everyone who moves to Bangalore eventually sits in a specialty café on 100 Feet Road, watching a barista steam whole milk for a ₹280 flat white, and thinks: I could do this."*  
> Phonetic (`tts_text`): *"Everyone who moves to Bangalore eventually sits in a specialty café on one hundred feet road, watching a barista steam whole milk for a two hundred and eighty rupee flat white, and thinks: I could do this."*  
> Pause: `0.40s`

> **Line 1.2** (conversational)  
> Spoken: *"The room is packed, the air smells like roasted Ethiopian beans, and every single chair has a paying customer."*  
> Phonetic (`tts_text`): *"The room is packed, the air smells like roasted Ethiopian beans, and every single chair has a paying customer."*  
> Pause: `0.60s`

#### Visual Choreography & Character Rig
- **Characters:** `Founder` (sitting with coffee, daydream bubble), `Barista` (tamping espresso, steaming milk), `Customer 1 & 2` (MacBook typing loop).
- **Diegetic Props:** Polished timber bar counter, La Marzocco Linea machine with chrome highlights, rising SVG steam ribbons.

---

### SCENE 02: The Smartphone Calculator Trap
- **Scene ID:** `scene_02_napkin_math`
- **Dramatic Beat:** Beat 1 · The Golden Dream
- **Target Duration:** 22.0s (Voice ~17.0s + 5.0s HUD animation)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Fast, ironic, building excitement
- **Camera & Staging:**
  - *0:00 - 0:05:* Overhead top-down view of café table. Ceramic cup, paper notebook, smartphone.
  - *0:05 - 0:12:* Snap zoom punch to smartphone screen. iOS calculator app opens dynamically.
  - *0:12 - 0:22:* Digits compute with glowing orange outlines: `300 × 280 = 84,000` $\rightarrow$ `× 30 = ₹25,20,000`. Currency symbols pop with kinetic bounce.
- **Audio & Soundscape:**
  - *BGM:* Bass groove kicks in with full drum beat.
  - *Foley:*
    - `0:06` Smartphone screen tap clicks (`sfx/screen_tap.wav`)
    - `0:09` Rapid calculator punch keys (`sfx/calculator_taps.wav`)
    - `0:14` High digital chime / cash register pop (`sfx/register_ding.wav`)

#### Spoken Dialogue & Narration
> **Line 2.1** (playful, punchy)  
> Spoken: *"You do the napkin math on your phone before the foam even settles."*  
> Phonetic (`tts_text`): *"You do the napkin math on your phone before the foam even settles."*  
> Pause: `0.30s`

> **Line 2.2** (energetic, rapid calculation)  
> Spoken: *"Three hundred cups a day at ₹280 is eighty-four thousand rupees every single morning; that's twenty-five lakh rupees a month in gross revenue. On paper, it looks like an absolute money printer."*  
> Phonetic (`tts_text`): *"Three hundred cups a day at two hundred and eighty rupees is eighty-four thousand rupees every single morning; that's twenty-five lakh rupees a month in gross revenue. On paper, it looks like an absolute money printer."*  
> Pause: `0.70s`

#### Visual Choreography & Character Rig
- **Characters:** `Founder` tapping furiously on phone with an ambitious grin.
- **Data HUD:** Giant kinetic ledger card sliding into view:
  - `300 CUPS / DAY`
  - `₹84,000 DAILY RUN RATE`
  - `₹25,20,000 / MONTH GROSS` (pulsing in gold).

---

### SCENE 03: The Square Footage Trap
- **Scene ID:** `scene_03_footprint_trap`
- **Dramatic Beat:** Beat 1 · The Golden Dream
- **Target Duration:** 24.0s (Voice ~19.0s + 5.0s floorplan comparison)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Advisory, cautionary, grounded mentor
- **Camera & Staging:**
  - *0:00 - 0:06:* Split-screen architectural blueprint view: Left (Compact 800 sqft) vs Right (Sprawling 2,000 sqft).
  - *0:06 - 0:14:* Camera zooms into Right side: showing empty tables, massive ducting, oversized AC units.
  - *0:14 - 0:24:* Red warning stamps slam down on the 2,000 sqft blueprint: `2X RENT`, `2X CAPEX`, `3X POWER`.
- **Audio & Soundscape:**
  - *BGM:* Drops to quiet bassline (auto-ducked -20dB).
  - *Foley:*
    - `0:02` Blueprint unroll swish (`sfx/paper_unroll.wav`)
    - `0:08` Tape measure click & snap (`sfx/measuring_tape.wav`)
    - `0:15` Heavy rubber stamp thud (`sfx/stamp_thud.wav`)

#### Spoken Dialogue & Narration
> **Line 3.1** (conversational)  
> Spoken: *"So you start scouting locations across Indiranagar, Koramangala, and HSR Layout. And immediately, you face your first fatal choice: space."*  
> Phonetic (`tts_text`): *"So you start scouting locations across Indira nagar, Kora-mungala, and H S R Layout. And immediately, you face your first fatal choice: space."*  
> Pause: `0.35s`

> **Line 3.2** (cautionary, direct)  
> Spoken: *"Rookie founders fall in love with sprawling two-thousand square foot spaces with mezzanines and outdoor patios, completely ignoring that double the floor space instantly doubles your rent, your air conditioning load, and your fit-out costs."*  
> Phonetic (`tts_text`): *"Rookie founders fall in love with sprawling two thousand square foot spaces with mezzanines and outdoor patios, completely ignoring that double the floor space instantly doubles your rent, your air conditioning load, and your fit out costs."*  
> Pause: `0.75s`

#### Visual Choreography & Character Rig
- **Characters:** `Founder` standing between two floorplans scratching their head.
- **Diegetic Props:** Architectural blueprint grid with isometric wall outlines raising from 0px to 3D.

---

### SCENE 04: The 10-Month Landlord Lockup
- **Scene ID:** `scene_04_deposit_lockup`
- **Dramatic Beat:** Beat 2 · The Hidden Trap
- **Target Duration:** 25.0s (Voice ~19.5s + 5.5s safe door effect)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Dry, forensic, blunt reality
- **Camera & Staging:**
  - *0:00 - 0:04:* Whip pan transition into Landlord's office. Heavy dark teak table.
  - *0:04 - 0:12:* Slow push on Landlord character in safari suit sliding a legal document across the table with one hand.
  - *0:12 - 0:25:* Giant metallic vault safe opens behind the landlord. ₹25 Lakhs in cash bundles fly from the Founder's briefcase into the safe. Door slams shut with a heavy padlock.
- **Audio & Soundscape:**
  - *BGM:* Tension chord with slow rhythmic shaker.
  - *Foley:*
    - `0:00` Fast camera whip-whoosh (`sfx/whip_whoosh.wav`)
    - `0:05` Paper agreement sliding on polished wood (`sfx/paper_slide.wav`)
    - `0:14` Metallic safe combination dial spinning (`sfx/vault_spin.wav`)
    - `0:19` Heavy iron safe door slam (`sfx/safe_door_slam.wav`)

#### Spoken Dialogue & Narration
> **Line 4.1** (blunt, warning)  
> Spoken: *"Before you even buy a single coffee grinder, Bangalore's commercial rental market hits you with its signature tax: the ten-month security deposit."*  
> Phonetic (`tts_text`): *"Before you even buy a single coffee grinder, Bangalore's commercial rental market hits you with its signature tax: the ten-month security deposit."*  
> Pause: `0.35s`

> **Line 4.2** (sober, measured)  
> Spoken: *"For a decent 800-square-foot space on a busy corner, that means writing a cheque for twenty to twenty-five lakh rupees. That money sits frozen in your landlord's bank account, earning zero interest, before you brew your very first cup."*  
> Phonetic (`tts_text`): *"For a decent eight hundred square foot space on a busy corner, that means writing a cheque for twenty to twenty five lakh rupees. That money sits frozen in your landlord's bank account, earning zero interest, before you brew your very first cup."*  
> Pause: `0.80s`

#### Visual Choreography & Character Rig
- **Characters:** `Landlord` (stern, moustache, glasses, arms folded), `Founder` (sweat drop icon, handing over crossed cheque).
- **Diegetic Props:** 100-rupee stamp paper legal agreement, heavy green bank chequebook, cast-iron vault.

---

### SCENE 05: The Tuesday 3 PM Graveyard
- **Scene ID:** `scene_05_tuesday_reality`
- **Dramatic Beat:** Beat 2 · The Hidden Trap
- **Target Duration:** 26.0s (Voice ~21.0s + 5.0s rain & clock ambiance)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Dark turn, cold truth, observant
- **Camera & Staging:**
  - *0:00 - 0:04:* Instant lighting cut: from warm amber sunlight to cool overcast rainy gray (`#E8ECEF`).
  - *0:04 - 0:12:* Slow sideways tracking shot across an empty café. Chairs turned up on tables.
  - *0:12 - 0:18:* Camera lands on a single table: two freelancers with glowing MacBooks, single half-drunk cup of black coffee between them.
  - *0:18 - 0:26:* Push in on the digital electricity meter spinning wildly on the wall behind them.
- **Audio & Soundscape:**
  - *Ambiance:* Heavy Bangalore monsoon rain hitting glass window (`sfx/monsoon_rain_window.wav`).
  - *Foley:*
    - `0:03` Sudden distant thunder rumble (`sfx/distant_thunder.wav`)
    - `0:07` Mechanical clock ticking loudly (`sfx/wall_clock_tick.wav`)
    - `0:14` Keyboard click-clack (`sfx/macbook_typing.wav`)
    - `0:20` Electric hum of commercial AC compressor (`sfx/ac_hum.wav`)

#### Spoken Dialogue & Narration
> **Line 5.1** (ironic, deflating)  
> Spoken: *"Sunday morning is a dangerous optical illusion. The real test of an independent café happens on a rainy Tuesday at three in the afternoon."*  
> Phonetic (`tts_text`): *"Sunday morning is a dangerous optical illusion. The real test of an independent café happens on a rainy Tuesday at three in the afternoon."*  
> Pause: `0.40s`

> **Line 5.2** (dry, grounded)  
> Spoken: *"Look around: two people who bought an Americano four hours ago are camping on your high-speed Wi-Fi, while your commercial espresso boiler, kitchen exhaust, and split AC units keep chewing through three-phase electricity tariffs."*  
> Phonetic (`tts_text`): *"Look around: two people who bought an Americano four hours ago are camping on your high speed Wi Fi, while your commercial espresso boiler, kitchen exhaust, and split A C units keep chewing through three-phase electricity tariffs."*  
> Pause: `0.80s`

#### Visual Choreography & Character Rig
- **Characters:** `Camper 1` & `Camper 2` (hoodies, headphones, staring at screens), `Barista` (resting elbows on empty counter, bored expression).
- **Diegetic Props:** Rain streaks running down large glass pane, digital electricity meter dial pulsing in red.

---

### SCENE 06: The Capex Blowout
- **Scene ID:** `scene_06_capex_reality`
- **Dramatic Beat:** Beat 2 · The Hidden Trap
- **Target Duration:** 24.0s (Voice ~19.5s + 4.5s invoice breakdown)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Forensic, practical, financial autopsy
- **Camera & Staging:**
  - *0:00 - 0:05:* Split screen: "The Plan: ₹10 Lakhs" vs "The Invoice: ₹26 Lakhs".
  - *0:05 - 0:13:* Animated invoices pile onto the screen like cards: Espresso Gear (₹8L), Civil & Plumbing (₹6L), Exhaust & HVAC (₹4L), Licences & Legal (₹2L).
  - *0:13 - 0:24:* Bar chart dynamically shooting upward, breaking through the original ceiling limit.
- **Audio & Soundscape:**
  - *BGM:* Staccato keyboard rhythm, analytical tempo.
  - *Foley:*
    - `0:03` Rapid receipt printer churning out paper (`sfx/receipt_printer.wav`)
    - `0:07` Cash register thud (`sfx/drawer_shut.wav`)
    - `0:14` Rising pitch slide whistle or ascending harp plucks (`sfx/cost_escalation.wav`)

#### Spoken Dialogue & Narration
> **Line 6.1** (direct, candid)  
> Spoken: *"Most first-time founders budget ten lakh rupees for their build-out, thinking tables, paint, and counter wood are cheap. Reality hits closer to twenty-five or thirty lakhs."*  
> Phonetic (`tts_text`): *"Most first-time founders budget ten lakh rupees for their build-out, thinking tables, paint, and counter wood are cheap. Reality hits closer to twenty-five or thirty lakhs."*  
> Pause: `0.35s`

> **Line 6.2** (systematic, clear)  
> Spoken: *"An entry-level commercial espresso machine and dual grinders eat six to eight lakhs alone. Civil plumbing, grease traps, sound baffling, and local trade permits swallow the rest before opening day."*  
> Phonetic (`tts_text`): *"An entry level commercial espresso machine and dual grinders eat six to eight lakhs alone. Civil plumbing, grease traps, sound baffling, and local trade permits swallow the rest before opening day."*  
> Pause: `0.70s`

#### Visual Choreography & Character Rig
- **Data Cards:** 
  - `ESPRESSO & GRINDERS: ₹7,50,000`
  - `CIVIL, PLUMBING, HVAC: ₹10,00,000`
  - `DEPOSITS & LICENCES: ₹6,00,000`
  - `WORKING RUNWAY: ₹5,00,000`
- **Total Ledger:** `ACTUAL CAPEX: ₹28,50,000` (highlighted in terracotta).

---

### SCENE 07: Dissecting the ₹280 Cup
- **Scene ID:** `scene_07_margin_dissection`
- **Dramatic Beat:** Beat 3 · Street Friction
- **Target Duration:** 25.0s (Voice ~20.0s + 5.0s visual slice animation)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Educational, precision breakdown, revelatory
- **Camera & Staging:**
  - *0:00 - 0:04:* Macro close-up: A beautifully illustrated 2.5D white ceramic cup filled with creamy latte art. Price tag: `₹280`.
  - *0:04 - 0:14:* A laser cutter beam slides horizontally through the cup, splitting it into 5 distinct vertical slices with labels:
    - `BEANS & MILK: ₹35` (12%)
    - `BARISTA & STAFF: ₹42` (15%)
    - `RENT SHARE: ₹42` (15%)
    - `POWER, TAX & OPERATING: ₹50` (18%)
  - *0:14 - 0:25:* The remaining tiny liquid layer at the bottom is highlighted: `NET PROFIT: ₹55` (20%).
- **Audio & Soundscape:**
  - *BGM:* Light acoustic guitar arpeggio with soft hi-hat.
  - *Foley:*
    - `0:03` Porcelain saucer clink (`sfx/cup_saucer_clink.wav`)
    - `0:06` High-tech laser slice whoosh (`sfx/slice_laser.wav`)
    - `0:09` Individual liquid drip drops (`sfx/water_drops.wav`)
    - `0:16` Single soft metal coin landing in saucer (`sfx/coin_drop.wav`)

#### Spoken Dialogue & Narration
> **Line 7.1** (intriguing question)  
> Spoken: *"When a customer taps their card for a ₹280 flat white, where does that cash actually go?"*  
> Phonetic (`tts_text`): *"When a customer taps their card for a two hundred and eighty rupee flat white, where does that cash actually go?"*  
> Pause: `0.35s`

> **Line 7.2** (precise breakdown)  
> Spoken: *"Thirty-five rupees pays for the roasted Arabica beans and fresh milk. Another forty-two rupees covers your baristas. Rent takes forty rupees. Power, water, and GST consume fifty. You are left with barely fifty to sixty rupees of net margin per cup."*  
> Phonetic (`tts_text`): *"Thirty-five rupees pays for the roasted Arabica beans and fresh milk. Another forty-two rupees covers your baristas. Rent takes forty rupees. Power, water, and G S T consume fifty. You are left with barely fifty to sixty rupees of net margin per cup."*  
> Pause: `0.75s`

#### Visual Choreography & Character Rig
- **Visual Asset:** 2.5D exploded cup schematic. As each segment drops out, coins slide into designated buckets: `Suppliers`, `Landlord`, `BESCOM`, `Staff`.

---

### SCENE 08: The Delivery App Trap
- **Scene ID:** `scene_08_delivery_trap`
- **Dramatic Beat:** Beat 3 · Street Friction
- **Target Duration:** 24.0s (Voice ~19.0s + 5.0s claw interaction)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Bitter irony, warning, urgent
- **Camera & Staging:**
  - *0:00 - 0:04:* Counter view. Bright orange and red delivery thermal bags arrive on counter.
  - *0:04 - 0:12:* A giant mechanical crane claw descends from the top of the frame.
  - *0:12 - 0:24:* Claw plunges into the bill and rips away a massive 28% chunk labeled `AGGREGATOR COMMISSION`. Spill-proof cup packaging costs pile up beside it.
- **Audio & Soundscape:**
  - *Foley:*
    - `0:02` Delivery order incoming siren / ping (`sfx/delivery_order_ping.wav`)
    - `0:06` Industrial crane gear whirr (`sfx/mechanical_gear.wav`)
    - `0:11` Paper tearing / ripping sound (`sfx/paper_rip.wav`)
    - `0:18` Motorcycle acceleration taking off (`sfx/bike_rev.wav`)

#### Spoken Dialogue & Narration
> **Line 8.1** (conversational, setting the trap)  
> Spoken: *"To fill those empty weekday afternoons, founders inevitably list on Swiggy and Zomato."*  
> Phonetic (`tts_text`): *"To fill those empty weekday afternoons, founders inevitably list on Swiggy and Zomato."*  
> Pause: `0.30s`

> **Line 8.2** (sharp, cautionary)  
> Spoken: *"But food delivery aggregators take a twenty-five to twenty-eight percent commission cut. On a hot coffee that already costs money to pack in spill-proof cups, delivery orders don't build profit; they just run your staff ragged while keeping the delivery platform rich."*  
> Phonetic (`tts_text`): *"But food delivery aggregators take a twenty-five to twenty-eight percent commission cut. On a hot coffee that already costs money to pack in spill-proof cups, delivery orders don't build profit; they just run your staff ragged while keeping the delivery platform rich."*  
> Pause: `0.75s`

#### Visual Choreography & Character Rig
- **Characters:** `Delivery Rider` (helmet, jacket, phone scanner), `Barista` (frantic packing motions, taped lid).
- **Diegetic Props:** Cardboard cup holders, thermal bags, percentage tax pie chart collapsing.

---

### SCENE 09: The Fixed-Cost Clock
- **Scene ID:** `scene_09_daily_burn`
- **Dramatic Beat:** Beat 3 · Street Friction
- **Target Duration:** 24.0s (Voice ~18.5s + 5.5s clock rush)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Ominous, relentless, mathematically cold
- **Camera & Staging:**
  - *0:00 - 0:05:* Extreme close-up of a vintage brass wall clock. The second hand ticks in rapid double-time.
  - *0:05 - 0:13:* Zoom out to reveal the café front shutter still locked shut at 7:00 AM.
  - *0:13 - 0:24:* A glowing digital burn odometer floats above the shutter: `₹0 ... ₹1,200 ... ₹3,500 ... ₹4,800`. The money counter ticks relentlessly whether the door is open or closed.
- **Audio & Soundscape:**
  - *BGM:* Muffled heartbeat kick drum under the track.
  - *Foley:*
    - `0:02` Heavy resonant clock tick-tock (`sfx/heavy_clock_tick.wav`)
    - `0:08` Rapid digital counter ticking (`sfx/odometer_roll.wav`)
    - `0:15` Metal shutter rattle in wind (`sfx/shutter_rattle.wav`)

#### Spoken Dialogue & Narration
> **Line 9.1** (heavy, reflective)  
> Spoken: *"The math that keeps café owners awake at two in the morning is the daily opening burn."*  
> Phonetic (`tts_text`): *"The math that keeps café owners awake at two in the morning is the daily opening burn."*  
> Pause: `0.35s`

> **Line 9.2** (relentless, firm)  
> Spoken: *"Between base rent, minimum staff payroll, commercial refrigeration, and maintenance, your shop burns roughly four to five thousand rupees every single day before you unlock the front shutter. If nobody walks through that door by noon, you are in the red."*  
> Phonetic (`tts_text`): *"Between base rent, minimum staff payroll, commercial refrigeration, and maintenance, your shop burns roughly four to five thousand rupees every single day before you unlock the front shutter. If nobody walks through that door by noon, you are in the red."*  
> Pause: `0.80s`

#### Visual Choreography & Character Rig
- **Visuals:** Dark morning silhouette of Bangalore street. Street dogs walking past. Shut storefront with illuminated electric meters.

---

### SCENE 10: The Food Secret
- **Scene ID:** `scene_10_food_secret`
- **Dramatic Beat:** Beat 4 · The Survivor's Playbook
- **Target Duration:** 26.0s (Voice ~20.5s + 5.5s menu comparison)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Illuminating, insider revelation, confident
- **Camera & Staging:**
  - *0:00 - 0:05:* Bright return to warm sunny aesthetics. Camera glides over a stunning pastry and food display counter.
  - *0:05 - 0:13:* Side-by-side battle:
    - *Left:* Flat White (`₹280` | Gross Margin `₹60` | High labour)
    - *Right:* Sourdough Avocado Toast & Croissant (`₹450` | Gross Margin `₹270` | Fast assembly)
  - *0:13 - 0:26:* Revenue doughnut chart for a top specialty chain: `Beverages: 45%`, `Fresh Food: 40%`, `Retail Beans: 15%`.
- **Audio & Soundscape:**
  - *BGM:* Upbeat, optimistic groove returns with warm Rhodes keys.
  - *Foley:*
    - `0:04` Crisp bread crust crunch / slicing knife (`sfx/bread_slice.wav`)
    - `0:09` Plate clatter onto wooden tabletop (`sfx/plate_table_clatter.wav`)
    - `0:16` Bright celebratory chime (`sfx/success_chime.wav`)

#### Spoken Dialogue & Narration
> **Line 10.1** (revelatory, bold)  
> Spoken: *"Here is the industry secret that veteran operators like Blue Tokai know: successful cafés don't survive on coffee. They survive on food."*  
> Phonetic (`tts_text`): *"Here is the industry secret that veteran operators like Blue Tokai know: successful cafés don't survive on coffee. They survive on food."*  
> Pause: `0.40s`

> **Line 10.2** (insightful, practical)  
> Spoken: *"Coffee brings people in the door, but beverages only account for forty-five percent of sales. Fresh food, artisanal sourdough, and breakfast bowls make up forty percent of revenue, with double the gross profit margin."*  
> Phonetic (`tts_text`): *"Coffee brings people in the door, but beverages only account for forty-five percent of sales. Fresh food, artisanal sourdough, and breakfast bowls make up forty percent of revenue, with double the gross profit margin."*  
> Pause: `0.75s`

#### Visual Choreography & Character Rig
- **Characters:** `Barista` serving a delicious toasted sandwich and iced pour-over to a smiling guest.
- **Data Callout:** `TICKET SIZE JUMPS FROM ₹280 TO ₹730 WITH FOOD`.

---

### SCENE 11: The Side-Street Advantage
- **Scene ID:** `scene_11_side_street`
- **Dramatic Beat:** Beat 4 · The Survivor's Playbook
- **Target Duration:** 24.0s (Voice ~18.5s + 5.5s street comparison)
- **Voice Profile:** `ref4` | CFG: 1.7 | Tone: Pragmatic strategist, street-smart
- **Camera & Staging:**
  - *0:00 - 0:06:* Split bird's-eye map of Bangalore:
    - *Top:* 100 Feet Road Commercial Strip (Red rent tag: `₹2.5 Lakhs/mo`, car honks, high turnover).
    - *Bottom:* HSR Sector 4 Tree-lined Lane (Green rent tag: `₹60,000/mo`, bicycles, steady neighbourhood regulars).
  - *0:06 - 0:14:* Push into the bottom lane: showing intimate outdoor bench seating, dogs sitting by owners, warm hanging Edison bulbs.
  - *0:14 - 0:24:* Floating benchmark badge: `RENT MUST BE UNDER 15% OF SALES`.
- **Audio & Soundscape:**
  - *Ambiance:* Birds chirping in rain trees, gentle bicycle bell.
  - *Foley:*
    - `0:03` Loud traffic chaos (`sfx/traffic_screech.wav`) $\rightarrow$ instantly fades
    - `0:07` Gentle bicycle bell ring (`sfx/bike_bell.wav`)
    - `0:14` UPI payment successful audio prompt (`sfx/upi_success_voice.wav`)

#### Spoken Dialogue & Narration
> **Line 11.1** (smart, strategic)  
> Spoken: *"That is why the smart operators skip the ego rent on 100 Feet Road and tuck themselves into a leafy side street in HSR Layout or Koramangala."*  
> Phonetic (`tts_text`): *"That is why the smart operators skip the ego rent on one hundred feet road and tuck themselves into a leafy side street in H S R Layout or Kora-mungala."*  
> Pause: `0.35s`

> **Line 11.2** (authoritative law)  
> Spoken: *"Keeping your monthly rent strictly under fifteen percent of gross sales gives you the breathing room to build a genuine neighbourhood community without choking on overhead."*  
> Phonetic (`tts_text`): *"Keeping your monthly rent strictly under fifteen percent of gross sales gives you the breathing room to build a genuine neighbourhood community without choking on overhead."*  
> Pause: `0.75s`

#### Visual Choreography & Character Rig
- **Characters:** `Founder` chatting casually with a regular neighbour walking their golden retriever.
- **HUD Indicator:** `THE 15% RENT CEILING` (glowing green safety meter).

---

### SCENE 12: Master the Basics Before the Rent Does
- **Scene ID:** `scene_12_the_rules`
- **Dramatic Beat:** Beat 4 · The Survivor's Playbook
- **Target Duration:** 25.0s (Voice ~19.0s + 6.0s outro transition)
- **Voice Profile:** `ref_expressive_1` | CFG: 1.8 | Tone: Direct, grounded, memorable sign-off
- **Camera & Staging:**
  - *0:00 - 0:06:* Medium shot of Founder reviewing daily POS terminal numbers. Screen reads: `NET OPERATING PROFIT: +₹18,400`.
  - *0:06 - 0:13:* Founder turns to look at camera, nod of earned wisdom.
  - *0:13 - 0:19:* Final title card drops in with snap animation:
    `NOT A STARTUP`
    `Rule #1: Master the basics before the rent does.`
  - *0:19 - 0:25:* Teaser card flips into view:
    `NEXT EPISODE: THE RESTAURANT TRAP`
    `Why 80% of dining rooms fail in 18 months.`
- **Audio & Soundscape:**
  - *BGM:* Bass groove rises to a confident, resolving finish.
  - *Foley:*
    - `0:05` Register closing click (`sfx/register_shut.wav`)
    - `0:14` Clean wooden gavel/block tap (`sfx/wood_block_tap.wav`)
    - `0:22` Smooth cinematic bass drop outro (`sfx/outro_sub.wav`)

#### Spoken Dialogue & Narration
> **Line 12.1** (direct, grounded rules)  
> Spoken: *"If you want to open a café in Bangalore, do not start with the interior design. Start with your cash reserve: keep nine to twelve months of operating runway in the bank, control your square footage, and treat unit economics like oxygen."*  
> Phonetic (`tts_text`): *"If you want to open a café in Bangalore, do not start with the interior design. Start with your cash reserve: keep nine to twelve months of operating runway in the bank, control your square footage, and treat unit economics like oxygen."*  
> Pause: `0.40s`

> **Line 12.2** (punchy closing & teaser)  
> Spoken: *"Master the basics before the rent does. Next up: what happens when you try to open a full-service restaurant."*  
> Phonetic (`tts_text`): *"Master the basics before the rent does. Next up: what happens when you try to open a full service restaurant."*  
> Pause: `1.00s`

#### Visual Choreography & Character Rig
- **Closing Graphics:** Clean typography, minimalist branding, episode teaser thumbnail sliding into perspective view.

---

## Technical Voice Generation Manifest

To be used directly by `scripts/export-colab-bundle.mjs` or our Colab VoxCPM2 pipeline:

```json
[
  {
    "scene_id": "scene_01",
    "voice_ref": "ref_expressive_1",
    "cfg": 1.8,
    "lines": [
      {
        "id": "scene_01_s0",
        "text": "Everyone who moves to Bangalore eventually sits in a specialty café on 100 Feet Road, watching a barista steam whole milk for a ₹280 flat white, and thinks: I could do this.",
        "tts_text": "Everyone who moves to Bangalore eventually sits in a specialty café on one hundred feet road, watching a barista steam whole milk for a two hundred and eighty rupee flat white, and thinks: I could do this.",
        "pause_s": 0.40
      },
      {
        "id": "scene_01_s1",
        "text": "The room is packed, the air smells like roasted Ethiopian beans, and every single chair has a paying customer.",
        "tts_text": "The room is packed, the air smells like roasted Ethiopian beans, and every single chair has a paying customer.",
        "pause_s": 0.60
      }
    ]
  },
  {
    "scene_id": "scene_02",
    "voice_ref": "ref_expressive_1",
    "cfg": 1.8,
    "lines": [
      {
        "id": "scene_02_s0",
        "text": "You do the napkin math on your phone before the foam even settles.",
        "tts_text": "You do the napkin math on your phone before the foam even settles.",
        "pause_s": 0.30
      },
      {
        "id": "scene_02_s1",
        "text": "Three hundred cups a day at ₹280 is eighty-four thousand rupees every single morning; that's twenty-five lakh rupees a month in gross revenue. On paper, it looks like an absolute money printer.",
        "tts_text": "Three hundred cups a day at two hundred and eighty rupees is eighty-four thousand rupees every single morning; that's twenty-five lakh rupees a month in gross revenue. On paper, it looks like an absolute money printer.",
        "pause_s": 0.70
      }
    ]
  },
  {
    "scene_id": "scene_03",
    "voice_ref": "ref4",
    "cfg": 1.7,
    "lines": [
      {
        "id": "scene_03_s0",
        "text": "So you start scouting locations across Indiranagar, Koramangala, and HSR Layout. And immediately, you face your first fatal choice: space.",
        "tts_text": "So you start scouting locations across Indira nagar, Kora-mungala, and H S R Layout. And immediately, you face your first fatal choice: space.",
        "pause_s": 0.35
      },
      {
        "id": "scene_03_s1",
        "text": "Rookie founders fall in love with sprawling two-thousand square foot spaces with mezzanines and outdoor patios, completely ignoring that double the floor space instantly doubles your rent, your air conditioning load, and your fit-out costs.",
        "tts_text": "Rookie founders fall in love with sprawling two thousand square foot spaces with mezzanines and outdoor patios, completely ignoring that double the floor space instantly doubles your rent, your air conditioning load, and your fit out costs.",
        "pause_s": 0.75
      }
    ]
  },
  {
    "scene_id": "scene_04",
    "voice_ref": "ref4",
    "cfg": 1.7,
    "lines": [
      {
        "id": "scene_04_s0",
        "text": "Before you even buy a single coffee grinder, Bangalore's commercial rental market hits you with its signature tax: the ten-month security deposit.",
        "tts_text": "Before you even buy a single coffee grinder, Bangalore's commercial rental market hits you with its signature tax: the ten-month security deposit.",
        "pause_s": 0.35
      },
      {
        "id": "scene_04_s1",
        "text": "For a decent 800-square-foot space on a busy corner, that means writing a cheque for twenty to twenty-five lakh rupees. That money sits frozen in your landlord's bank account, earning zero interest, before you brew your very first cup.",
        "tts_text": "For a decent eight hundred square foot space on a busy corner, that means writing a cheque for twenty to twenty five lakh rupees. That money sits frozen in your landlord's bank account, earning zero interest, before you brew your very first cup.",
        "pause_s": 0.80
      }
    ]
  },
  {
    "scene_id": "scene_05",
    "voice_ref": "ref_expressive_1",
    "cfg": 1.8,
    "lines": [
      {
        "id": "scene_05_s0",
        "text": "Sunday morning is a dangerous optical illusion. The real test of an independent café happens on a rainy Tuesday at three in the afternoon.",
        "tts_text": "Sunday morning is a dangerous optical illusion. The real test of an independent café happens on a rainy Tuesday at three in the afternoon.",
        "pause_s": 0.40
      },
      {
        "id": "scene_05_s1",
        "text": "Look around: two people who bought an Americano four hours ago are camping on your high-speed Wi-Fi, while your commercial espresso boiler, kitchen exhaust, and split AC units keep chewing through three-phase electricity tariffs.",
        "tts_text": "Look around: two people who bought an Americano four hours ago are camping on your high speed Wi Fi, while your commercial espresso boiler, kitchen exhaust, and split A C units keep chewing through three-phase electricity tariffs.",
        "pause_s": 0.80
      }
    ]
  },
  {
    "scene_id": "scene_06",
    "voice_ref": "ref4",
    "cfg": 1.7,
    "lines": [
      {
        "id": "scene_06_s0",
        "text": "Most first-time founders budget ten lakh rupees for their build-out, thinking tables, paint, and counter wood are cheap. Reality hits closer to twenty-five or thirty lakhs.",
        "tts_text": "Most first-time founders budget ten lakh rupees for their build-out, thinking tables, paint, and counter wood are cheap. Reality hits closer to twenty-five or thirty lakhs.",
        "pause_s": 0.35
      },
      {
        "id": "scene_06_s1",
        "text": "An entry-level commercial espresso machine and dual grinders eat six to eight lakhs alone. Civil plumbing, grease traps, sound baffling, and local trade permits swallow the rest before opening day.",
        "tts_text": "An entry level commercial espresso machine and dual grinders eat six to eight lakhs alone. Civil plumbing, grease traps, sound baffling, and local trade permits swallow the rest before opening day.",
        "pause_s": 0.70
      }
    ]
  },
  {
    "scene_id": "scene_07",
    "voice_ref": "ref4",
    "cfg": 1.7,
    "lines": [
      {
        "id": "scene_07_s0",
        "text": "When a customer taps their card for a ₹280 flat white, where does that cash actually go?",
        "tts_text": "When a customer taps their card for a two hundred and eighty rupee flat white, where does that cash actually go?",
        "pause_s": 0.35
      },
      {
        "id": "scene_07_s1",
        "text": "Thirty-five rupees pays for the roasted Arabica beans and fresh milk. Another forty-two rupees covers your baristas. Rent takes forty rupees. Power, water, and GST consume fifty. You are left with barely fifty to sixty rupees of net margin per cup.",
        "tts_text": "Thirty-five rupees pays for the roasted Arabica beans and fresh milk. Another forty-two rupees covers your baristas. Rent takes forty rupees. Power, water, and G S T consume fifty. You are left with barely fifty to sixty rupees of net margin per cup.",
        "pause_s": 0.75
      }
    ]
  },
  {
    "scene_id": "scene_08",
    "voice_ref": "ref_expressive_1",
    "cfg": 1.8,
    "lines": [
      {
        "id": "scene_08_s0",
        "text": "To fill those empty weekday afternoons, founders inevitably list on Swiggy and Zomato.",
        "tts_text": "To fill those empty weekday afternoons, founders inevitably list on Swiggy and Zomato.",
        "pause_s": 0.30
      },
      {
        "id": "scene_08_s1",
        "text": "But food delivery aggregators take a twenty-five to twenty-eight percent commission cut. On a hot coffee that already costs money to pack in spill-proof cups, delivery orders don't build profit; they just run your staff ragged while keeping the delivery platform rich.",
        "tts_text": "But food delivery aggregators take a twenty-five to twenty-eight percent commission cut. On a hot coffee that already costs money to pack in spill-proof cups, delivery orders don't build profit; they just run your staff ragged while keeping the delivery platform rich.",
        "pause_s": 0.75
      }
    ]
  },
  {
    "scene_id": "scene_09",
    "voice_ref": "ref4",
    "cfg": 1.7,
    "lines": [
      {
        "id": "scene_09_s0",
        "text": "The math that keeps café owners awake at two in the morning is the daily opening burn.",
        "tts_text": "The math that keeps café owners awake at two in the morning is the daily opening burn.",
        "pause_s": 0.35
      },
      {
        "id": "scene_09_s1",
        "text": "Between base rent, minimum staff payroll, commercial refrigeration, and maintenance, your shop burns roughly four to five thousand rupees every single day before you unlock the front shutter. If nobody walks through that door by noon, you are in the red.",
        "tts_text": "Between base rent, minimum staff payroll, commercial refrigeration, and maintenance, your shop burns roughly four to five thousand rupees every single day before you unlock the front shutter. If nobody walks through that door by noon, you are in the red.",
        "pause_s": 0.80
      }
    ]
  },
  {
    "scene_id": "scene_10",
    "voice_ref": "ref_expressive_1",
    "cfg": 1.8,
    "lines": [
      {
        "id": "scene_10_s0",
        "text": "Here is the industry secret that veteran operators like Blue Tokai know: successful cafés don't survive on coffee. They survive on food.",
        "tts_text": "Here is the industry secret that veteran operators like Blue Tokai know: successful cafés don't survive on coffee. They survive on food.",
        "pause_s": 0.40
      },
      {
        "id": "scene_10_s1",
        "text": "Coffee brings people in the door, but beverages only account for forty-five percent of sales. Fresh food, artisanal sourdough, and breakfast bowls make up forty percent of revenue, with double the gross profit margin.",
        "tts_text": "Coffee brings people in the door, but beverages only account for forty-five percent of sales. Fresh food, artisanal sourdough, and breakfast bowls make up forty percent of revenue, with double the gross profit margin.",
        "pause_s": 0.75
      }
    ]
  },
  {
    "scene_id": "scene_11",
    "voice_ref": "ref4",
    "cfg": 1.7,
    "lines": [
      {
        "id": "scene_11_s0",
        "text": "That is why the smart operators skip the ego rent on 100 Feet Road and tuck themselves into a leafy side street in HSR Layout or Koramangala.",
        "tts_text": "That is why the smart operators skip the ego rent on one hundred feet road and tuck themselves into a leafy side street in H S R Layout or Kora-mungala.",
        "pause_s": 0.35
      },
      {
        "id": "scene_11_s1",
        "text": "Keeping your monthly rent strictly under fifteen percent of gross sales gives you the breathing room to build a genuine neighbourhood community without choking on overhead.",
        "tts_text": "Keeping your monthly rent strictly under fifteen percent of gross sales gives you the breathing room to build a genuine neighbourhood community without choking on overhead.",
        "pause_s": 0.75
      }
    ]
  },
  {
    "scene_id": "scene_12",
    "voice_ref": "ref_expressive_1",
    "cfg": 1.8,
    "lines": [
      {
        "id": "scene_12_s0",
        "text": "If you want to open a café in Bangalore, do not start with the interior design. Start with your cash reserve: keep nine to twelve months of operating runway in the bank, control your square footage, and treat unit economics like oxygen.",
        "tts_text": "If you want to open a café in Bangalore, do not start with the interior design. Start with your cash reserve: keep nine to twelve months of operating runway in the bank, control your square footage, and treat unit economics like oxygen.",
        "pause_s": 0.40
      },
      {
        "id": "scene_12_s1",
        "text": "Master the basics before the rent does. Next up: what happens when you try to open a full-service restaurant.",
        "tts_text": "Master the basics before the rent does. Next up: what happens when you try to open a full service restaurant.",
        "pause_s": 1.00
      }
    ]
  }
]
```
