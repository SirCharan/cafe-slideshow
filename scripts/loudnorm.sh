#!/usr/bin/env bash
# Two-pass ffmpeg loudnorm (EBU R128): I=-14 LUFS, TP=-1.5 dBTP, LRA=11.
# Video stream is copied untouched; audio is re-encoded to AAC 192k.
#
# Usage: scripts/loudnorm.sh <in.mp4> [out.mp4]
#   out.mp4 defaults to <in>.norm.mp4

set -euo pipefail

IN="${1:-}"
if [ -z "$IN" ]; then
  echo "usage: scripts/loudnorm.sh <in.mp4> [out.mp4]" >&2
  exit 1
fi
if [ ! -f "$IN" ]; then
  echo "input not found: $IN" >&2
  exit 1
fi

BASE="${IN%.*}"
OUT="${2:-${BASE}.norm.mp4}"

I_TARGET="-14"
TP_TARGET="-1.5"
LRA_TARGET="11"

echo "== pass 1: measuring loudness =="
PASS1_LOG="$(mktemp)"
trap 'rm -f "$PASS1_LOG"' EXIT

ffmpeg -y -i "$IN" \
  -af "loudnorm=I=${I_TARGET}:TP=${TP_TARGET}:LRA=${LRA_TARGET}:print_format=json" \
  -f null - 2> "$PASS1_LOG"

# loudnorm prints one JSON object to stderr; grab the last {...} block.
JSON="$(awk '/^\{/{flag=1} flag{print} /^\}/{flag=0}' "$PASS1_LOG" | tail -40)"
if [ -z "$JSON" ]; then
  echo "could not parse loudnorm measurement from pass 1" >&2
  cat "$PASS1_LOG" >&2
  exit 1
fi

JSON_FILE="$(mktemp)"
trap 'rm -f "$PASS1_LOG" "$JSON_FILE"' EXIT
printf '%s' "$JSON" > "$JSON_FILE"

if command -v node >/dev/null 2>&1; then
  PARSED="$(node -e '
    const fs = require("fs");
    const j = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    console.log([j.input_i, j.input_tp, j.input_lra, j.input_thresh, j.target_offset].join(" "));
  ' "$JSON_FILE")"
else
  PARSED="$(python3 -c '
import json, sys
j = json.load(open(sys.argv[1]))
print(j["input_i"], j["input_tp"], j["input_lra"], j["input_thresh"], j["target_offset"])
' "$JSON_FILE")"
fi

read -r MEASURED_I MEASURED_TP MEASURED_LRA MEASURED_THRESH TARGET_OFFSET <<< "$PARSED"

echo "measured: I=${MEASURED_I} TP=${MEASURED_TP} LRA=${MEASURED_LRA} thresh=${MEASURED_THRESH} offset=${TARGET_OFFSET}"

echo "== pass 2: applying linear normalization =="
ffmpeg -y -i "$IN" \
  -c:v copy \
  -af "loudnorm=I=${I_TARGET}:TP=${TP_TARGET}:LRA=${LRA_TARGET}:measured_I=${MEASURED_I}:measured_TP=${MEASURED_TP}:measured_LRA=${MEASURED_LRA}:measured_thresh=${MEASURED_THRESH}:offset=${TARGET_OFFSET}:linear=true:print_format=summary" \
  -c:a aac -b:a 192k \
  "$OUT"

echo "wrote $OUT"
