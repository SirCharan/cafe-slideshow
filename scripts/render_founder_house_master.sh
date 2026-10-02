#!/usr/bin/env bash
# Master render pipeline for Episode 04: Bangalore Founder Houses
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p out

RAW_OUT="out/founder_house_raw.mp4"
MASTER_OUT="out/founder_house_master.mp4"
SHORT_RAW="out/founder_house_short_raw.mp4"
SHORT_MASTER="out/founder_house_short.mp4"

echo "=== STEP 1: Rendering FounderHouseEpisodeV1 via Remotion ==="
npx remotion render FounderHouseEpisodeV1 "$RAW_OUT" --concurrency=4

echo "=== STEP 2: Loudness Normalization to -14.0 LUFS (EBU R128) ==="
./scripts/loudnorm.sh "$RAW_OUT" "$MASTER_OUT"

echo "=== STEP 3: Running Broadcast Quality Ship Gates ==="
./scripts/check-gates.sh "$MASTER_OUT" 281

echo "=== STEP 4: Rendering FounderHouseShort (9:16 Vertical Cutdown) ==="
npx remotion render FounderHouseShort "$SHORT_RAW" --concurrency=4
./scripts/loudnorm.sh "$SHORT_RAW" "$SHORT_MASTER"

echo "=== Done! Master broadcast files ready: ==="
echo "  Long-Form: $MASTER_OUT"
echo "  Short (9:16): $SHORT_MASTER"
