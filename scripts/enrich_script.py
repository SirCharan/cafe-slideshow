import json

with open("data/slides.json") as f:
    slides = json.load(f)

# Define voice direction, emotion and pause duration for each chapter
tones = {
    "b01": ("Inviting, reflective hook with subtle irony", "Conversational storyteller", "Gentle, measured (140 wpm)", "Start with romantic optimism. Gradually reveal the laptop-camper irony at the end of the beat."),
    "b02": ("Sober reality check, piercing the weekend rush fantasy", "Analytical, cautionary", "Deliberate, grounded (142 wpm)", "Drop pitch and speed. Break the illusion of social media survivorship bias."),
    "b03": ("Framing the unit economics and architectural scope", "Architectural, factual", "Structured, objective (146 wpm)", "Clear boundaries. Anchor the 600-1000 sqft format so audience knows the model scope."),
    "b04": ("Owner-operator discipline versus corporate scale", "Pragmatic mentor", "Warm, hands-on (144 wpm)", "Contrast indie operator dedication with VC chain models."),
    "b05": ("Operator wisdom from veterans", "Expert debrief", "Authoritative, measured (145 wpm)", "Cite Nikhil Kamath restaurant game learnings. Warn against space bloat."),
    "b06": ("Bangalore street survey across the 4 micro-markets", "Market explorer", "Dynamic, geographic (148 wpm)", "Take the viewer on a street walk through Bangalore dining pockets."),
    "b07": ("Unveiling real audited numbers from founders", "Case study reveal", "Intrigued, documentary (142 wpm)", "Highlight Wint Wealth case study. Ground truth from actual founders."),
    "b08": ("The capex reality shock: planned budget vs actual spend", "Forensic, candid", "Precise financial breakdown (140 wpm)", "The classic entrepreneur mistake: 50% budget overshoot."),
    "b09": ("The full commercial budget spectrum in Bangalore", "Pragmatic financial planner", "Stepped financial tiers (144 wpm)", "Differentiate between bare minimum entry and high-spec builds."),
    "b10": ("High-street glamour versus side-street survival", "Advisory mentor", "Strategic tradeoff analysis (145 wpm)", "Advocate for low overhead over prime ego leases."),
    "b11": ("The Bangalore landlord rental deposit lockup", "Negotiation warning", "Emphatic, firm (142 wpm)", "Warn about dead capital locked in deposits before opening day."),
    "b12": ("The golden 15% rent benchmark rule", "Benchmark law", "Measured mathematical rule (142 wpm)", "The most important financial ratio in the entire deck."),
    "b13": ("Navigating the bureaucratic regulatory stack", "Compliance runbook", "Crisp checklist clarity (150 wpm)", "Deliver like an operational checklist. Keep it brisk and clean."),
    "b14": ("Lean overhead case: keeping monthly burn under control", "Operational validation", "Optimistic, encouraging (145 wpm)", "Show that lean operations can be profitable from Month 2."),
    "b15": ("Core P&L laws: 30% COGS and 15% staff salaries", "Financial principle", "Deliberate, pedagogical (142 wpm)", "Enunciate the two fundamental percentage ceilings clearly."),
    "b16": ("The hidden cost leaks: AC electricity and Swiggy cuts", "Forensic revelation", "Alert, analytical (146 wpm)", "Expose the two silent cash drainers: power tariffs and delivery cuts."),
    "b17": ("The menu mix secret: coffee doesn't pay the rent", "Industry truth", "Surprising, counter-intuitive (142 wpm)", "Break down Blue Tokai actual revenue mix. Fresh food is essential."),
    "b18": ("David vs Goliath: indie warmth vs funded chain scale", "Strategic positioning", "Warm, inspiring (145 wpm)", "Empower the indie founder. Do not compete on VC scale; compete on hospitality."),
    "b19": ("The 5-point pre-lease decision checklist", "Final gatekeeper", "Strict, disciplined (140 wpm)", "A strict warning list before anyone signs a commercial lease."),
    "b20": ("Grand conclusion and transition to next episode", "Closing summation", "Resolute, concluding (144 wpm)", "Summarize the ground-truth philosophy. Tease the restaurant episode.")
}

for s in slides:
    bid = s["id"]
    vibe, tone, pacing, director_note = tones.get(bid, ("Clear explanation", "Objective", "Normal", "Deliver clearly"))
    sentences = s.get("sentences", [])
    sentence_timings = s.get("sentence_timings", [])
    
    script_items = []
    for i, sent in enumerate(sentences):
        dur = sentence_timings[i]["duration"] if i < len(sentence_timings) else 2.5
        pause = 0.7 if i == len(sentences) - 1 else 0.38
        
        # Expression keywords
        expr = "Narrative"
        if i == 0:
            expr = "Opening premise / Engaging"
        elif i == len(sentences) - 1:
            expr = "Conclusion / Emphatic"
        elif any(w in sent.lower() for w in ["cost", "rent", "lakh", "crore", "deposit", "percent"]):
            expr = "Serious / Data Emphasis"
        elif any(w in sent.lower() for w in ["loss", "crowded", "quiet", "dispute", "risk", "shock"]):
            expr = "Cautionary / Serious"
        else:
            expr = "Conversational / Flow"

        script_items.append({
            "sentence_idx": i,
            "text": sent,
            "duration_s": round(dur, 2),
            "pause_s": pause,
            "expression": expr
        })
        
    s["video_script"] = {
        "chapter_vibe": vibe,
        "tone": tone,
        "pacing": pacing,
        "director_note": director_note,
        "script_lines": script_items
    }

with open("data/slides.json", "w") as f:
    json.dump(slides, f, indent=2)

print("Enriched data/slides.json successfully with full video scripts, pauses, and expressions!")
