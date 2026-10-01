import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  ScenePGStreet,
  ScenePGLobby,
  ScenePGRoom,
  ScenePGKitchen,
  ScenePGBreakdown,
} from "./environments/pg";
import { KineticOverlay, KineticOverlayProps } from "./KineticOverlay";
import { PartTransitionCard } from "./PartTransitionCard";
import { ChapterBar } from "./ChapterBar";
import { ChapterHeader } from "./ChapterHeader";
import { SceneTransition } from "./SceneTransition";
import { SubtitlePill } from "./SubtitlePill";
import { PGCharacterIdentity, PGCharacterPose, PGCharacterEmotion } from "./CharacterPG";
import rawScenesData from "../../data/pg_scenes.json";

export interface ScenePGEngineProps {
  muted?: boolean;
  captions?: boolean;
}

interface SceneLineDef {
  idx: number;
  text: string;
  tts_text: string;
  pause_s: number;
  durationSec: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  highlightMetric?: { value: string; label: string; color: string };
  highlights: string[];
}

interface PGSceneDef {
  id: string;
  name: string;
  part: string;
  isPartStart?: boolean;
  partTitle?: string;
  partSub?: string;
  env: "street" | "lobby" | "room" | "kitchen" | "breakdown";
  characterIdentity: PGCharacterIdentity;
  characterPose: PGCharacterPose;
  characterEmotion: PGCharacterEmotion;
  characterSide: "left" | "right";
  durationSec: number;
  line0Dur: number;
  line1Dur: number;
  pause: number;
  lines: SceneLineDef[];
}

const scenesData = rawScenesData as unknown as PGSceneDef[];

export const ScenePGEngine: React.FC<ScenePGEngineProps> = ({
  muted = false,
  captions = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute exact frame ranges for each scene
  let currentAccumulatedFrame = 0;
  const sceneTimeline = scenesData.map((s) => {
    const startFrame = currentAccumulatedFrame;
    const durationFrames = Math.round(s.durationSec * fps);
    currentAccumulatedFrame += durationFrames;
    return {
      ...s,
      startFrame,
      durationFrames,
      endFrame: startFrame + durationFrames,
    };
  });

  // Identify currently active scene for chapter indicators
  const currentSceneIdx = sceneTimeline.findIndex(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );
  const activeScene =
    currentSceneIdx >= 0
      ? sceneTimeline[currentSceneIdx]
      : sceneTimeline[sceneTimeline.length - 1];

  // Subtle continuous cinematic camera drift
  const continuousScale = 1.0 + Math.sin((frame / fps) * 0.15) * 0.015;

  // Auto-Ducking BGM calculation (ducks during speech, elevates slightly during transitions)
  const isTransition = sceneTimeline.some(
    (s) => Math.abs(frame - s.startFrame) < fps * 1.2
  );
  const targetBgmVol = isTransition ? 0.22 : 0.10;

  return (
    <AbsoluteFill style={{ backgroundColor: "#111418", overflow: "hidden" }}>
      {/* 1. Dynamic Camera Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${continuousScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Render each scene sequence */}
        {sceneTimeline.map((scene, idx) => {
          const startVoiceOffset = scene.isPartStart ? 1.6 : 0.8;
          const line0Start = Math.round(fps * startVoiceOffset);
          const line0End = line0Start + Math.round(fps * scene.line0Dur);
          const line1Start = line0End + Math.round(fps * scene.pause);
          const line1End = line1Start + Math.round(fps * scene.line1Dur);

          // Local scene frame for talking animation
          const sceneLocalFrame = frame - scene.startFrame;
          const isTalking =
            (sceneLocalFrame >= line0Start && sceneLocalFrame <= line0End) ||
            (sceneLocalFrame >= line1Start && sceneLocalFrame <= line1End);

          const l0 = scene.lines[0];
          const l1 = scene.lines[1];

          // STRICT ZERO-OVERLAP GEOMETRY:
          // Character is on Left -> Overlay on Right
          // Character is on Right -> Overlay on Left
          const isLeft = scene.characterSide === "left";
          const overlayLeft = isLeft ? undefined : 80;
          const overlayRight = isLeft ? 80 : undefined;
          const overlayAlign: "left" | "right" = isLeft ? "right" : "left";

          return (
            <Sequence
              key={scene.id}
              from={scene.startFrame}
              durationInFrames={scene.durationFrames}
            >
              {/* Scene Transition (Smooth slide & settle, no harsh laser flash) */}
              <SceneTransition isPartStart={scene.isPartStart}>
                {scene.env === "street" && (
                  <ScenePGStreet
                    headline={idx === 0 ? "MARATHAHALLI · BTM LAYOUT" : "SCALE OR PERISH"}
                    subheadline={idx === 0 ? "THE BANGALORE PG GOLD RUSH" : "THE 100-BED CLUSTER MODEL"}
                    characterIdentity={scene.characterIdentity}
                    characterPose={scene.characterPose}
                    characterEmotion={scene.characterEmotion}
                    characterSide={scene.characterSide}
                    isTalking={isTalking}
                  />
                )}
                {scene.env === "lobby" && (
                  <ScenePGLobby
                    headline={scene.id === "scene_02" ? "PG RECEPTION & SPREADSHEET" : "BIOMETRIC ENTRY DOOR"}
                    subheadline={scene.id === "scene_02" ? "60 BEDS × ₹11,000 NAPKIN MATH" : "TENANT TURNOVER & DEPOSIT BUFFER"}
                    characterIdentity={scene.characterIdentity}
                    characterPose={scene.characterPose}
                    characterEmotion={scene.characterEmotion}
                    characterSide={scene.characterSide}
                    isTalking={isTalking}
                  />
                )}
                {scene.env === "room" && (
                  <ScenePGRoom
                    headline={
                      scene.id === "scene_04"
                        ? "ROOM 204 · 3-SHARING FITOUT"
                        : scene.id === "scene_05"
                        ? "8:00 AM GEYSER SURGE"
                        : scene.id === "scene_09"
                        ? "FIXED COST THRESHOLD"
                        : "SUB-METER DIGITAL CONTROL"
                    }
                    subheadline={
                      scene.id === "scene_04"
                        ? "₹18,50,000 HARDWARE CAPEX"
                        : scene.id === "scene_05"
                        ? "₹45,000 / MONTH BESCOM COMMERCIAL BILL"
                        : scene.id === "scene_09"
                        ? "68% BREAK-EVEN OCCUPANCY FLOOR"
                        : "SINGLE AC ROOM CONVERSION YIELD"
                    }
                    characterIdentity={scene.characterIdentity}
                    characterPose={scene.characterPose}
                    characterEmotion={scene.characterEmotion}
                    characterSide={scene.characterSide}
                    isTalking={isTalking}
                  />
                )}
                {scene.env === "kitchen" && (
                  <ScenePGKitchen
                    headline="CENTRAL PG FOOD FACTORY"
                    subheadline="5,400 MEALS / MONTH · CAPPED AT ₹90/DAY"
                    characterIdentity={scene.characterIdentity}
                    characterPose={scene.characterPose}
                    characterEmotion={scene.characterEmotion}
                    characterSide={scene.characterSide}
                    isTalking={isTalking}
                  />
                )}
                {scene.env === "breakdown" && (
                  <ScenePGBreakdown
                    headline="THE ₹11,000 BED DISSECTION"
                    subheadline="UNIT ECONOMICS OF A BANGALORE BED"
                    characterIdentity={scene.characterIdentity}
                    characterPose={scene.characterPose}
                    characterEmotion={scene.characterEmotion}
                    characterSide={scene.characterSide}
                    isTalking={isTalking}
                  />
                )}
              </SceneTransition>

              {/* Kinetic On-Screen Text Overlay 1 (Spoken Line 0) - suppressed on breakdown scene to avoid crowding */}
              {scene.env !== "breakdown" && (
                <Sequence from={line0Start} durationInFrames={Math.max(1, line1Start - line0Start)}>
                  <KineticOverlay
                    badge={l0.badge}
                    badgeColor={l0.badgeColor}
                    title={l0.title}
                    subtitle={l0.subtitle}
                    highlightMetric={l0.highlightMetric}
                    align={overlayAlign}
                    left={overlayLeft}
                    right={overlayRight}
                    bottom={340}
                  />
                </Sequence>
              )}

              {/* Kinetic On-Screen Text Overlay 2 (Spoken Line 1: Punchline & Numbers) */}
              {scene.env !== "breakdown" && (
                <Sequence from={line1Start}>
                  <KineticOverlay
                    badge={l1.badge}
                    badgeColor={l1.badgeColor}
                    title={l1.title}
                    subtitle={l1.subtitle}
                    highlightMetric={l1.highlightMetric}
                    align={overlayAlign}
                    left={overlayLeft}
                    right={overlayRight}
                    bottom={340}
                  />
                </Sequence>
              )}

              {/* Dynamic Spoken Narration Subtitles (strictly centered at bottom: 72px, clear of characters) */}
              {captions && (
                <>
                  <Sequence from={line0Start} durationInFrames={Math.max(1, line1Start - line0Start)}>
                    <SubtitlePill
                      text={l0.text}
                      highlightWords={l0.highlights}
                    />
                  </Sequence>
                  <Sequence from={line1Start}>
                    <SubtitlePill
                      text={l1.text}
                      highlightWords={l1.highlights}
                    />
                  </Sequence>
                </>
              )}

              {/* Part Transition Card (1.5s visual card at the start of new parts) */}
              {scene.isPartStart && (
                <Sequence from={0} durationInFrames={Math.round(fps * 1.6)}>
                  <PartTransitionCard
                    partNumber={scene.part.split("·")[0].trim()}
                    title={scene.partTitle || ""}
                    subtitle={scene.partSub || ""}
                    themeColor="#E74C3C"
                  />
                </Sequence>
              )}
            </Sequence>
          );
        })}
      </div>

      {/* 2. FLOATING TOP-LEFT CHAPTER INDICATOR */}
      <ChapterHeader
        chapterIndex={currentSceneIdx >= 0 ? currentSceneIdx : 0}
        totalChapters={scenesData.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />

      {/* 3. PERSISTENT CHAPTER HUD & PROGRESS BAR (BOTTOM) */}
      <ChapterBar
        currentChapterIdx={currentSceneIdx >= 0 ? currentSceneIdx : 0}
        totalChapters={scenesData.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />

      {/* 4. MULTI-TRACK AUDIO ENGINE (Zero Beeps, Organic Soundscape) */}
      {!muted && (
        <>
          {/* TRACK 1: Ambient Lo-Fi BGM with Dynamic Auto-Ducking */}
          <Audio
            src={staticFile("audio/bgm/cafe_groove.mp3")}
            loop
            volume={targetBgmVol}
          />

          {/* TRACK 2: Spoken Voiceover Narration */}
          {sceneTimeline.map((s) => {
            const startVoiceOffset = s.isPartStart ? 1.6 : 0.8;
            const line0Start = Math.round(fps * startVoiceOffset);
            const line0End = line0Start + Math.round(fps * s.line0Dur);
            const line1Start = line0End + Math.round(fps * s.pause);

            return (
              <Sequence key={`voice-${s.id}`} from={s.startFrame}>
                {/* Sentence 0 */}
                <Sequence from={line0Start}>
                  <Audio src={staticFile(`audio/pg/${s.id}_s0.wav`)} volume={1.0} />
                </Sequence>
                {/* Sentence 1 */}
                <Sequence from={line1Start}>
                  <Audio src={staticFile(`audio/pg/${s.id}_s1.wav`)} volume={1.0} />
                </Sequence>
              </Sequence>
            );
          })}

          {/* TRACK 3: Organic Soft Air Transition Whooshes (NO HARSH SINE BEEP) */}
          {sceneTimeline.map((s, idx) => (
            <React.Fragment key={`sfx-transition-${s.id}`}>
              {idx > 0 && (
                <Sequence from={Math.max(0, s.startFrame - 4)}>
                  <Audio src={staticFile("audio/sfx/pg/whoosh_soft.wav")} volume={0.35} />
                </Sequence>
              )}
            </React.Fragment>
          ))}

          {/* TRACK 4: Diegetic Foley Sound FX (Authentic PG Textures) */}
          {sceneTimeline.map((s) => {
            const startVoiceOffset = s.isPartStart ? 1.6 : 0.8;
            const line0Start = Math.round(fps * startVoiceOffset);
            const line0End = line0Start + Math.round(fps * s.line0Dur);
            const line1Start = line0End + Math.round(fps * s.pause);

            return (
              <Sequence key={`foley-${s.id}`} from={s.startFrame}>
                {s.id === "scene_01" && (
                  <Sequence from={line0Start + 15}>
                    <Audio src={staticFile("audio/sfx/pg/keys_jingle.wav")} volume={0.45} />
                  </Sequence>
                )}
                {s.id === "scene_02" && (
                  <Sequence from={line1Start + 10}>
                    <Audio src={staticFile("audio/sfx/calculator_taps.wav")} volume={0.45} />
                  </Sequence>
                )}
                {s.id === "scene_03" && (
                  <Sequence from={line1Start + 15}>
                    <Audio src={staticFile("audio/sfx/paper_unroll.wav")} volume={0.5} />
                  </Sequence>
                )}
                {s.id === "scene_04" && (
                  <Sequence from={line1Start + 20}>
                    <Audio src={staticFile("audio/sfx/measuring_tape.wav")} volume={0.5} />
                  </Sequence>
                )}
                {s.id === "scene_05" && (
                  <Sequence from={line1Start + 10}>
                    <Audio src={staticFile("audio/sfx/pg/geyser_click.wav")} volume={0.55} />
                  </Sequence>
                )}
                {s.id === "scene_06" && (
                  <Sequence from={line1Start + 15}>
                    <Audio src={staticFile("audio/sfx/pg/ladle_stir.wav")} volume={0.5} />
                  </Sequence>
                )}
                {s.id === "scene_07" && (
                  <Sequence from={line1Start + 15}>
                    <Audio src={staticFile("audio/sfx/pg/water_tanker_rumble.wav")} volume={0.45} />
                  </Sequence>
                )}
                {s.id === "scene_08" && (
                  <Sequence from={line1Start + 15}>
                    <Audio src={staticFile("audio/sfx/pg/biometric_chirp.wav")} volume={0.4} />
                  </Sequence>
                )}
                {s.id === "scene_09" && (
                  <Sequence from={line1Start + 15}>
                    <Audio src={staticFile("audio/sfx/pg/cash_count.wav")} volume={0.5} />
                  </Sequence>
                )}
                {s.id === "scene_10" && (
                  <Sequence from={line1Start + 10}>
                    <Audio src={staticFile("audio/sfx/pg/cash_count.wav")} volume={0.55} />
                  </Sequence>
                )}
                {s.id === "scene_11" && (
                  <Sequence from={line1Start + 12}>
                    <Audio src={staticFile("audio/sfx/pg/submeter_tick.wav")} volume={0.45} />
                  </Sequence>
                )}
                {s.id === "scene_12" && (
                  <Sequence from={line1Start + 18}>
                    <Audio src={staticFile("audio/sfx/pg/keys_jingle.wav")} volume={0.5} />
                  </Sequence>
                )}
              </Sequence>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
