import React from "react";
import { useCurrentFrame } from "remotion";
import { CharacterPG, PGCharacterIdentity, PGCharacterPose, PGCharacterEmotion } from "../../CharacterPG";

export interface ScenePGRoomProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: PGCharacterIdentity;
  characterPose?: PGCharacterPose;
  characterEmotion?: PGCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const ScenePGRoom: React.FC<ScenePGRoomProps> = ({
  headline = "THE 3-SHARING ROOM",
  subheadline = "CRAMPED BEDS & GEYSER ELECTRICAL SURGE",
  characterIdentity = "techie_tenant",
  characterPose = "carry_bag",
  characterEmotion = "stress",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();

  // Ceiling fan rotation (fast spin)
  const fanAngle = (frame * 18) % 360;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#FEF9E7" }}>
      {/* 1. ROOM WALLS & WINDOW */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 720,
          backgroundColor: "#F9E79F",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)",
          backgroundSize: "100% 40px",
        }}
      />

      {/* 2. ROOM ELEMENTS SVG */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* CEILING FAN SPINNING OVERHEAD */}
        <g transform="translate(960, 60)">
          <rect x="-6" y="0" width="12" height="40" fill="#2C3E50" />
          <circle cx="0" cy="40" r="16" fill="#1C2833" />
          {/* Fan Blades rotating */}
          <g transform={`rotate(${fanAngle}, 0, 40)`}>
            <rect x="-80" y="34" width="70" height="12" rx="4" fill="#34495E" />
            <rect x="10" y="34" width="70" height="12" rx="4" fill="#34495E" />
            <rect x="-6" y="-40" width="12" height="70" rx="4" fill="#34495E" />
          </g>
        </g>

        {/* WINDOW WITH GRILLE & RAIN/OUTSIDE VIEW */}
        <g transform="translate(620, 140)">
          <rect x="0" y="0" width="280" height="340" fill="#AED6F1" stroke="#2C3E50" strokeWidth="8" />
          {/* Iron Window Grille */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={`v-${i}`} x1={40 + i * 50} y1="0" x2={40 + i * 50} y2="340" stroke="#1C2833" strokeWidth="4" />
          ))}
          {[0, 1, 2].map((i) => (
            <line key={`h-${i}`} x1="0" y1={85 + i * 85} x2="280" y2={85 + i * 85} stroke="#1C2833" strokeWidth="4" />
          ))}
          {/* Clothes hanging to dry on window grille */}
          <rect x="60" y="100" width="45" height="70" rx="3" fill="#E74C3C" opacity="0.9" />
          <rect x="130" y="120" width="55" height="80" rx="3" fill="#3498DB" opacity="0.9" />
        </g>

        {/* TRIPLE STEEL BUNK BED (Iconic PG Hardware) */}
        <g transform="translate(960, 140)">
          {/* Vertical steel posts */}
          <rect x="0" y="0" width="16" height="620" fill="#2C3E50" />
          <rect x="240" y="0" width="16" height="620" fill="#2C3E50" />

          {/* Level 3: Top Bunk */}
          <rect x="16" y="80" width="224" height="20" fill="#2C3E50" />
          <rect x="20" y="65" width="216" height="15" fill="#E74C3C" rx="3" />
          <rect x="25" y="55" width="45" height="12" fill="#FEF9E7" rx="3" />

          {/* Level 2: Middle Bunk */}
          <rect x="16" y="270" width="224" height="20" fill="#2C3E50" />
          <rect x="20" y="255" width="216" height="15" fill="#2980B9" rx="3" />
          <rect x="25" y="245" width="45" height="12" fill="#FEF9E7" rx="3" />

          {/* Level 1: Bottom Bunk */}
          <rect x="16" y="470" width="224" height="20" fill="#2C3E50" />
          <rect x="20" y="455" width="216" height="15" fill="#27AE60" rx="3" />
          <rect x="25" y="445" width="45" height="12" fill="#FEF9E7" rx="3" />

          {/* Steel Ladder */}
          <line x1="210" y1="50" x2="210" y2="520" stroke="#7F8C8D" strokeWidth="6" />
          <line x1="230" y1="50" x2="230" y2="520" stroke="#7F8C8D" strokeWidth="6" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1="210" y1={80 + i * 65} x2="230" y2={80 + i * 65} stroke="#7F8C8D" strokeWidth="4" />
          ))}
        </g>

        {/* 3 INDIVIDUAL STEEL WARDROBES WITH PADLOCKS */}
        <g transform="translate(1260, 260)">
          <rect x="0" y="0" width="190" height="420" rx="4" fill="#7F8C8D" stroke="#566573" strokeWidth="4" />
          <line x1="63" y1="0" x2="63" y2="420" stroke="#566573" strokeWidth="2.5" />
          <line x1="126" y1="0" x2="126" y2="420" stroke="#566573" strokeWidth="2.5" />
          {/* Padlocks */}
          <circle cx="31" cy="210" r="6" fill="#F1C40F" />
          <circle cx="94" cy="210" r="6" fill="#F1C40F" />
          <circle cx="157" cy="210" r="6" fill="#F1C40F" />
        </g>

        {/* GEYSER SWITCHBOARD & DIGITAL SUB-METER ON WALL */}
        <g transform="translate(420, 320)">
          <rect x="0" y="0" width="140" height="150" rx="6" fill="#EAEDED" stroke="#BDC3C7" strokeWidth="3" />
          {/* Sub-meter digital readout */}
          <rect x="15" y="18" width="110" height="45" rx="3" fill="#1C2833" />
          <text x="70" y="48" fill="#E74C3C" fontSize="18" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            0482.6 kWh
          </text>
          {/* Red Geyser Rocker Switches */}
          <rect x="25" y="85" width="22" height="34" rx="3" fill="#C0392B" />
          <rect x="60" y="85" width="22" height="34" rx="3" fill="#C0392B" />
          <rect x="95" y="85" width="22" height="34" rx="3" fill="#2ECC71" />
          <text x="70" y="135" fill="#7F8C8D" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="800" textAnchor="middle">
            ROOM 204 SUB-METER
          </text>
        </g>
      </svg>

      {/* 3. CERAMIC TILED FLOORING */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 360,
          backgroundColor: "#D5D8DC",
          borderTop: "12px solid #BDC3C7",
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.04) 2px, transparent 2px), linear-gradient(0deg, rgba(0,0,0,0.04) 2px, transparent 2px)",
          backgroundSize: "120px 80px",
        }}
      />

      {/* 4. TOP HEADLINE BANNER */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          backgroundColor: "rgba(28, 30, 33, 0.88)",
          backdropFilter: "blur(8px)",
          padding: "12px 28px",
          borderRadius: 6,
          border: "2px solid #3498DB",
          textAlign: "right",
          zIndex: 40,
        }}
      >
        <div
          style={{
            color: "#5DADE2",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            color: "#ECF0F1",
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.2,
            marginTop: 4,
          }}
        >
          {subheadline}
        </div>
      </div>

      {/* 5. CHARACTER ANCHOR (Strictly Left or Right) */}
      <CharacterPG
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={0.92}
        left={characterSide === "left" ? 140 : undefined}
        right={characterSide === "right" ? 140 : undefined}
        bottom={140}
      />
    </div>
  );
};
