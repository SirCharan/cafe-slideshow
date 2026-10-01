import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterPG, PGCharacterIdentity, PGCharacterPose, PGCharacterEmotion } from "../../CharacterPG";

export interface ScenePGStreetProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: PGCharacterIdentity;
  characterPose?: PGCharacterPose;
  characterEmotion?: PGCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const ScenePGStreet: React.FC<ScenePGStreetProps> = ({
  headline = "MARATHAHALLI · BTM LAYOUT",
  subheadline = "THE BANGALORE PG GOLD RUSH",
  characterIdentity = "pg_uncle",
  characterPose = "point_keys",
  characterEmotion = "neutral",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle street ambiance drift
  const autoRickshawX = interpolate(frame % 240, [0, 240], [-200, 2100]);
  const cableSway = Math.sin((frame / fps) * 2) * 4;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#EAECEE" }}>
      {/* 1. SKY & DISTANT BANGALORE TECH PARKS */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 520,
          background: "linear-gradient(180deg, #AED6F1 0%, #D4E6F1 60%, #EAECEE 100%)",
        }}
      />

      {/* 2. 4-STOREY CONCRETE PG BUILDING (BACKGROUND) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Main 4-Storey Building */}
        <rect x="240" y="80" width="820" height="740" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="4" />

        {/* Building Floors & Balconies */}
        {[0, 1, 2, 3].map((floor) => {
          const y = 140 + floor * 160;
          return (
            <g key={floor}>
              <rect x="260" y={y} width="780" height="130" fill="#D5D8DC" stroke="#95A5A6" strokeWidth="2" />
              {/* Windows with AC Units & Drying Clothes */}
              <rect x="300" y={y + 15} width="85" height="90" fill="#2C3E50" rx="4" />
              <rect x="440" y={y + 15} width="85" height="90" fill="#2C3E50" rx="4" />
              <rect x="580" y={y + 15} width="85" height="90" fill="#2C3E50" rx="4" />
              <rect x="720" y={y + 15} width="85" height="90" fill="#2C3E50" rx="4" />
              <rect x="860" y={y + 15} width="85" height="90" fill="#2C3E50" rx="4" />

              {/* Balcony Railings */}
              <line x1="280" y1={y + 85} x2="980" y2={y + 85} stroke="#7F8C8D" strokeWidth="3" />
              <line x1="280" y1={y + 105} x2="980" y2={y + 105} stroke="#7F8C8D" strokeWidth="3" />
              {/* Drying colorful clothes */}
              <rect x="320" y={y + 75} width="25" height="30" fill="#E74C3C" rx="2" />
              <rect x="360" y={y + 75} width="30" height="28" fill="#3498DB" rx="2" />
              <rect x="600" y={y + 75} width="35" height="32" fill="#F39C12" rx="2" />
              <rect x="750" y={y + 75} width="28" height="28" fill="#1ABC9C" rx="2" />
            </g>
          );
        })}

        {/* GIANT COLORFUL VINYL FLEX BANNER (Iconic Bangalore PG Tell) */}
        <rect x="440" y="40" width="620" height="95" fill="#C0392B" rx="6" stroke="#922B21" strokeWidth="4" />
        <rect x="446" y="46" width="608" height="83" fill="#E74C3C" rx="4" />
        <text
          x="750"
          y="80"
          fill="#FFF"
          fontSize="24"
          fontWeight="900"
          fontFamily="'Space Grotesk', sans-serif"
          textAnchor="middle"
          letterSpacing="2"
        >
          SRI BALAJI EXECUTIVE LUXURY GENTS PG
        </text>
        <text
          x="750"
          y="110"
          fill="#F4D03F"
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          3 TIMES FOOD • HIGH-SPEED WI-FI • 24/7 HOT WATER • POWER BACKUP
        </text>

        {/* Overhead Tangled Optical Cables (Iconic Bangalore Street Detail) */}
        <path
          d={`M 0 160 Q 600 ${220 + cableSway} 1920 170`}
          fill="none"
          stroke="#1C2833"
          strokeWidth="3.5"
        />
        <path
          d={`M 0 175 Q 800 ${240 - cableSway} 1920 185`}
          fill="none"
          stroke="#2C3E50"
          strokeWidth="3"
        />
        <path
          d={`M 0 190 Q 500 ${260 + cableSway * 0.8} 1920 205`}
          fill="none"
          stroke="#17202A"
          strokeWidth="2.5"
        />

        {/* Entrance Gate & Shoe Racks */}
        <rect x="480" y="680" width="220" height="140" fill="#2C3E50" rx="4" />
        <rect x="495" y="695" width="90" height="125" fill="#1C2833" />
        <rect x="595" y="695" width="90" height="125" fill="#1C2833" />
        {/* Layered Shoe Racks outside */}
        <rect x="730" y="740" width="130" height="75" fill="#7F8C8D" rx="3" stroke="#566573" strokeWidth="2" />
        <line x1="730" y1="765" x2="860" y2="765" stroke="#34495E" strokeWidth="2" />
        <line x1="730" y1="790" x2="860" y2="790" stroke="#34495E" strokeWidth="2" />
      </svg>

      {/* 3. STREET GROUND & FOOTPATH */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 280,
          backgroundColor: "#34495E",
          borderTop: "14px solid #7F8C8D",
        }}
      >
        {/* Footpath Pavers */}
        <div style={{ width: "100%", height: 35, backgroundColor: "#95A5A6", opacity: 0.9 }} />
        {/* Asphalt road yellow centerline */}
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 0,
            width: "100%",
            height: 8,
            borderBottom: "4px dashed #F1C40F",
          }}
        />
      </div>

      {/* 4. PASSING AUTO-RICKSHAW IN BACKGROUND */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: autoRickshawX,
          width: 120,
          height: 70,
          pointerEvents: "none",
          opacity: 0.85,
        }}
      >
        <svg viewBox="0 0 120 70" width="120" height="70">
          {/* Yellow Top, Green Bottom (Bangalore Auto) */}
          <path d="M 10 50 L 30 20 L 95 20 L 115 50 Z" fill="#F1C40F" />
          <rect x="15" y="42" width="95" height="20" fill="#27AE60" rx="3" />
          <circle cx="35" cy="62" r="8" fill="#17202A" />
          <circle cx="95" cy="62" r="8" fill="#17202A" />
        </svg>
      </div>

      {/* 5. TOP HEADLINE BANNER */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          backgroundColor: "rgba(28, 30, 33, 0.85)",
          backdropFilter: "blur(8px)",
          padding: "12px 28px",
          borderRadius: 6,
          border: "2px solid #E74C3C",
          textAlign: "right",
          zIndex: 40,
        }}
      >
        <div
          style={{
            color: "#F4D03F",
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

      {/* 6. CHARACTER PUPPET ANCHOR (Strictly Left or Right, zero center collision) */}
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
