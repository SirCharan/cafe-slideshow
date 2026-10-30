#!/usr/bin/env python3
"""
Upload Bangalore Cafe (V2 Flagship) Master Video to YouTube
- Video: out/BangaloreCafe_V2_Master.mp4 (104.7 MB, 1080p @ 30fps)
- Thumbnail: public/thumbnails/ep01_blueprint_cafe.png (Infographic Blueprint)
- Metadata: High-CTR challenge title, forensic P&L description, 25 tags
- Pinned Comment: Bangalore founder/techie discussion spark
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
VIDEO_FILE = ROOT / "out" / "BangaloreCafe_V2_Master.mp4"
THUMB_FILE = ROOT / "public" / "thumbnails" / "ep01_blueprint_cafe.png"

TITLE = "So You Want to Own a Bangalore Café? The Brutal P&L Behind Indie Coffee"

DESCRIPTION = """Is opening an aesthetic specialty coffee shop in Bangalore a peaceful dream... or a fast track to losing ₹1.5 Crore? 

In this episode, we break down the brutal unit economics of a 50-seater café in Indiranagar 100ft Road. We reveal why selling 120 artisan coffees a day barely covers your commercial diesel generator, why laptop squatters destroy your table turnover, and the secret reason why only B2B roasters actually survive.

📊 THE RAW MONTHLY P&L (50-SEATER CAFE):
- Indiranagar Master Lease: ₹4,50,000 / mo (Fixed)
- BESCOM Commercial Tariff + DG Genset: ₹1,80,000 / mo
- Head Barista + 3 Kitchen Staff: ₹1,60,000 / mo
- Specialty Coffee Beans & Oat Milk Spoilage: ₹95,000 / mo
- Table Turnover: 0.8x / day (vs. 4.5x for regular restaurants)
- Average Ticket Size: ₹280
- True Net Profit: -₹85,000 to +₹40,000 (Payback: 76 Months)

⏱️ CHAPTER TIMESTAMPS:
0:00 - The ₹1.5 Crore Indiranagar Dream
1:15 - The Seductive Math of a ₹220 Cold Brew
2:45 - The Fixed Cost Trap: High Street Rent & BESCOM Power
4:20 - The Laptop Squatter Paradox: 5 Hours, 1 Coffee
6:10 - The Hidden Leak: Artisanal Milk & Bean Spoilage
7:50 - The Real Winners: B2B Bean Wholesalers & Landlords
9:30 - The Final Verdict: When Does a Cafe Make Sense?

💬 WHAT TO WATCH NEXT:
- The ₹8 Crore Bangalore PG Empire: https://youtu.be/AXYMk7QtaXU
- The ₹350 Biryani Cloud Kitchen Illusion: [Episode 03]

#BangaloreCafe #UnitEconomics #StartupIndia #Indiranagar #SpecialtyCoffee #BusinessTeardown #NotAStartup
"""

TAGS = [
    "Bangalore cafe economics",
    "Indiranagar cafe business",
    "specialty coffee shop profit",
    "cost to open cafe in Bangalore",
    "cafe unit economics",
    "La Marzocco Bangalore cost",
    "BESCOM commercial electricity tariff",
    "laptop squatters cafe",
    "coffee shop profit margin India",
    "Third Wave Coffee business model",
    "Blue Tokai economics",
    "Bangalore commercial rent",
    "food business India",
    "restaurant failure rate Bangalore",
    "cafe profit and loss",
    "Not a Startup",
    "Paisa Decode",
    "business breakdown India",
    "Anurag Bansal teardown",
    "cafe franchise India",
    "commercial lease Indiranagar",
    "hospitality business math",
    "cold brew profit margin",
    "food and beverage startup India",
    "small business teardown"
]

PINNED_COMMENT = """If you're reading this while sitting in a Koramangala or Indiranagar café on your third hour of free Wi-Fi with one half-empty cold brew... no judgment, but the owner's electricity bill just cost more than your coffee. 😅 

Quick question for Bangalore founders: Would you pay a dedicated ₹150/hr 'co-working seat fee' at cafes if it guaranteed 200 Mbps Wi-Fi and silent zones, or is the free café vibe non-negotiable? Drop your thoughts below!"""

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
        print(f"❌ Error: client_secret.json not found at {CLIENT_SECRET}", file=sys.stderr)
        sys.exit(1)

    print("\n🌐 Starting local OAuth authentication on port 8085...")
    print("A browser window will open automatically for you to authorize your YouTube channel account.")
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)
    creds = flow.run_local_server(port=8085, prompt="consent", open_browser=True)
    TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
    TOKEN_PATH.write_text(creds.to_json())
    print(f"🎉 Successfully authenticated! Token saved to: {TOKEN_PATH}")
    return creds

def upload_to_youtube(privacy_status="unlisted"):
    if not VIDEO_FILE.exists():
        print(f"❌ Error: Video file not found at {VIDEO_FILE}", file=sys.stderr)
        sys.exit(1)
    if not THUMB_FILE.exists():
        print(f"❌ Error: Thumbnail file not found at {THUMB_FILE}", file=sys.stderr)
        sys.exit(1)

    print("🚀 Initializing YouTube Data API v3 Client...")
    creds = get_auth_credentials()
    yt = build("youtube", "v3", credentials=creds)

    # Sanitize description
    clean_desc = DESCRIPTION
    for a, b in (("<", " under "), (">", " over "), ("—", "-"), ("–", "-")):
        clean_desc = clean_desc.replace(a, b)

    # Sanitize tags strictly for YouTube API compliance
    clean_tags = []
    total_tag_chars = 0
    for t in TAGS:
        t_clean = "".join(c for c in t if c.isalnum() or c in " -").strip()
        if t_clean and (total_tag_chars + len(t_clean) + 1) < 400 and len(clean_tags) < 25:
            clean_tags.append(t_clean)
            total_tag_chars += len(t_clean) + 1

    body = {
        "snippet": {
            "title": TITLE[:100],
            "description": clean_desc[:4900],
            "tags": clean_tags,
            "categoryId": "27",  # Education
            "defaultLanguage": "en",
            "defaultAudioLanguage": "en",
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False,
        },
    }

    file_size_mb = VIDEO_FILE.stat().st_size / (1024 * 1024)
    print(f"📤 Uploading {VIDEO_FILE.name} ({file_size_mb:.1f} MB) as '{privacy_status}'...")

    media = MediaFileUpload(
        str(VIDEO_FILE), mimetype="video/mp4", resumable=True, chunksize=8 * 1024 * 1024
    )
    req = yt.videos().insert(part="snippet,status", body=body, media_body=media)

    resp = None
    while resp is None:
        status, resp = req.next_chunk()
        if status:
            progress = int(status.progress() * 100)
            print(f"  ⬆️ Upload progress: {progress}%")

    vid = resp["id"]
    video_url = f"https://youtu.be/{vid}"
    studio_url = f"https://studio.youtube.com/video/{vid}/edit"
    print(f"\n✅ Video Uploaded Successfully!")
    print(f"  Watch URL:  {video_url}")
    print(f"  Studio URL: {studio_url}")

    # Set Custom Thumbnail
    print(f"\n🖼️ Setting High-CTR Blueprint Custom Thumbnail ({THUMB_FILE.name})...")
    try:
        yt.thumbnails().set(
            videoId=vid,
            media_body=MediaFileUpload(str(THUMB_FILE), mimetype="image/png"),
        ).execute()
        print(f"✅ Blueprint Thumbnail set successfully!")
    except Exception as e:
        print(f"⚠️ Warning: Could not set thumbnail via API: {e}")

    # Post Top-Level Pinned Discussion Comment
    print("\n💬 Posting Pinned Discussion Comment...")
    try:
        yt.commentThreads().insert(
            part="snippet",
            body={
                "snippet": {
                    "videoId": vid,
                    "topLevelComment": {
                        "snippet": {
                            "textOriginal": PINNED_COMMENT
                        }
                    }
                }
            }
        ).execute()
        print(f"✅ Pinned Discussion Comment posted successfully!")
    except Exception as e:
        print(f"⚠️ Note on comment: {e}")

    # Save Upload Ledger Record
    out_meta = ROOT / "out" / "upload_ledger_bangalore_cafe_v2.json"
    with open(out_meta, "w") as f:
        json.dump({
            "video_id": vid,
            "title": TITLE,
            "privacy": privacy_status,
            "watch_url": video_url,
            "studio_url": studio_url,
            "file": str(VIDEO_FILE),
            "thumbnail": str(THUMB_FILE),
            "uploaded_at": str(resp.get("snippet", {}).get("publishedAt", ""))
        }, f, indent=2)

    print("\n" + "="*60)
    print("🎉 RELEASE DEPLOYMENT COMPLETE!")
    print(f"Video is live on YouTube at: {video_url}")
    print("="*60)

if __name__ == "__main__":
    privacy = sys.argv[1] if len(sys.argv) > 1 else "unlisted"
    upload_to_youtube(privacy)
