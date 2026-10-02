#!/usr/bin/env bash
# Master render pipeline for Episode 03: Bangalore Cloud Kitchens
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p out

RAW_OUT="out/cloud_kitchen_raw.mp4"
MASTER_OUT="out/cloud_kitchen_master.mp4"

echo "=== STEP 1: Rendering CloudKitchenEpisodeV1 via Remotion ==="
npx remotion render CloudKitchenEpisodeV1 "$RAW_OUT" --concurrency=4

echo "=== STEP 2: Loudness Normalization to -14.0 LUFS (EBU R128) ==="
./scripts/loudnorm.sh "$RAW_OUT" "$MASTER_OUT"

echo "=== STEP 3: Running Broadcast Quality Ship Gates ==="
./scripts/check-gates.sh "$MASTER_OUT" 325

echo "=== Done! Master broadcast file ready at: $MASTER_OUT ==="
