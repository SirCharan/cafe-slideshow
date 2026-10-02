import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterFounderHouse, FHCharacterIdentity, FHCharacterPose, FHCharacterEmotion } from "../../CharacterFounderHouse";

export interface ScenePodBedroomProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: FHCharacterIdentity;
  characterPose?: FHCharacterPose;
  characterEmotion?: FHCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const ScenePodBedroom: React.FC<ScenePodBedroomProps> = ({
  headline = "THE POD COMMUNE · 14 BEDS",
  subheadline = "₹35,000 PER HEAD · ₹4,90,000 GROSS",
  characterIdentity = "founder_hoodie",
  characterPose = "showing_ipad",
  characterEmotion = "confident",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screen terminal cursor pulse
  const cursorBlink = frame % 30 < 15;
  const ledPulse = Math.sin((frame / fps) * 4) * 0.3 + 0.7;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#090D16" }}>
      {/* 1. ROOM WALLS & WOODEN FLOORING */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 720,
          background: "linear-gradient(180deg, #0D131F 0%, #161F30 100%)",
        }}
      />
      {/* Wood plank floor */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          width: 1920,
          height: 360,
          background: "linear-gradient(180deg, #3D2314 0%, #20120A 100%)",
        }}
      />

      {/* 2. VECTOR ENVIRONMENT (SVG) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Floor perspective lines */}
        {[0, 240, 480, 720, 960, 1200, 1440, 1680, 1920].map((x, i) => (
          <line key={i} x1={x} y1="720" x2={x + (x - 960) * 0.35} y2="1080" stroke="#1A0D07" strokeWidth="2" opacity="0.6" />
        ))}

        {/* WHITEBOARD ON LEFT (Pitch deck & system arch) */}
        <g transform="translate(100, 180)">
          {/* Whiteboard Stand */}
          <rect x="0" y="0" width="380" height="240" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="6" />
          <rect x="-10" y="240" width="400" height="14" rx="3" fill="#64748B" />
          <line x1="30" y1="254" x2="10" y2="480" stroke="#475569" strokeWidth="6" />
          <line x1="350" y1="254" x2="370" y2="480" stroke="#475569" strokeWidth="6" />

          {/* Architecture diagram drawings */}
          <text x="30" y="40" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="monospace">
            PROJECT: AGENTIC WORKSPACE
          </text>
          <rect x="30" y="60" width="90" height="35" rx="4" fill="#E2E8F0" stroke="#3B82F6" strokeWidth="2" />
          <text x="75" y="82" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold">LLM CORE</text>

          <line x1="120" y1="77" x2="160" y2="77" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrow)" />

          <rect x="160" y="60" width="90" height="35" rx="4" fill="#E2E8F0" stroke="#10B981" strokeWidth="2" />
          <text x="205" y="82" textAnchor="middle" fill="#065F46" fontSize="11" fontWeight="bold">TOOL CALLS</text>

          {/* Sticky Notes */}
          <rect x="290" y="50" width="60" height="55" fill="#FEF08A" rx="2" />
          <text x="295" y="70" fill="#854D0E" fontSize="9" fontWeight="bold">SEED PITCH</text>
          <text x="295" y="88" fill="#854D0E" fontSize="9">PEAK XV</text>

          <rect x="30" y="125" width="320" height="90" rx="6" fill="#F1F5F9" />
          <text x="45" y="150" fill="#0F172A" fontSize="12" fontWeight="bold">
            BEDS: 14 @ ₹35,000 / mo
          </text>
          <text x="45" y="172" fill="#059669" fontSize="14" fontWeight="900">
            GROSS: ₹4,90,000 / MONTH
          </text>
          <text x="45" y="195" fill="#DC2626" fontSize="11" fontWeight="bold">
            BREAK-EVEN: 12 BEDS (85.7% OCCUPANCY)
          </text>
        </g>

        {/* INDUSTRIAL STEEL BUNK BEDS (Right Half: X: 840 to 1800) */}
        <g transform="translate(860, 200)">
          {/* Main frame posts */}
          <rect x="0" y="0" width="18" height="580" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="420" y="0" width="18" height="580" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="480" y="0" width="18" height="580" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <rect x="900" y="0" width="18" height="580" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />

          {/* Top Bunk 1 & 2 */}
          <rect x="18" y="120" width="402" height="28" fill="#334155" />
          <rect x="25" y="95" width="388" height="25" rx="4" fill="#0284C7" />
          <rect x="498" y="120" width="402" height="28" fill="#334155" />
          <rect x="505" y="95" width="388" height="25" rx="4" fill="#0D9488" />

          {/* Bottom Bunk 1 & 2 */}
          <rect x="18" y="380" width="402" height="28" fill="#334155" />
          <rect x="25" y="355" width="388" height="25" rx="4" fill="#475569" />
          <rect x="498" y="380" width="402" height="28" fill="#334155" />
          <rect x="505" y="355" width="388" height="25" rx="4" fill="#6366F1" />

          {/* Ladder rungs */}
          {[160, 210, 260, 310].map((ry, idx) => (
            <rect key={idx} x="420" y={ry} width="60" height="10" fill="#64748B" rx="2" />
          ))}

          {/* Glowing Laptop on Desk under bunk */}
          <g transform="translate(120, 310)">
            {/* Wooden work table */}
            <rect x="-40" y="90" width="200" height="12" fill="#78350F" />
            <line x1="-30" y1="102" x2="-30" y2="210" stroke="#451A03" strokeWidth="6" />
            <line x1="150" y1="102" x2="150" y2="210" stroke="#451A03" strokeWidth="6" />

            {/* Laptop Base & Screen */}
            <polygon points="10,90 90,90 95,95 5,95" fill="#94A3B8" />
            <rect x="12" y="35" width="76" height="55" rx="3" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2" />
            <rect x="16" y="39" width="68" height="47" fill="#020617" />
            {/* Terminal green code lines */}
            <line x1="20" y1="46" x2="65" y2="46" stroke="#22C55E" strokeWidth="2" />
            <line x1="20" y1="52" x2="50" y2="52" stroke="#38BDF8" strokeWidth="2" />
            <line x1="20" y1="58" x2="72" y2="58" stroke="#E2E8F0" strokeWidth="2" />
            {cursorBlink && <rect x="74" y="56" width="3" height="4" fill="#22C55E" />}
          </g>

          {/* Glowing Neon Pod Sign: POD 01 */}
          <rect x="140" y="20" width="160" height="40" rx="6" fill="#0F172A" stroke="#00F0FF" strokeWidth="2" />
          <text x="220" y="46" textAnchor="middle" fill="#00F0FF" fontSize="16" fontWeight="900" fontFamily="Arial">
            POD SUITE 01
          </text>
        </g>
      </svg>

      {/* 3. SCENE METRIC BADGE (Top Center) */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(15, 23, 42, 0.94)",
          padding: "12px 36px",
          borderRadius: 16,
          border: "2px solid #38BDF8",
          boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
          zIndex: 20,
        }}
      >
        <span style={{ color: "#38BDF8", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>{headline}</span>
        <span style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, marginTop: 4 }}>{subheadline}</span>
      </div>

      {/* 4. CHARACTER RIG */}
      <CharacterFounderHouse
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={1.05}
        left={characterSide === "left" ? 180 : undefined}
        right={characterSide === "right" ? 180 : undefined}
        bottom={100}
      />
    </div>
  );
};
