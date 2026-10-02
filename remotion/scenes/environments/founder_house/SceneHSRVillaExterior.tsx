import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterFounderHouse, FHCharacterIdentity, FHCharacterPose, FHCharacterEmotion } from "../../CharacterFounderHouse";

export interface SceneHSRVillaExteriorProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: FHCharacterIdentity;
  characterPose?: FHCharacterPose;
  characterEmotion?: FHCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneHSRVillaExterior: React.FC<SceneHSRVillaExteriorProps> = ({
  headline = "HSR LAYOUT · SECTOR 4",
  subheadline = "THE SILICON VILLA COMMUNE",
  characterIdentity = "founder_hoodie",
  characterPose = "holding_latte",
  characterEmotion = "dreamy",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle tree sway
  const treeSway = Math.sin((frame / fps) * 1.5) * 5;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#0F172A" }}>
      {/* 1. BANGALORE DUSK SKY */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 600,
          background: "linear-gradient(180deg, #0B0E14 0%, #1E1B4B 45%, #4C1D95 75%, #D97706 100%)",
        }}
      />

      {/* 2. VECTOR ENVIRONMENT (SVG) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Distant Bangalore tree silhouettes */}
        <path
          d={`M -50 560 Q 300 ${520 + treeSway} 650 560 Q 1100 ${510 - treeSway} 1500 550 Q 1800 ${530 + treeSway} 2000 560 L 2000 750 L -50 750 Z`}
          fill="#1E293B"
          opacity="0.6"
        />

        {/* 8-BHK LUXURY VILLA FACADE (Right Side) */}
        <g transform="translate(680, 180)">
          {/* Main White Villa Block */}
          <rect x="0" y="80" width="1180" height="600" fill="#F8FAFC" />
          {/* Teak Wood Paneling Accents */}
          <rect x="40" y="100" width="320" height="280" fill="#78350F" opacity="0.85" />
          <rect x="420" y="100" width="460" height="18" fill="#451A03" />

          {/* Large Glass Balconies & Windows */}
          <rect x="80" y="140" width="240" height="180" rx="4" fill="#0284C7" opacity="0.35" stroke="#E2E8F0" strokeWidth="4" />
          <line x1="200" y1="140" x2="200" y2="320" stroke="#E2E8F0" strokeWidth="4" />
          {/* Warm Interior Lighting Glowing Through Windows */}
          <circle cx="200" cy="230" r="60" fill="#F59E0B" opacity="0.4" filter="blur(20px)" />

          {/* Master Bedroom Balcony with Glass Railing */}
          <rect x="480" y="120" width="480" height="200" rx="4" fill="#0284C7" opacity="0.3" stroke="#CBD5E1" strokeWidth="4" />
          <rect x="460" y="240" width="520" height="80" fill="none" stroke="#94A3B8" strokeWidth="4" />
          {[500, 560, 620, 680, 740, 800, 860, 920].map((rx, idx) => (
            <line key={idx} x1={rx} y1="240" x2={rx} y2="320" stroke="#94A3B8" strokeWidth="3" />
          ))}

          {/* Ground Floor Entrance & Porch */}
          <rect x="180" y="420" width="220" height="260" rx="6" fill="#1E293B" />
          <rect x="220" y="460" width="140" height="220" rx="4" fill="#334155" />
          <circle cx="340" cy="570" r="6" fill="#F59E0B" />

          {/* Modern Architectural Overhang */}
          <rect x="-40" y="60" width="1240" height="25" fill="#0F172A" />

          {/* Glowing Villa Nameplate */}
          <rect x="440" y="460" width="280" height="70" rx="8" fill="#0B0E14" stroke="#F59E0B" strokeWidth="2" />
          <text x="580" y="495" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="bold" fontFamily="Arial">
            FOUNDER HOUSE BLR
          </text>
          <text x="580" y="515" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="Arial">
            8-BHK TECH INCUBATOR VILLA
          </text>
        </g>

        {/* Compound Boundary Wall & Gate */}
        <rect x="0" y="700" width="1920" height="140" fill="#334155" />
        <rect x="0" y="700" width="1920" height="16" fill="#1E293B" />
        {/* Iron Boundary Railings */}
        {[...Array(32)].map((_, i) => (
          <line key={i} x1={i * 60 + 20} y1="620" x2={i * 60 + 20} y2="700" stroke="#475569" strokeWidth="4" />
        ))}

        {/* Asphalt Road & Pavement */}
        <rect x="0" y="840" width="1920" height="240" fill="#0F172A" />
        <line x1="0" y1="960" x2="1920" y2="960" stroke="#F59E0B" strokeWidth="6" strokeDasharray="50,40" />

        {/* Street Signboard: HSR LAYOUT SECTOR 4 */}
        <g transform="translate(140, 520)">
          <rect x="35" y="0" width="10" height="340" fill="#64748B" />
          <rect x="-40" y="20" width="160" height="90" rx="8" fill="#047857" stroke="#FFFFFF" strokeWidth="3" />
          <text x="40" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="Arial">
            HSR LAYOUT
          </text>
          <text x="40" y="78" textAnchor="middle" fill="#FCD34D" fontSize="12" fontWeight="bold" fontFamily="Arial">
            SECTOR 4 · 19TH MAIN
          </text>
        </g>

        {/* Overhead Bangalore Telecom & Fiber Cables */}
        {[0, 1, 2].map((c) => (
          <path
            key={c}
            d={`M 0 ${120 + c * 35} Q 960 ${210 + c * 40 + Math.sin(frame / 25 + c) * 3} 1920 ${140 + c * 30}`}
            fill="none"
            stroke="#0B0E14"
            strokeWidth="3.5"
            opacity="0.8"
          />
        ))}
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
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          padding: "12px 36px",
          borderRadius: 16,
          border: "2px solid #8B5CF6",
          boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
          zIndex: 20,
        }}
      >
        <span style={{ color: "#C084FC", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>{headline}</span>
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
