import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterCloudKitchen, CKCharacterIdentity, CKCharacterPose, CKCharacterEmotion } from "../../CharacterCloudKitchen";

export interface SceneCloudKitchenInteriorProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: CKCharacterIdentity;
  characterPose?: CKCharacterPose;
  characterEmotion?: CKCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneCloudKitchenInterior: React.FC<SceneCloudKitchenInteriorProps> = ({
  headline = "THE HOT LINE & PREP STATION",
  subheadline = "250 SQFT COMMERCIAL KITCHEN",
  characterIdentity = "chef_murugan",
  characterPose = "holding_ladle",
  characterEmotion = "stressed",
  characterSide = "right",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Steam rising from biryani handis
  const steamY = (frame * 2.2) % 100;
  const gasFlameFlicker = Math.sin((frame / fps) * 20) * 3;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#1A252F" }}>
      {/* 1. INDUSTRIAL COMMERCIAL KITCHEN TILES (BACKGROUND) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Stainless Steel Backsplash Wall Panels */}
        <rect x="0" y="0" width="1920" height="740" fill="#2C3E50" />
        {/* Wall Panel Seams */}
        {[300, 600, 900, 1200, 1500, 1800].map((px) => (
          <line key={px} x1={px} y1="0" x2={px} y2="740" stroke="#34495E" strokeWidth="3" />
        ))}

        {/* GIANT OVERHEAD STAINLESS EXHAUST HOOD WITH FILTERS */}
        <rect x="180" y="40" width="1560" height="140" fill="#7F8C8D" stroke="#34495E" strokeWidth="5" />
        {/* Baffle Filters inside hood */}
        {Array.from({ length: 18 }).map((_, fIdx) => (
          <rect key={fIdx} x={220 + fIdx * 82} y="70" width="70" height="90" fill="#95A5A6" stroke="#5D6D7E" strokeWidth="2" />
        ))}
        {/* Overhead Fluorescent Tube Lights */}
        <rect x="300" y="185" width="400" height="12" fill="#EBF5FB" rx="4" />
        <rect x="1100" y="185" width="400" height="12" fill="#EBF5FB" rx="4" />

        {/* COMMERCIAL 4-BURNER RANGE & HEAVY BIRYANI HANDIS (LEFT SIDE: X=200 to 900) */}
        <rect x="220" y="520" width="720" height="360" fill="#34495E" stroke="#1C2833" strokeWidth="4" />
        {/* Gas Burner Grates */}
        {[300, 520, 740].map((bx) => (
          <g key={bx}>
            <ellipse cx={bx + 60} cy="520" rx="75" ry="18" fill="#1C2833" stroke="#7F8C8D" strokeWidth="3" />
            {/* Blue LPG Flames under handi */}
            <path
              d={`M ${bx + 20} 515 Q ${bx + 60} ${495 + gasFlameFlicker} ${bx + 100} 515 Z`}
              fill="#3498DB"
              opacity="0.85"
            />
            {/* Giant Traditional Copper & Brass Biryani Handi */}
            <path
              d={`M ${bx + 15} 510 L ${bx + 5} 390 Q ${bx + 60} 370 ${bx + 115} 390 L ${bx + 105} 510 Z`}
              fill="#D35400"
              stroke="#BA4A00"
              strokeWidth="4"
            />
            {/* Handi Brass Lid & Dough Seal (Dum Pukht) */}
            <ellipse cx={bx + 60} cy="385" rx="58" ry="14" fill="#F39C12" stroke="#B7950B" strokeWidth="3" />
            <rect x={bx + 10} y="380" width="100" height="10" rx="3" fill="#F9E79F" />
            <circle cx={bx + 60} cy="370" r="10" fill="#B7950B" />

            {/* Rising Dum Steam Plumes */}
            <circle
              cx={bx + 60 + Math.sin((frame + bx) / 12) * 10}
              cy={350 - steamY}
              r={16 + steamY * 0.3}
              fill="rgba(255, 255, 255, 0.2)"
            />
            <circle
              cx={bx + 50 - Math.sin((frame + bx) / 15) * 12}
              cy={320 - steamY * 0.8}
              r={22 + steamY * 0.25}
              fill="rgba(236, 240, 241, 0.14)"
            />
          </g>
        ))}

        {/* PESO-APPROVED COMMERCIAL LPG COPPER PIPELINE */}
        <line x1="180" y1="620" x2="980" y2="620" stroke="#F1C40F" strokeWidth="10" />
        <circle cx="220" cy="620" r="14" fill="#C0392B" />
        <circle cx="940" cy="620" r="14" fill="#C0392B" />
        {/* Emergency Gas Shutoff Valve */}
        <rect x="560" y="605" width="40" height="30" rx="4" fill="#E74C3C" />
        <text x="566" y="625" fontSize="10" fill="#FFFFFF" fontWeight="bold">EMRG</text>

        {/* STAINLESS COMMERCIAL PREP TABLES (RIGHT SIDE: X=1000 to 1750) */}
        <rect x="1020" y="540" width="740" height="340" fill="#95A5A6" stroke="#5D6D7E" strokeWidth="4" />
        <rect x="1020" y="520" width="740" height="25" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="2" />
        {/* Table Shelf with stacked delivery containers */}
        <rect x="1060" y="660" width="660" height="15" fill="#7F8C8D" />
        {/* Stacked 750ml Virgin PP round containers */}
        {[1080, 1150, 1220, 1290].map((cx) => (
          <g key={cx}>
            {[0, 1, 2, 3, 4].map((tier) => (
              <rect
                key={tier}
                x={cx}
                y={640 - tier * 18}
                width="50"
                height="14"
                rx="3"
                fill="#ECF0F1"
                stroke="#BDC3C7"
                strokeWidth="1.5"
              />
            ))}
          </g>
        ))}

        {/* Red Cutting Board with Marinated Poultry */}
        <rect x="1440" y="510" width="140" height="12" rx="3" fill="#C0392B" />
        <ellipse cx="1510" cy="505" rx="30" ry="12" fill="#E59866" />
        {/* Chef Cleaver / Knife */}
        <rect x="1560" y="495" width="40" height="20" rx="2" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="1" />
        <rect x="1600" y="500" width="20" height="10" rx="2" fill="#5D4037" />

        {/* KITCHEN NON-SLIP CERAMIC TILE FLOOR */}
        <rect x="0" y="860" width="1920" height="220" fill="#1C2833" />
        {/* Stainless Steel Central Floor Drain Grate */}
        <rect x="740" y="930" width="440" height="40" fill="#34495E" stroke="#5D6D7E" strokeWidth="2" />
        {Array.from({ length: 22 }).map((_, dIdx) => (
          <line
            key={dIdx}
            x1={760 + dIdx * 18}
            y1="935"
            x2={760 + dIdx * 18}
            y2="965"
            stroke="#17202A"
            strokeWidth="3"
          />
        ))}
      </svg>

      {/* 2. HEADLINE BADGE (TOP-LEFT) */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 60,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 15,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "rgba(243, 156, 18, 0.15)",
            border: "1px solid #F39C12",
            padding: "4px 14px",
            borderRadius: 6,
            color: "#F39C12",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#F39C12" }} />
          {headline}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: "-0.01em" }}>
          {subheadline}
        </div>
      </div>

      {/* 3. CHARACTER (Strict Left vs Right split geometry - zero text overlap) */}
      {characterSide === "right" ? (
        <CharacterCloudKitchen
          identity={characterIdentity}
          pose={characterPose}
          emotion={characterEmotion}
          isTalking={isTalking}
          scale={1.25}
          flipX={true}
          right={140}
          bottom={110}
        />
      ) : (
        <CharacterCloudKitchen
          identity={characterIdentity}
          pose={characterPose}
          emotion={characterEmotion}
          isTalking={isTalking}
          scale={1.25}
          left={140}
          bottom={110}
        />
      )}
    </div>
  );
};
