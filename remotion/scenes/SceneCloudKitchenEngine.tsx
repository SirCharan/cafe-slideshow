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
  SceneCloudKitchenShutter,
  SceneCloudKitchenInterior,
  SceneCloudKitchenAggregator,
  SceneCloudKitchenDispatch,
  SceneCloudKitchenBreakdown,
} from "./environments/cloud_kitchen";
import { KineticOverlay, KineticOverlayProps } from "./KineticOverlay";
import { PartTransitionCard } from "./PartTransitionCard";
import { ChapterBar } from "./ChapterBar";
import { ChapterHeader } from "./ChapterHeader";
import { SceneTransition } from "./SceneTransition";
import { SubtitlePill } from "./SubtitlePill";
import { CKCharacterIdentity, CKCharacterPose, CKCharacterEmotion } from "./CharacterCloudKitchen";
import rawScenesData from "../../data/cloud_kitchen_scenes.json";

export interface SceneCloudKitchenEngineProps {
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

interface CKSceneDef {
  id: string;
  name: string;
  part: string;
  isPartStart?: boolean;
  partTitle?: string;
  partSub?: string;
  env: string;
  characterIdentity: CKCharacterIdentity;
  characterPose: CKCharacterPose;
  characterEmotion: CKCharacterEmotion;
  characterSide: "left" | "right";
  durationSec: number;
  line0Dur: number;
  line1Dur: number;
  pause: number;
  lines: SceneLineDef[];
}

const scenesData = rawScenesData as unknown as CKSceneDef[];

export const SceneCloudKitchenEngine: React.FC<SceneCloudKitchenEngineProps> = ({
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

  const totalFrames = currentAccumulatedFrame;

  // Active scene index
  const activeSceneIdx = sceneTimeline.findIndex(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );
  const activeScene = activeSceneIdx !== -1 ? sceneTimeline[activeSceneIdx] : sceneTimeline[0];
  const sceneRelativeFrame = frame - activeScene.startFrame;

  // Active sentence inside scene
  const line0EndFrame = Math.round((activeScene.line0Dur + activeScene.lines[0].pause_s) * fps);
  const isLine1 = sceneRelativeFrame >= line0EndFrame && activeScene.lines.length > 1;
  const activeLine = isLine1 ? activeScene.lines[1] : activeScene.lines[0];

  // Talking state
  const isTalking =
    (!isLine1 && sceneRelativeFrame < Math.round(activeScene.line0Dur * fps)) ||
    (isLine1 && sceneRelativeFrame - line0EndFrame < Math.round(activeScene.line1Dur * fps));

  // Kinetic card animation anchor (Strict Left vs Right split geometry - zero character overlap!)
  const kineticProps: KineticOverlayProps = {
    badge: activeLine.badge,
    badgeColor: activeLine.badgeColor,
    title: activeLine.title,
    subtitle: activeLine.subtitle,
    highlightMetric: activeLine.highlightMetric,
    // If character is on LEFT, card anchors on RIGHT. If character is on RIGHT, card anchors on LEFT!
    align: activeScene.characterSide === "left" ? "right" : "left",
    anchorSide: activeScene.characterSide === "left" ? "right" : "left",
    offsetX: 80,
    bottomOffset: 340,
    width: 620,
    entrance: "slide",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0E14" }}>
      {/* 1. SCENE VISUAL ENVIRONMENTS */}
      {sceneTimeline.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={scene.name}
        >
          {scene.env === "shutter_alley" && (
            <SceneCloudKitchenShutter
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "kitchen_office" || scene.env === "kitchen_floor" || scene.env === "kitchen_chiller") && (
            <SceneCloudKitchenInterior
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "portal_dashboard" || scene.env === "ad_bidding_screen" || scene.env === "customer_phone_deal") && (
            <SceneCloudKitchenAggregator
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "dispatch_bottleneck" || scene.env === "packing_station") && (
            <SceneCloudKitchenDispatch
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "biryani_unit_math" || scene.env === "breakeven_whiteboard" || scene.env === "future_hub") && (
            <SceneCloudKitchenBreakdown
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {/* KINETIC METRIC CARD (Suppressed in 2.5D breakdown scene to prevent clutter) */}
          {scene.env !== "biryani_unit_math" && scene.env !== "breakeven_whiteboard" && (
            <KineticOverlay {...kineticProps} />
          )}

          {/* CHAPTER PART START TITLE CARD */}
          {scene.isPartStart && sceneRelativeFrame < 90 && (
            <PartTransitionCard
              partTitle={scene.partTitle || scene.part}
              subtitle={scene.partSub}
              durationFrames={90}
            />
          )}

          {/* SEAMLESS TRANSITIONS BETWEEN SCENES (Organic Air Whoosh, NO metallic beeps) */}
          <SceneTransition type="dip_to_black" durationFrames={8} />
        </Sequence>
      ))}

      {/* 2. PERSISTENT GLOBAL HUD & CHAPTER HEADER */}
      <ChapterHeader
        chapterIndex={activeSceneIdx >= 0 ? activeSceneIdx : 0}
        totalChapters={scenesData.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />
      <ChapterBar
        currentChapterIdx={activeSceneIdx >= 0 ? activeSceneIdx : 0}
        totalChapters={scenesData.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />

      {/* 3. CENTERED SUBTITLES (Grounded in bottom pill, 1000px clearance from flanks) */}
      {captions && (
        <SubtitlePill
          text={activeLine.text}
          highlightWords={activeLine.highlights}
        />
      )}

      {/* 4. DYNAMIC AUDIO PIPELINE */}
      {!muted && (
        <>
          {/* A. SCENE-SYNCED VOICE TRACKS */}
          {sceneTimeline.map((scene) => {
            const line0Start = scene.startFrame;
            const line1Start = scene.startFrame + Math.round((scene.line0Dur + scene.lines[0].pause_s) * fps);

            return (
              <React.Fragment key={scene.id}>
                {/* Voice Line 0 */}
                <Sequence
                  from={line0Start}
                  durationInFrames={Math.round(scene.line0Dur * fps) + 5}
                >
                  <Audio
                    src={staticFile(`audio/cloud_kitchen/${scene.id}_s0.wav`)}
                    volume={1.0}
                  />
                </Sequence>

                {/* Voice Line 1 */}
                {scene.lines.length > 1 && (
                  <Sequence
                    from={line1Start}
                    durationInFrames={Math.round(scene.line1Dur * fps) + 5}
                  >
                    <Audio
                      src={staticFile(`audio/cloud_kitchen/${scene.id}_s1.wav`)}
                      volume={1.0}
                    />
                  </Sequence>
                )}

                {/* Gentle Organic Acoustic Whoosh at Scene Start */}
                <Sequence from={scene.startFrame} durationInFrames={30}>
                  <Audio
                    src={staticFile("audio/sfx/pg/whoosh_soft.wav")}
                    volume={0.22}
                  />
                </Sequence>
              </React.Fragment>
            );
          })}

          {/* B. AMBIENT LO-FI BACKGROUND SCORE WITH DUCKING */}
          <Audio
            src={staticFile("audio/bgm/cafe_groove.mp3")}
            loop
            volume={isTalking ? 0.08 : 0.22}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
