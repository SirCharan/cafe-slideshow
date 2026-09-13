# Prompts for Other AI Models (Claude, ChatGPT, o1, Gemini) to Refine Slides

Use these prompt templates with other AI models to systematically level up the quality, density, visual design, and data rigor of each slide.

---

### 1. Slide-by-Slide Polish Prompt (Copy & Paste)

```markdown
I have built an interactive web slideshow on Next.js/Tailwind for our YouTube channel "Not a Startup", breaking down the ground-truth unit economics of "The Economics of Owning a Café in Bangalore".

Here is the JSON data for Slide #[X]:

```json
[PASTE SLIDE JSON FROM THE CODE MODAL ON CAFE-SLIDESHOW.VERCEL.APP]
```

Please act as a top-tier financial researcher and executive presentation designer (inspired by Patrick Collison / Stripe / Linear / benchmark financial teardowns).

Improve this slide by giving me:
1. **Headline:** A punchier, high-signal headline (under 7 words).
2. **Category Chip:** Concise 2-word micro-market tag.
3. **Key Takeaways (Bullets):** 4 to 5 sharp, concrete data points with real numbers (INR costs, margins, square footage, deposit months, Bangalore micro-markets like Indiranagar, Koramangala, HSR Layout, Whitefield).
4. **Visual Direction:** The best graphical format to represent this (e.g. Waterfall chart, Donut split, Comparison matrix, Gauge meter, or Polaroid photo).
5. **Exact Output:** Return the revised slide object in the exact same JSON format so I can paste it into the editor and hit "Apply Changes".
```

---

### 2. Full Deck Narrative Overhaul Prompt

```markdown
Review the complete 20-slide dataset from our Bangalore Café unit economics breakdown:
GitHub: https://github.com/SirCharan/cafe-slideshow/blob/master/data/slides.json
Live Web Deck: https://cafe-slideshow.vercel.app

Analyze the narrative arc across the 6 modules:
1. The Idea vs Reality (Ch 1-4)
2. Location & Micro-markets (Ch 5-6)
3. The Setup Capex Breakdown (Ch 7-10)
4. Leases & Statutory Compliance (Ch 11-13)
5. Unit Economics & Margins (Ch 14-17)
6. The Reality Check & Verdict (Ch 18-20)

Recommend:
- Any missing financial leaks (e.g., grease trap maintenance, Zomato/Swiggy packaging losses, music licensing PPL/IPRS, power backup DG fuel).
- High-contrast visual upgrades for the web UI.
```
