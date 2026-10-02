#!/usr/bin/env python3
"""
Update SEO metadata and post a discussion comment on Episode 02:
https://youtu.be/AXYMk7QtaXU
"""

import os
import sys
from googleapiclient.discovery import build

sys.path.insert(0, "/Users/ck/claude/misterfinance-research/factory/youtube")
from auth import get_credentials

VIDEO_ID = "AXYMk7QtaXU"

SEO_TITLE = "The Brutal Economics of Bangalore PG Hostels | Why Owners Are Secretly Bleeding (Real Numbers)"

SEO_TAGS = [
    "Bangalore PG Hostels",
    "PG business Bangalore",
    "PG hostel unit economics",
    "PG owner profit",
    "Marathahalli PG",
    "BTM Layout PG",
    "HSR Layout PG",
    "Kundanahalli PG",
    "Bangalore rent reality",
    "commercial master lease",
    "BESCOM commercial electricity",
    "summer water tanker crisis",
    "co-living Bangalore",
    "Zolo Stays",
    "Stanza Living",
    "Colive Bangalore",
    "Not a Startup",
    "Paisa Decode",
    "unit economics explained",
    "Bangalore techie expenses",
    "hostel business profit margin"
]

SEO_DESCRIPTION = """Every software engineer moving to Bangalore eventually walks past a four-storey building in Marathahalli, BTM Layout, or Kundanahalli, wrapped in bright vinyl banners promising "3 Times Food, High-Speed Wi-Fi & Luxury Living."

When you pay ₹12,000 for a cramped triple-sharing room and see the owner sitting in the lobby with a gold chain, it looks like an effortless money printer.

A 20-room building with 60 beds collects ₹6,60,000 every single month in gross tenant cash. But here is the brutal unit economics breakdown of where that money actually goes, and why 90% of outsiders completely misunderstand how the PG business works in Bangalore.

TIMESTAMPS:
00:00 - The Bangalore PG Illusion (Marathahalli & BTM)
00:27 - The 60-Bed Napkin Math (₹6,60,000 Gross Run Rate)
00:43 - The Master-Lease Lockup (₹28,00,000 Deposit Frozen at 0%)
01:04 - The ₹18.5L Unrecoverable Fitout Capex
01:25 - 8:00 AM Geyser BESCOM Power Surge (₹45,000/mo Power Bill)
01:49 - The Cabbage & Watery Sambar Math (Strictly ₹90/Day/Head)
02:13 - The Summer Water Tanker Crisis (10,000L Daily Bleed)
02:32 - The Midnight Runaway Techie & Deposit Forfeiture
02:50 - The Ruthless 68% Break-Even Floor (41 Beds Minimum)
03:12 - Dissecting the ₹11,000 Bed (Where Every Single Rupee Goes)
03:37 - The Insider Playbook: Sub-Metering & Single AC Suites
04:00 - Scale or Perish (The 100-Bed Cluster Rule)

UNIT ECONOMICS OF AN ₹11,000 BED:
• Building Master Lease (Landlord): ₹4,700 (42.7%)
• Food & Kitchen Cook Wages: ₹2,700 (24.5%)
• BESCOM Power & Water Tankers: ₹1,100 (10.0%)
• Housekeeping, Wi-Fi & Maintenance: ₹900 (8.2%)
• True Net Operating Profit: ₹1,600 / Bed (14.5%)

KEY TAKEAWAYS FOR ENTREPRENEURS & TENANTS:
1. PG operators almost never own the concrete building—they pay massive commercial leases and lock ₹25L–₹30L in dead security deposits.
2. Three times food is capped at ₹90/day per person to stay solvent, which is why wholesale cabbage and watery sambar dominate the menu.
3. Standalone 30-bed PGs are an operational death trap. Viable net profit only unlocks at 80–100 beds across multi-building clusters where central kitchens amortize overhead.

#Bangalore #RealEstate #UnitEconomics #PGBusiness #NotAStartup #BangaloreStartups #PersonalFinanceIndia #CoLiving
"""

DISCUSSION_COMMENT = """Pinned Discussion 👇
For anyone currently staying in a PG in Marathahalli, BTM Layout, HSR, or Kundanahalli:
1. How much monthly rent are you paying (1-sharing, 2-sharing, or 3-sharing)?
2. Does your PG owner charge separate electricity via a sub-meter, or is it included in the rent?
3. How is the food quality (cabbage & watery sambar rating out of 10)?

Drop your area and monthly rent below! Let's map Bangalore's true PG market in the comments.

Timestamps:
00:00 - The Bangalore PG Illusion
00:27 - 60-Bed Napkin Math (₹6.6L Gross)
00:43 - Commercial Master Lease & ₹28L Deposit Lockup
01:04 - The ₹18.5L Unrecoverable Fitout Capex
01:25 - 8:00 AM Geyser Load Spike (₹45,000 BESCOM Bill)
01:49 - The Cabbage & Watery Sambar Math (₹90/Day Food)
02:13 - The Summer Water Tanker Crisis
02:32 - The Midnight Runaway Tenant
02:50 - The 68% Break-Even Floor (41 Beds)
03:12 - Dissecting the ₹11,000 Bed (Where Every Rupee Goes)
03:37 - The Sub-Metering & Single AC Suite Secret
04:00 - Scale or Perish (The 100-Bed Cluster Rule)"""

def main():
    print(f"Connecting to YouTube API for Video: {VIDEO_ID}...")
    creds = get_credentials()
    yt = build("youtube", "v3", credentials=creds)

    # 1. Update Video Snippet (SEO Title, Description, Tags)
    print("Fetching current video snippet...")
    v_res = yt.videos().list(part="snippet,status", id=VIDEO_ID).execute()
    if not v_res.get("items"):
        print(f"Error: Video {VIDEO_ID} not found.")
        sys.exit(1)

    video = v_res["items"][0]
    snippet = video["snippet"]

    snippet["title"] = SEO_TITLE
    snippet["description"] = SEO_DESCRIPTION
    snippet["tags"] = SEO_TAGS
    snippet["categoryId"] = "27"  # Education

    print("Updating video metadata with high-SEO keywords & tags...")
    update_res = yt.videos().update(
        part="snippet",
        body={"id": VIDEO_ID, "snippet": snippet}
    ).execute()
    print(f"✓ Video metadata updated! Title: {update_res['snippet']['title']}")

    # 2. Insert Top-Level Discussion Comment
    print("\nPosting top-level discussion comment...")
    comment_body = {
        "snippet": {
            "videoId": VIDEO_ID,
            "topLevelComment": {
                "snippet": {
                    "textOriginal": DISCUSSION_COMMENT
                }
            }
        }
    }
    comment_res = yt.commentThreads().insert(
        part="snippet",
        body=comment_body
    ).execute()
    comment_id = comment_res["id"]
    print(f"✓ Comment posted successfully! Comment ID: {comment_id}")
    print(f"View video: https://youtu.be/{VIDEO_ID}")

if __name__ == "__main__":
    main()
