"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Player, type PlayerRef } from "@remotion/player";
import type { AnyZodObject } from "remotion";
import { Episode, buildTimeline, getSlides } from "@/remotion/Episode";
import { getTheme } from "@/remotion/theme";
import { FPS, HEIGHT, WIDTH, type EpisodeProps, type Slide, type ThemeName } from "@/remotion/types";

const STORAGE_KEY = "cafe_slideshow_custom_deck";

function loadDeck(): Slide[] {
  // ponytail: same localStorage key the editor writes; falls back to the bundled deck.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Slide[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* private mode or corrupt json */
  }
  return getSlides();
}

function PresentInner() {
  const params = useSearchParams();
  const themeName: ThemeName = params.get("theme") === "whiteboard" ? "whiteboard" : "ledger";
  const captions = params.get("captions") !== "0";
  const startSlide = Number(params.get("slide") ?? 0);
  const manual = params.get("mode") === "manual";

  const [slides] = useState<Slide[] | null>(() => loadDeck());
  const [armed, setArmed] = useState(false); // first gesture unlocks audio
  const playerRef = useRef<PlayerRef>(null);
  const pendingTargetRef = useRef<number | null>(null);
  const [fragmentIdx, setFragmentIdx] = useState(0);

  const timeline = useMemo(() => (slides ? buildTimeline(slides) : null), [slides]);
  const slideStarts = useMemo(
    () => (timeline ? timeline.items.filter((i) => i.kind === "slide").map((i) => i.startFrame) : []),
    [timeline],
  );
  // Every sentence start plus every slide start, sorted + deduped — the manual-advance stops.
  const fragments = useMemo(() => {
    if (!timeline) return [];
    const set = new Set<number>();
    timeline.items.forEach((item) => {
      if (item.kind !== "slide") return;
      set.add(item.startFrame);
      item.sentenceStartFrames.forEach((f) => set.add(f));
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [timeline]);

  const seekToSlide = useCallback(
    (idx: number) => {
      const f = slideStarts[Math.max(0, Math.min(idx, slideStarts.length - 1))];
      if (f !== undefined) playerRef.current?.seekTo(f);
    },
    [slideStarts],
  );

  // Manual mode: track the current fragment for the counter, and pause once playback
  // reaches whatever fragment Space armed as the next stop.
  useEffect(() => {
    if (!manual) return;
    const p = playerRef.current;
    if (!p) return;
    const onFrameUpdate = (e: { detail: { frame: number } }) => {
      const frame = e.detail.frame;
      let idx = 0;
      for (let i = 0; i < fragments.length; i += 1) {
        if (frame >= fragments[i]) idx = i;
        else break;
      }
      setFragmentIdx(idx);
      if (pendingTargetRef.current !== null && frame >= pendingTargetRef.current) {
        p.pause();
        pendingTargetRef.current = null;
      }
    };
    p.addEventListener("frameupdate", onFrameUpdate);
    return () => p.removeEventListener("frameupdate", onFrameUpdate);
  }, [manual, fragments]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const p = playerRef.current;
      if (!p) return;
      if (!armed) {
        setArmed(true);
        if (e.key === " ") e.preventDefault();
        return;
      }
      if (manual) {
        if (e.key === " ") {
          e.preventDefault();
          const cur = p.getCurrentFrame();
          if (e.shiftKey) {
            pendingTargetRef.current = null;
            const prev = [...fragments].reverse().find((f) => f < cur);
            p.pause();
            p.seekTo(prev ?? 0);
          } else {
            const next = fragments.find((f) => f > cur);
            if (next !== undefined) {
              pendingTargetRef.current = next;
              p.play();
            }
          }
          return;
        }
      }
      const cur = p.getCurrentFrame();
      const idx = slideStarts.findIndex((s, i) => cur >= s && (slideStarts[i + 1] === undefined || cur < slideStarts[i + 1]));
      if (!manual && e.key === " ") {
        e.preventDefault();
        p.toggle();
      } else if (e.key === "ArrowRight") seekToSlide(idx + 1);
      else if (e.key === "ArrowLeft") seekToSlide(cur - slideStarts[idx] > FPS ? idx : idx - 1);
      else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [armed, manual, fragments, slideStarts, seekToSlide]);

  useEffect(() => {
    if (timeline && startSlide > 0) seekToSlide(startSlide);
  }, [timeline, startSlide, seekToSlide]);

  const theme = getTheme(themeName);
  if (!slides || !timeline) {
    return <div style={{ width: "100vw", height: "100vh", background: theme.paper }} />;
  }

  const inputProps: EpisodeProps & Record<string, unknown> = { theme: themeName, captions, muted: manual };

  return (
    <div
      style={{ width: "100vw", height: "100vh", background: theme.ink, display: "grid", placeItems: "center", overflow: "hidden", position: "relative" }}
      onClick={() => setArmed(true)}
    >
      <Player<AnyZodObject, EpisodeProps & Record<string, unknown>>
        ref={playerRef}
        component={Episode}
        inputProps={inputProps}
        durationInFrames={timeline.totalFrames}
        compositionWidth={WIDTH}
        compositionHeight={HEIGHT}
        fps={FPS}
        style={{ width: "100vw", height: "100vh" }}
        controls={false}
        clickToPlay={false}
        spaceKeyToPlayOrPause={false}
        numberOfSharedAudioTags={8}
        renderLoading={() => <div style={{ width: "100%", height: "100%", background: theme.paper }} />}
      />
      {manual && armed && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 28,
            fontFamily: theme.fontBody,
            fontSize: 18,
            color: theme.mute,
          }}
        >
          line {fragmentIdx + 1} / {fragments.length}
        </div>
      )}
      {!armed && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: theme.paper,
            color: theme.ink,
            fontFamily: theme.fontDisplay,
            textAlign: "center",
            padding: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 56, marginBottom: 12 }}>Not a Startup</div>
            <div style={{ fontSize: 24, color: theme.mute, fontFamily: theme.fontBody }}>
              {manual
                ? "Space: next line · Shift+Space: back · ←/→ chapters · F fullscreen"
                : "Press Space to start · arrows jump chapters · F fullscreen"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PresentPage() {
  return (
    <Suspense fallback={null}>
      <PresentInner />
    </Suspense>
  );
}
