#!/usr/bin/env bash
# Ship gates for a rendered episode mp4. Prints PASS/FAIL per gate; exits 1 if
# any gate fails.
#
# Usage: scripts/check-gates.sh <mp4> [expected_seconds]

set -uo pipefail

MP4="${1:-}"
EXPECTED_SECONDS="${2:-}"

if [ -z "$MP4" ]; then
  echo "usage: scripts/check-gates.sh <mp4> [expected_seconds]" >&2
  exit 1
fi
if [ ! -f "$MP4" ]; then
  echo "input not found: $MP4" >&2
  exit 1
fi

FAIL=0

pass() { echo "PASS: $1"; }
fail() { echo "FAIL: $1"; FAIL=1; }

# --- resolution + fps ---
RES_FPS="$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate \
  -of csv=p=0 "$MP4")"
WIDTH="$(echo "$RES_FPS" | cut -d, -f1)"
HEIGHT="$(echo "$RES_FPS" | cut -d, -f2)"
RFRAME="$(echo "$RES_FPS" | cut -d, -f3)"
FPS="$(node -e "const [n,d]=process.argv[1].split('/').map(Number); console.log((n/(d||1)).toFixed(3))" "$RFRAME" 2>/dev/null || echo "$RFRAME")"

if [ "$WIDTH" = "1920" ] && [ "$HEIGHT" = "1080" ]; then
  pass "resolution 1920x1080"
else
  fail "resolution ${WIDTH}x${HEIGHT} (expected 1920x1080)"
fi

FPS_ROUND="$(printf '%.0f' "$FPS" 2>/dev/null || echo "0")"
if [ "$FPS_ROUND" = "30" ]; then
  pass "frame rate ${FPS} fps"
else
  fail "frame rate ${FPS} fps (expected 30)"
fi

# --- codecs ---
VCODEC="$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$MP4" | tr -d ' \t\r\n,')"
ACODEC="$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=nw=1:nk=1 "$MP4" | tr -d ' \t\r\n,')"

if [ "$VCODEC" = "h264" ]; then
  pass "video codec h264"
else
  fail "video codec $VCODEC (expected h264)"
fi

if [ "$ACODEC" = "aac" ]; then
  pass "audio codec aac"
else
  fail "audio codec $ACODEC (expected aac)"
fi

# --- integrated loudness within -14 +/- 2 LUFS ---
EBUR_LOG="$(mktemp)"
trap 'rm -f "$EBUR_LOG"' EXIT
ffmpeg -nostats -i "$MP4" -af ebur128=peak=true -f null - 2> "$EBUR_LOG"
INTEGRATED="$(grep -A2 "Integrated loudness" "$EBUR_LOG" | grep "I:" | awk '{print $2}')"

if [ -n "$INTEGRATED" ]; then
  IN_RANGE="$(awk -v v="$INTEGRATED" 'BEGIN{print (v >= -16 && v <= -12) ? 1 : 0}')"
  if [ "$IN_RANGE" = "1" ]; then
    pass "integrated loudness ${INTEGRATED} LUFS (within -14 +/-2)"
  else
    fail "integrated loudness ${INTEGRATED} LUFS (outside -14 +/-2)"
  fi
else
  fail "could not measure integrated loudness"
fi

# --- leading silence < 0.5s (first 3s, noise floor -40dB) ---
SIL_LOG="$(mktemp)"
trap 'rm -f "$EBUR_LOG" "$SIL_LOG"' EXIT
ffmpeg -nostats -i "$MP4" -t 3 -af "silencedetect=noise=-40dB:d=0.05" -f null - 2> "$SIL_LOG"
LEAD_SIL_END="$(grep -o "silence_end: [0-9.]*" "$SIL_LOG" | head -1 | awk '{print $2}')"
LEAD_SIL_START="$(grep -o "silence_start: [0-9.]*" "$SIL_LOG" | head -1 | awk '{print $2}')"

if [ -z "$LEAD_SIL_START" ] || [ "$(awk -v v="$LEAD_SIL_START" 'BEGIN{print (v>0.05)?1:0}')" = "1" ]; then
  # speech is present from the first frame; any detected silence is a natural pause, not lead-in
  pass "leading silence: none (speech starts at 0s${LEAD_SIL_START:+, first pause at ${LEAD_SIL_START}s})"
else
  LEAD_OK="$(awk -v v="$LEAD_SIL_END" 'BEGIN{print (v<0.5)?1:0}')"
  if [ "$LEAD_OK" = "1" ]; then
    pass "leading silence ${LEAD_SIL_END}s (< 0.5s)"
  else
    fail "leading silence ${LEAD_SIL_END}s (>= 0.5s)"
  fi
fi

# --- no frozen picture > 20s ---
FREEZE_LOG="$(mktemp)"
trap 'rm -f "$EBUR_LOG" "$SIL_LOG" "$FREEZE_LOG"' EXIT
ffmpeg -nostats -i "$MP4" -vf "freezedetect=n=0.003:d=20" -an -f null - 2> "$FREEZE_LOG"
FREEZE_HITS="$(grep -c "freeze_start" "$FREEZE_LOG" || true)"

if [ "${FREEZE_HITS:-0}" -eq 0 ]; then
  pass "no frozen picture > 20s"
else
  fail "${FREEZE_HITS} freeze segment(s) > 20s detected"
fi

# --- duration vs expected (optional) ---
DURATION="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MP4")"
if [ -n "$EXPECTED_SECONDS" ]; then
  DUR_OK="$(node -e "
    const d=parseFloat(process.argv[1]), e=parseFloat(process.argv[2]);
    console.log(Math.abs(d-e)/e<=0.02?1:0)
  " "$DURATION" "$EXPECTED_SECONDS")"
  if [ "$DUR_OK" = "1" ]; then
    pass "duration ${DURATION}s (within 2% of expected ${EXPECTED_SECONDS}s)"
  else
    fail "duration ${DURATION}s (expected ${EXPECTED_SECONDS}s +/-2%)"
  fi
else
  pass "duration ${DURATION}s (no expected duration given, informational only)"
fi

echo "---"
if [ "$FAIL" -eq 0 ]; then
  echo "ALL GATES PASSED"
else
  echo "ONE OR MORE GATES FAILED"
fi
exit "$FAIL"
