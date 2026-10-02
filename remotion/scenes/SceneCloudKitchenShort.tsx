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
import { SceneCloudKitchenBreakdown } from "./environments/cloud_kitchen";
import { SubtitlePill } from "./SubtitlePill";
import rawScenesData from "../../data/cloud_kitchen_scenes.json";

export interface SceneCloudKitchenShortProps {
  muted?: boolean;
}

export const SceneCloudKitchenShort: React.FC<SceneCloudKitchenShortProps> = ({
  muted = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Short covers Scene 10: Dissecting the ₹350 Biryani
  const scene10 = (rawScenesData as any[]).find((s) => s.id === "scene_10") || rawScenesData[9];
  const l0 = scene10.lines[0];
  const l1 = scene10.lines[1];

  const l0Frames = Math.round(scene10.line0Dur * fps);
  const l1StartFrame = l0Frames + 15;
  const isLine1 = frame >= l1StartFrame;
  const activeLine = isLine1 ? l1 : l0;

  // Zoom into the 2.5D breakdown stack for 9:16 vertical crop
  const scale = 1.35;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0E14", overflow: "hidden" }}>
      {/* 1. SCALED 2.5D BREAKDOWN ENVIRONMENT CENTERED FOR 9:16 */}
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
        <SceneCloudKitchenBreakdown
          headline="₹350 BIRYANI MATH"
          subheadline="WHERE EVERY RUPEE GOES"
          characterIdentity="kitchen_founder"
          characterPose="point_tablet"
          characterEmotion="neutral"
          characterSide="left"
          isTalking={true}
        />
      </div>

      {/* 2. TOP BRANDING BANNER (9:16 NATIVE) */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 90,
        }}
      >
        <div
          style={{
            backgroundColor: "#E74C3C",
            color: "#FFFFFF",
            padding: "8px 24px",
            borderRadius: 8,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            boxShadow: "0 6px 20px rgba(231, 76, 60, 0.4)",
          }}
        >
          SWIGGY & ZOMATO TRAP
        </div>
        <div
          style={{
            color: "#F1C40F",
            fontSize: 48,
            fontWeight: 900,
            textShadow: "0 4px 16px rgba(0,0,0,0.8)",
            textAlign: "center",
          }}
        >
          THE ₹350 BIRYANI ILLUSION
        </div>
      </div>

      {/* 3. CENTERED HIGH-ENERGY KINETIC CAPTIONS (HORMOZI / VOX STYLE) */}
      <div
        style={{
          position: "absolute",
          bottom: 240,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "center",
          zIndex: 95,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(11, 14, 20, 0.92)",
            border: "3px solid #F1C40F",
            borderRadius: 24,
            padding: "24px 36px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.8)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.35,
              textTransform: "uppercase",
            }}
          >
            {activeLine.text}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM PROGRESS & CTA BAR */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          zIndex: 90,
        }}
      >
        <div style={{ color: "#2ECC71", fontSize: 28, fontWeight: 900 }}>
          TRUE NET PROFIT: ONLY ₹32 (9%)
        </div>
        <div style={{ color: "#BDC3C7", fontSize: 20, fontWeight: 700 }}>
          Watch Full Documentary @NotaStartup
        </div>
      </div>

      {/* 5. AUDIO TRACKS */}
      {!muted && (
        <>
          <Sequence from={0} durationInFrames={l0Frames + 5}>
            <Audio src={staticFile("audio/cloud_kitchen/scene_10_s0.wav")} volume={1.0} />
          </Sequence>
          <Sequence from={l1StartFrame} durationInFrames={Math.round(scene10.line1Dur * fps) + 5}>
            <Audio src={staticFile("audio/cloud_kitchen/scene_10_s1.wav")} volume={1.0} />
          </Sequence>
          <Audio src={staticFile("audio/bgm/cafe_groove.mp3")} loop volume={0.10} />
        </>
      )}
    </AbsoluteFill>
  );
};
