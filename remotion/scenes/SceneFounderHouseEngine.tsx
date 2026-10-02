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
  SceneHSRVillaExterior,
  ScenePodBedroom,
  SceneLandlordOffice,
  SceneServerPowerCloset,
  SceneFounderWaterfall,
} from "./environments/founder_house";
import { KineticOverlay, KineticOverlayProps } from "./KineticOverlay";
import { PartTransitionCard } from "./PartTransitionCard";
import { ChapterBar } from "./ChapterBar";
import { ChapterHeader } from "./ChapterHeader";
import { SceneTransition } from "./SceneTransition";
import { SubtitlePill } from "./SubtitlePill";
import { FHCharacterIdentity, FHCharacterPose, FHCharacterEmotion } from "./CharacterFounderHouse";
import rawScenesData from "../../data/founder_house_scenes.json";

export interface SceneFounderHouseEngineProps {
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

interface FHSceneDef {
  id: string;
  name: string;
  part: string;
  isPartStart?: boolean;
  partTitle?: string;
  partSub?: string;
  env: string;
  characterIdentity: FHCharacterIdentity;
  characterPose: FHCharacterPose;
  characterEmotion: FHCharacterEmotion;
  characterSide: "left" | "right";
  durationSec: number;
  line0Dur: number;
  line1Dur: number;
  pause: number;
  lines: SceneLineDef[];
}

const scenesData = rawScenesData as unknown as FHSceneDef[];

export const SceneFounderHouseEngine: React.FC<SceneFounderHouseEngineProps> = ({
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
    align: activeScene.characterSide === "left" ? "right" : "left",
    anchorSide: activeScene.characterSide === "left" ? "right" : "left",
    offsetX: 80,
    bottomOffset: 340,
    width: 620,
    entrance: "slide",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#080B11" }}>
      {/* 1. SCENE VISUAL ENVIRONMENTS */}
      {sceneTimeline.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={scene.name}
        >
          {(scene.env === "hsr_villa_exterior" || scene.env === "bangalore_skyline_dusk") && (
            <SceneHSRVillaExterior
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "blueprint_pods" || scene.env === "third_wave_hsr") && (
            <ScenePodBedroom
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "indiranagar_landlord_office" || scene.env === "villa_gate_confrontation") && (
            <SceneLandlordOffice
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "server_power_closet" || scene.env === "villa_kitchen_dosa" || scene.env === "hallway_damage" || scene.env === "operator_4am_desk") && (
            <SceneServerPowerCloset
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {(scene.env === "waterfall_ledger_room" || scene.env === "terrace_moonlight") && (
            <SceneFounderWaterfall
              headline={scene.lines[0].badge}
              subheadline={scene.lines[0].title}
              characterIdentity={scene.characterIdentity}
              characterPose={scene.characterPose}
              characterEmotion={scene.characterEmotion}
              characterSide={scene.characterSide}
              isTalking={isTalking}
            />
          )}

          {/* KINETIC METRIC CARD (Suppressed in forensic waterfall scene to prevent clutter) */}
          {scene.env !== "waterfall_ledger_room" && (
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

          {/* SEAMLESS TRANSITIONS BETWEEN SCENES */}
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
      />

      {/* 3. CAPTIONS / SUBTITLES (Anchored bottom center inside dark pill with gold keywords) */}
      {captions && (
        <SubtitlePill
          text={activeLine.text}
          highlights={activeLine.highlights}
          isLine1={isLine1}
          bottom={72}
        />
      )}

      {/* 4. HIGH-FIDELITY AUDIO BUS (Dialogue + Foley SFX + Ducked BGM) */}
      {!muted && (
        <>
          {/* Dialogue Sequences */}
          {sceneTimeline.map((scene) => (
            <React.Fragment key={`audio_${scene.id}`}>
              {/* Line 0 */}
              <Sequence
                from={scene.startFrame}
                durationInFrames={Math.round(scene.line0Dur * fps) + 5}
                name={`VO_${scene.id}_line0`}
              >
                <Audio
                  src={staticFile(`audio/founder_house/${scene.id}_s0.wav`)}
                  volume={1.0}
                />
              </Sequence>

              {/* Line 1 */}
              {scene.lines.length > 1 && (
                <Sequence
                  from={scene.startFrame + Math.round((scene.line0Dur + scene.lines[0].pause_s) * fps)}
                  durationInFrames={Math.round(scene.line1Dur * fps) + 5}
                  name={`VO_${scene.id}_line1`}
                >
                  <Audio
                    src={staticFile(`audio/founder_house/${scene.id}_s1.wav`)}
                    volume={1.0}
                  />
                </Sequence>
              )}

              {/* Soft Organic Scene Transition Air Draft */}
              <Sequence
                from={scene.startFrame}
                durationInFrames={30}
                name={`SFX_transition_${scene.id}`}
              >
                <Audio
                  src={staticFile("audio/sfx/pg/whoosh_soft.wav")}
                  volume={0.15}
                />
              </Sequence>
            </React.Fragment>
          ))}

          {/* Ducked Background Music (Looped across composition runtime) */}
          <Audio
            src={staticFile("audio/bgm/cafe_groove.mp3")}
            volume={isTalking ? 0.08 : 0.22}
            loop
          />
        </>
      )}
    </AbsoluteFill>
  );
};
