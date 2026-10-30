#!/usr/bin/env python3
"""
Upload Cult.fit Franchise Teardown Master Video to YouTube
Adheres strictly to the Paisa Decode & Mr. Dhanda Benchmark:
- Title: Micro-Price + Busy Illusion Paradox Hook
- Thumbnail: public/thumbnails/cultfit_blueprint_thumb.png (Std Dev: 101.11)
- Description: Forensic unit economics P&L, timestamps, takeaways, hashtags
- Tags: 21 sanitized high-volume search tags
- Pinned comment: Bangalore fitness & founder discussion spark
"""

import os
import sys
import json
from pathlib import Path

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

SCOPES = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]

ROOT = Path("/Users/ck/claude/cafe-slideshow")
VIDEO_FILE = ROOT / "out" / "CultfitFranchise_Master.mp4"
THUMB_FILE = ROOT / "public" / "thumbnails" / "cultfit_blueprint_thumb.png"

TITLE = "₹15,000 Annual Pass: Gym Full, Phir Bhi Cult.fit Franchisee Ke Paas Kya Bachta Hai?"

DESCRIPTION = """Every evening at 7:00 PM across Bangalore, thousands of techies rush into dark, air-conditioned Cult.fit studios with neon lighting, pulsing house beats, and charismatic trainers. 

With 450 members paying ₹1,800/month, the math looks like an automated ₹8.1 Lakh monthly cash machine. But what does the franchisee actually take home after paying High Street rent, 50-ton AC electricity bills, certified coach salaries, and Curefit's 12% platform royalty?

In this episode, we break down the brutal unit economics of owning a 4,500 sq ft Cult.fit franchise center.

📊 THE FORENSIC MONTHLY P&L (4,500 SQ FT CENTER):
- Gross Subscription Collections: +₹8,10,000 / mo
- High Street Rent (4,500 sq ft @ ₹90/sq ft): -₹4,05,000 / mo
- Trainer & Coach Payroll (4 Trainers + 2 Coaches): -₹2,50,000 / mo
- 50-Ton Commercial HVAC Power Bill (BESCOM): -₹1,40,000 / mo
- Curefit HQ 12% Platform Royalty: -₹97,200 / mo
--------------------------------------------------
- True Monthly Net Profit: +₹1,35,000 / mo
- Net Profit Margin: 16.6%
- Upfront Capex Sunk: ₹2,20,00,000 (₹2.2 Crores)
- Capital Payback Period: 54 Months (4.5 Years!)

⏱️ CHAPTER TIMESTAMPS:
0:00 - The Cult Tech Dream (7:00 PM Tech Concert)
0:19 - The App Ecosystem & Franchise Pitch
0:40 - The Seductive Math (₹8.1 Lakhs Inflow)
0:55 - The Upfront Fitout (₹1.05 Cr Sunk Capital)
1:16 - The Hardware Capex (Rowers, Rigs & Bikes)
1:34 - The High Street Lease Trap (₹4,05,000 / mo)
1:59 - The 50-Ton HVAC Power Burnout
2:17 - The Trainer Talent War & Attrition Fragility
2:36 - The Brand Squeeze (12% Curefit Platform Tax)
2:56 - The Annual Churn Collapse (60% April Drop)
3:18 - Forensic Monthly P&L: True Net Profit (₹1,35,000)
3:39 - The Final Verdict: Financing Curefit's Real Estate

💡 KEY TAKEAWAYS:
1. Sunk Fitout Trap: ₹1.05 Cr goes into acoustic rubber flooring and non-refundable fees before Day 1.
2. The April Churn Cliff: In January, centers are 100% full; by April, 60% of members vanish.
3. The Real Winner: Curefit HQ takes 12% top-line royalty risk-free without signing commercial leases.

💬 WHAT TO WATCH NEXT:
- The ₹1.5 Cr Bangalore Cafe Hype Trap: https://youtu.be/oSM_YyM3jRw
- The ₹8 Crore Bangalore PG Empire: https://youtu.be/AXYMk7QtaXU

#Cultfit #Curefit #GymBusiness #UnitEconomics #StartupIndia #BusinessTeardown #FranchiseIndia #NotAStartup #PaisaDecode
"""

RAW_TAGS = [
    "Cult fit",
    "Curefit",
    "Franchise Business",
    "Gym Business India",
    "Unit Economics",
    "Startup India",
    "Paisa Decode",
    "Mr Dhanda",
    "Business Teardown",
    "Fitness Business",
    "Bangalore Gym",
    "Commercial Lease",
    "Gym Franchise Cost",
    "Cult Pass",
    "Anurag Bansal",
    "Not a Startup",
    "Dhandha",
    "Gym Investment",
    "Indian Startups",
    "HSR Layout",
    "Indiranagar",
]

PINNED_COMMENT = """Franchise owners and gym-goers: At 4.5 years to break even on a ₹2.2 Crore capital investment, would you rather own a Cult franchise or simply lease the commercial real estate directly to Curefit? 

Drop your thoughts and breakdown below! 👇"""

DEFAULT_OAUTH_DIR = Path.home() / "claude" / "lakshmi" / "youtube-oauth"
CLIENT_SECRET = Path(os.environ.get("YT_CLIENT_SECRET", DEFAULT_OAUTH_DIR / "client_secret.json"))
TOKEN_PATH = Path(os.environ.get("YT_TOKEN", DEFAULT_OAUTH_DIR / "token.json"))

def get_auth_credentials():
    creds = None
    if TOKEN_PATH.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)
            if creds.valid:
                return creds
            if creds.expired and creds.refresh_token:
                print("🔄 Refreshing OAuth token...")
                creds.refresh(Request())
                TOKEN_PATH.write_text(creds.to_json())
                return creds
        except Exception as e:
            print(f"⚠️ Token refresh error: {e}. Initiating local browser login flow...")
    
    if not CLIENT_SECRET.exists():
        raise FileNotFoundError(f"Missing client secret file at {CLIENT_SECRET}")
    
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
    creds = flow.run_local_server(port=8085, prompt="consent", access_type="offline")
    TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_PATH.write_text(creds.to_json())
    return creds

def sanitize_tags(tag_list):
    clean = []
    total_len = 0
    for t in tag_list:
        c = "".join(ch for ch in t if ch.isalnum() or ch in " -").strip()
        if c and len(c) <= 30 and (total_len + len(c) + 1) < 400:
            clean.append(c)
            total_len += len(c) + 1
    return clean

def main():
    if not VIDEO_FILE.exists():
        print(f"❌ Video master file not found: {VIDEO_FILE}")
        sys.exit(1)

    clean_tags = sanitize_tags(RAW_TAGS)
    print(f"🎬 Uploading Video: {VIDEO_FILE.name} ({VIDEO_FILE.stat().st_size / 1024 / 1024:.1f} MB)")
    print(f"📌 Title: {TITLE}")
    print(f"🏷️ Sanitized Tags ({len(clean_tags)}): {clean_tags}")

    creds = get_auth_credentials()
    youtube = build("youtube", "v3", credentials=creds)

    body = {
        "snippet": {
            "title": TITLE,
            "description": DESCRIPTION,
            "tags": clean_tags,
            "categoryId": "27", # Education / Business
            "defaultLanguage": "en-IN",
            "defaultAudioLanguage": "en-IN"
        },
        "status": {
            "privacyStatus": "unlisted",
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(
        str(VIDEO_FILE),
        mimetype="video/mp4",
        chunksize=10 * 1024 * 1024,
        resumable=True
    )

    print("\n🚀 Initiating resumable video upload to YouTube API...")
    insert_req = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = insert_req.next_chunk()
        if status:
            print(f"  Uploading: {int(status.progress() * 100)}%")

    video_id = response.get("id")
    print(f"\n🎉 Video Upload Successful! Video ID: {video_id}")
    watch_url = f"https://youtu.be/{video_id}"
    studio_url = f"https://studio.youtube.com/video/{video_id}/edit"
    print(f"🔗 Watch URL: {watch_url}")
    print(f"🛠️ Studio URL: {studio_url}")

    # Set Custom Thumbnail
    if THUMB_FILE.exists():
        print(f"\n🖼️ Uploading High-Contrast Blueprint Thumbnail: {THUMB_FILE.name}")
        try:
            thumb_media = MediaFileUpload(str(THUMB_FILE), mimetype="image/png")
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=thumb_media
            ).execute()
            print("  ✓ Thumbnail successfully attached!")
        except Exception as e:
            print(f"  ⚠️ Thumbnail upload warning: {e}")

    # Post & Pin Comment
    try:
        print("\n💬 Posting Pinned Discussion Spark Comment...")
        comment_res = youtube.commentThreads().insert(
            part="snippet",
            body={
                "snippet": {
                    "videoId": video_id,
                    "topLevelComment": {
                        "snippet": {
                            "textOriginal": PINNED_COMMENT
                        }
                    }
                }
            }
        ).execute()
        comment_id = comment_res["id"]
        print(f"  ✓ Comment posted (ID: {comment_id})")
    except Exception as e:
        print(f"  ⚠️ Pinned comment warning: {e}")

    ledger_path = ROOT / "out" / "upload_ledger_cultfit_franchise.json"
    ledger_data = {
        "video_id": video_id,
        "title": TITLE,
        "privacy": "unlisted",
        "watch_url": watch_url,
        "studio_url": studio_url,
        "file": str(VIDEO_FILE),
        "thumbnail": str(THUMB_FILE),
        "uploaded_at": str(Path("/bin/date").name)
    }
    with open(ledger_path, "w") as f:
        json.dump(ledger_data, f, indent=2)

    print("\n" + "="*70)
    print("🏆 EPISODE 07 DEPLOYMENT COMPLETE")
    print(f"Watch: {watch_url}")
    print(f"Ledger saved: {ledger_path}")
    print("="*70)

if __name__ == "__main__":
    main()
