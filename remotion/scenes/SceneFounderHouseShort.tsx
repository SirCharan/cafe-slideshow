import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SceneFounderWaterfall } from "./environments/founder_house";
import { SubtitlePill } from "./SubtitlePill";
import rawScenesData from "../../data/founder_house_scenes.json";

export interface SceneFounderHouseShortProps {
  muted?: boolean;
}

export const SceneFounderHouseShort: React.FC<SceneFounderHouseShortProps> = ({
  muted = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Short covers Scene 10: The Forensic Waterfall (₹4.9L Gross to ₹70K Net)
  const scene10 = (rawScenesData as any[]).find((s) => s.id === "scene_10") || rawScenesData[9];
  const l0 = scene10.lines[0];
  const l1 = scene10.lines[1];

  const l0Frames = Math.round(scene10.line0Dur * fps);
  const l1StartFrame = l0Frames + 15;
  const isLine1 = frame >= l1StartFrame;
  const activeLine = isLine1 ? l1 : l0;

  // Zoom into the 2.5D waterfall stack for 9:16 vertical crop
  const scale = 1.35;

  return (
    <AbsoluteFill style={{ backgroundColor: "#080B11", overflow: "hidden" }}>
      {/* 1. SCALED 2.5D WATERFALL ENVIRONMENT CENTERED FOR 9:16 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 1920,
          height: 1080,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <SceneFounderWaterfall
          headline="HSR FOUNDER HOUSE MATH"
          subheadline="14 BEDS · WHERE THE MONEY GOES"
          characterIdentity="forensic_accountant"
          characterPose="pointing_ledger"
          characterEmotion="serious"
          characterSide="left"
          isTalking={true}
        />
      </div>

      {/* 2. TOP SHORT BADGE */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 30,
        }}
      >
        <div
          style={{
            backgroundColor: "#EF4444",
            padding: "8px 24px",
            borderRadius: 24,
            boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
          }}
        >
          <span style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: 1.5 }}>
            THE ₹35,000 BED TRAP
          </span>
        </div>
        <span style={{ color: "#E2E8F0", fontSize: 18, fontWeight: 800, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
          HSR Sector 4 · 8-BHK Villa P&L
        </span>
      </div>

      {/* 3. CAPTIONS / SUBTITLE (Centered in middle third for 9:16) */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 40,
          right: 40,
          display: "flex",
          justifyContent: "center",
          zIndex: 35,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(8, 11, 17, 0.94)",
            border: "2px solid #38BDF8",
            padding: "20px 32px",
            borderRadius: 24,
            boxShadow: "0 12px 36px rgba(0,0,0,0.8)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: 900,
              lineHeight: 1.35,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {activeLine.text}
          </span>
        </div>
      </div>

      {/* 4. AUDIO TRACKS */}
      {!muted && (
        <>
          {/* Sentence 0 */}
          <Sequence from={0} durationInFrames={l0Frames + 5} name="Short_VO_0">
            <Audio src={staticFile("audio/founder_house/scene_10_s0.wav")} volume={1.0} />
          </Sequence>

          {/* Sentence 1 */}
          <Sequence from={l1StartFrame} durationInFrames={Math.round(scene10.line1Dur * fps) + 5} name="Short_VO_1">
            <Audio src={staticFile("audio/founder_house/scene_10_s1.wav")} volume={1.0} />
          </Sequence>

          {/* Ducked Background Audio */}
          <Audio src={staticFile("audio/bgm/cafe_groove.mp3")} volume={0.10} loop />
        </>
      )}
    </AbsoluteFill>
  );
};
