import os
import sys
import subprocess
from pathlib import Path
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.force-ssl",
]

DEFAULT_DIR = Path.home() / "claude" / "lakshmi" / "youtube-oauth"
CLIENT_SECRET = Path(os.environ.get("YT_CLIENT_SECRET", DEFAULT_DIR / "client_secret.json"))
TOKEN_PATH = Path(os.environ.get("YT_TOKEN", DEFAULT_DIR / "token.json"))

print(f"Loading client secrets from: {CLIENT_SECRET}")
flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET), SCOPES)

print("\nStarting local server on port 8085...")
print("A browser window will open automatically for you to authorize your YouTube channel account.")
print("If the browser does not open automatically, visit the URL printed below.\n")

# Use run_local_server on fixed port 8085
creds = flow.run_local_server(port=8085, prompt="consent", open_browser=True)

TOKEN_PATH.parent.mkdir(parents=True, exist_ok=True)
TOKEN_PATH.write_text(creds.to_json())
print(f"\n🎉 Successfully authenticated! Token saved to: {TOKEN_PATH}")
