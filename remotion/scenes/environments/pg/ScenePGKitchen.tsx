import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterPG, PGCharacterIdentity, PGCharacterPose, PGCharacterEmotion } from "../../CharacterPG";

export interface ScenePGKitchenProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: PGCharacterIdentity;
  characterPose?: PGCharacterPose;
  characterEmotion?: PGCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const ScenePGKitchen: React.FC<ScenePGKitchenProps> = ({
  headline = "CENTRAL PG KITCHEN",
  subheadline = "5,400 MEALS / MONTH · CAPPED AT ₹90/DAY",
  characterIdentity = "kitchen_cook",
  characterPose = "stir_pot",
  characterEmotion = "neutral",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Steam & flame oscillation
  const steam1Y = interpolate((frame * 2.5) % 90, [0, 90], [0, -70]);
  const steam1Opacity = interpolate((frame * 2.5) % 90, [0, 45, 90], [0, 0.65, 0]);
  const steam2Y = interpolate(((frame * 2.5) + 45) % 90, [0, 90], [0, -80]);
  const steam2Opacity = interpolate(((frame * 2.5) + 45) % 90, [0, 45, 90], [0, 0.55, 0]);

  // Flame flicker under cauldron
  const flameScale = 1 + Math.sin(frame * 0.4) * 0.08;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#EAEDED" }}>
      {/* 1. KITCHEN BACKGROUND & TILED WALL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 720,
          backgroundColor: "#F2F4F4",
          backgroundImage:
            "linear-gradient(rgba(189, 195, 199, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(189, 195, 199, 0.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Industrial Stainless Steel Overhead Exhaust Duct */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 280,
          width: 1360,
          height: 120,
          background: "linear-gradient(180deg, #7F8C8D 0%, #95A5A6 60%, #BDC3C7 100%)",
          borderBottom: "4px solid #566573",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 60px",
        }}
      >
        <div style={{ width: 140, height: 50, backgroundColor: "#34495E", borderRadius: 4, border: "2px solid #2C3E50" }} />
        <div style={{ width: 140, height: 50, backgroundColor: "#34495E", borderRadius: 4, border: "2px solid #2C3E50" }} />
        <div style={{ width: 140, height: 50, backgroundColor: "#34495E", borderRadius: 4, border: "2px solid #2C3E50" }} />
      </div>

      {/* 2. KITCHEN PROPS, COOKWARE & INGREDIENT CRATES */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* Weekly Chalkboard Menu on Wall */}
        <g transform="translate(1380, 160)">
          <rect x="0" y="0" width="340" height="220" rx="6" fill="#1C2833" stroke="#566573" strokeWidth="6" />
          <text x="170" y="32" fill="#F4D03F" fontSize="14" fontWeight="800" fontFamily="'Space Grotesk', sans-serif" textAnchor="middle" letterSpacing="1">
            PG WEEKLY MENU (BUDGET: ₹90/D)
          </text>
          <line x1="20" y1="44" x2="320" y2="44" stroke="#566573" strokeWidth="1.5" />
          <text x="25" y="70" fill="#ECF0F1" fontSize="12" fontFamily="monospace">MON: Dal Khichdi + Pickle</text>
          <text x="25" y="95" fill="#ECF0F1" fontSize="12" fontFamily="monospace">TUE: Cabbage Poriyal + Rice</text>
          <text x="25" y="120" fill="#ECF0F1" fontSize="12" fontFamily="monospace">WED: Watery Sambar + Papad</text>
          <text x="25" y="145" fill="#ECF0F1" fontSize="12" fontFamily="monospace">THU: Aloo Gobi + Rasam</text>
          <text x="25" y="170" fill="#2ECC71" fontSize="12" fontFamily="monospace" fontWeight="bold">SUN: 1 Pc Chicken / Egg Curry</text>
          <text x="25" y="198" fill="#E74C3C" fontSize="11" fontFamily="sans-serif" fontStyle="italic">* Extra egg strictly ₹15</text>
        </g>

        {/* Industrial Red LPG Commercial Cylinders (19kg Commercial) */}
        <g transform="translate(480, 480)">
          {/* Cylinder 1 */}
          <rect x="0" y="25" width="60" height="150" rx="20" fill="#C0392B" stroke="#922B21" strokeWidth="3" />
          <rect x="15" y="5" width="30" height="25" rx="4" fill="#922B21" />
          <text x="30" y="105" fill="#FFF" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="1" transform="rotate(-90, 30, 105)">
            COMMERCIAL 19KG
          </text>
          {/* Cylinder 2 */}
          <rect x="68" y="25" width="60" height="150" rx="20" fill="#C0392B" stroke="#922B21" strokeWidth="3" />
          <rect x="83" y="5" width="30" height="25" rx="4" fill="#922B21" />
          {/* Gas Pipe (Reinforced orange rubber) */}
          <path d="M 98 12 Q 150 -20 220 50" fill="none" stroke="#E67E22" strokeWidth="6" />
        </g>

        {/* Stacked Crates of Cabbage & Potatoes (Wholesale APMC Market) */}
        <g transform="translate(1420, 520)">
          {/* Bottom Crate (Wooden Slats) */}
          <rect x="0" y="90" width="220" height="90" fill="#B9770E" stroke="#7E5109" strokeWidth="3" rx="4" />
          <line x1="0" y1="120" x2="220" y2="120" stroke="#7E5109" strokeWidth="3" />
          <line x1="0" y1="150" x2="220" y2="150" stroke="#7E5109" strokeWidth="3" />
          {/* Potatoes inside crate */}
          <circle cx="40" cy="115" r="14" fill="#D4AC0D" />
          <circle cx="70" cy="110" r="16" fill="#B7950B" />
          <circle cx="105" cy="116" r="15" fill="#D4AC0D" />
          <circle cx="140" cy="112" r="14" fill="#B7950B" />
          <circle cx="175" cy="115" r="16" fill="#D4AC0D" />

          {/* Top Crate: Cabbages (Green Heads) */}
          <rect x="15" y="10" width="190" height="80" fill="#A04000" stroke="#6E2C00" strokeWidth="3" rx="4" />
          <line x1="15" y1="36" x2="205" y2="36" stroke="#6E2C00" strokeWidth="2.5" />
          <line x1="15" y1="62" x2="205" y2="62" stroke="#6E2C00" strokeWidth="2.5" />
          {/* Cabbage round heads */}
          <circle cx="45" cy="30" r="18" fill="#2ECC71" stroke="#27AE60" strokeWidth="2" />
          <circle cx="78" cy="25" r="20" fill="#27AE60" stroke="#1E8449" strokeWidth="2" />
          <circle cx="115" cy="28" r="19" fill="#2ECC71" stroke="#27AE60" strokeWidth="2" />
          <circle cx="150" cy="24" r="18" fill="#58D68D" stroke="#27AE60" strokeWidth="2" />
          <circle cx="178" cy="32" r="17" fill="#2ECC71" stroke="#27AE60" strokeWidth="2" />

          {/* Stenciled Stamp */}
          <rect x="30" y="145" width="160" height="24" fill="#1C2833" rx="3" />
          <text x="110" y="161" fill="#F4D03F" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            KR MARKET WHOLESALE LOT
          </text>
        </g>

        {/* Stainless Steel Heavy Commercial Cooking Range & 60L Cauldron */}
        <g transform="translate(680, 430)">
          {/* Burner Base Table */}
          <rect x="0" y="210" width="460" height="90" fill="#7F8C8D" stroke="#34495E" strokeWidth="4" rx="4" />
          <rect x="10" y="220" width="440" height="25" fill="#BDC3C7" />
          {/* Legs */}
          <rect x="25" y="300" width="25" height="150" fill="#566573" />
          <rect x="410" y="300" width="25" height="150" fill="#566573" />

          {/* Cast Iron Burner Rings */}
          <rect x="60" y="195" width="140" height="15" rx="3" fill="#2C3E50" />
          <rect x="260" y="195" width="140" height="15" rx="3" fill="#2C3E50" />

          {/* Blue LPG Flames (Gas Burner) */}
          <g transform={`scale(${flameScale})`} style={{ transformOrigin: "130px 195px" }}>
            <polygon points="90,195 105,178 120,195" fill="#3498DB" />
            <polygon points="115,195 130,172 145,195" fill="#5DADE2" />
            <polygon points="140,195 155,178 170,195" fill="#3498DB" />
          </g>

          {/* GIANT 60-LITRE RICE CAULDRON (Aluminium Degchi) */}
          <path
            d="M 50,190 C 50,80 70,30 130,30 C 190,30 210,80 210,190 Z"
            fill="url(#cauldronGrad)"
            stroke="#566573"
            strokeWidth="4"
          />
          {/* Heavy Rim */}
          <ellipse cx="130" cy="30" rx="80" ry="18" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="3" />
          {/* Cauldron Handles */}
          <path d="M 45,70 Q 20,70 30,110 Q 45,100 48,85" fill="#566573" />
          <path d="M 215,70 Q 240,70 230,110 Q 215,100 212,85" fill="#566573" />

          {/* RISING STEAM PARTICLES */}
          <g transform={`translate(0, ${steam1Y})`} opacity={steam1Opacity}>
            <path d="M 110,20 Q 90,-20 120,-60" fill="none" stroke="#FFF" strokeWidth="8" strokeLinecap="round" filter="blur(4px)" />
          </g>
          <g transform={`translate(0, ${steam2Y})`} opacity={steam2Opacity}>
            <path d="M 140,20 Q 160,-25 130,-70" fill="none" stroke="#FFF" strokeWidth="7" strokeLinecap="round" filter="blur(4px)" />
          </g>

          {/* SECOND VESSEL: GIANT SAMBAR POT (Right Burner) */}
          <path
            d="M 265,190 L 265,90 L 395,90 L 395,190 Z"
            fill="#D5D8DC"
            stroke="#7F8C8D"
            strokeWidth="3.5"
          />
          {/* Rim */}
          <rect x="258" y="82" width="144" height="12" rx="3" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="2" />
          {/* Simmering yellow-orange sambar surface */}
          <ellipse cx="330" cy="94" rx="60" ry="8" fill="#E67E22" />
          {/* Stainless Steel Ladle sticking out */}
          <line x1="330" y1="94" x2="385" y2="10" stroke="#BDC3C7" strokeWidth="8" strokeLinecap="round" />
          <circle cx="390" cy="8" r="8" fill="#7F8C8D" />
        </g>

        {/* Gradient for Cauldron */}
        <defs>
          <linearGradient id="cauldronGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7F8C8D" />
            <stop offset="35%" stopColor="#BDC3C7" />
            <stop offset="70%" stopColor="#EAEDED" />
            <stop offset="100%" stopColor="#95A5A6" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3. KITCHEN FLOOR (Dark Grey Non-Slip Heavy Ceramic Tiles) */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          width: 1920,
          height: 360,
          backgroundColor: "#34495E",
          backgroundImage:
            "linear-gradient(rgba(44, 62, 80, 0.9) 2px, transparent 2px), linear-gradient(90deg, rgba(44, 62, 80, 0.9) 2px, transparent 2px)",
          backgroundSize: "80px 80px",
          borderTop: "6px solid #2C3E50",
        }}
      />

      {/* 4. CONTEXT CORNER BADGE (Opposite to Character side to prevent overlap) */}
      <div
        style={{
          position: "absolute",
          top: 48,
          [characterSide === "left" ? "right" : "left"]: 60,
          backgroundColor: "rgba(28, 30, 33, 0.88)",
          backdropFilter: "blur(8px)",
          padding: "12px 28px",
          borderRadius: 6,
          border: "2px solid #E67E22",
          textAlign: characterSide === "left" ? "right" : "left",
          zIndex: 40,
        }}
      >
        <div
          style={{
            color: "#F39C12",
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

      {/* 5. CHARACTER PUPPET ANCHOR (Strictly Left or Right, zero center collision) */}
      <CharacterPG
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={0.92}
        left={characterSide === "left" ? 140 : undefined}
        right={characterSide === "right" ? 140 : undefined}
        bottom={130}
      />
    </div>
  );
};
