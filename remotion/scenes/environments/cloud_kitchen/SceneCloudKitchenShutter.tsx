import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterCloudKitchen, CKCharacterIdentity, CKCharacterPose, CKCharacterEmotion } from "../../CharacterCloudKitchen";

export interface SceneCloudKitchenShutterProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: CKCharacterIdentity;
  characterPose?: CKCharacterPose;
  characterEmotion?: CKCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneCloudKitchenShutter: React.FC<SceneCloudKitchenShutterProps> = ({
  headline = "KORAMANGALA · 5TH BLOCK ALLEY",
  subheadline = "THE BACK-ALLEY FOOD FACTORY",
  characterIdentity = "kitchen_founder",
  characterPose = "point_tablet",
  characterEmotion = "confident",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Passing delivery bikes in alley
  const bikeX = interpolate(frame % 220, [0, 220], [-250, 2150]);
  const neonFlicker = Math.sin((frame / fps) * 12) > 0.85 ? 0.4 : 1.0;
  const steamOffset = (frame * 1.5) % 80;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#17202A" }}>
      {/* 1. DARK NIGHT ALLEY SKY WITH BANGALORE RESIDENTIAL GLOW */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 480,
          background: "linear-gradient(180deg, #0B0E14 0%, #1A252F 70%, #212F3D 100%)",
        }}
      />

      {/* 2. INDUSTRIAL BACK-ALLEY ENVIRONMENT (SVG) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Grimy Concrete Back Wall */}
        <rect x="0" y="240" width="1920" height="660" fill="#2C3E50" />
        <rect x="0" y="240" width="1920" height="30" fill="#1C2833" />

        {/* Tangled Bangalore Overhead Power & Wi-Fi Cables */}
        {[0, 1, 2, 3].map((c) => (
          <path
            key={c}
            d={`M 0 ${60 + c * 25} Q 960 ${120 + c * 35 + Math.sin(frame / 30 + c) * 4} 1920 ${80 + c * 20}`}
            fill="none"
            stroke="#0B0E14"
            strokeWidth={3 - c * 0.4}
            opacity="0.85"
          />
        ))}

        {/* 5 INDUSTRIAL COMMERCIAL EXHAUST DUCTS (Iconic Cloud Kitchen Tell) */}
        {[320, 480, 640, 800, 960].map((dx, i) => (
          <g key={dx}>
            {/* Stainless Exhaust Pipe running up to roof */}
            <rect x={dx} y="60" width="65" height="240" fill="#7F8C8D" stroke="#34495E" strokeWidth="3" />
            <ellipse cx={dx + 32} cy="60" rx="32" ry="12" fill="#95A5A6" stroke="#34495E" strokeWidth="2" />
            {/* Grease Drip Tray under duct */}
            <rect x={dx - 5} y="220" width="75" height="15" fill="#1C2833" rx="3" />
            {/* Animated Rising Steam / Smoke Plume */}
            <circle
              cx={dx + 32 + Math.sin((frame + i * 20) / 10) * 12}
              cy={50 - steamOffset}
              r={18 + steamOffset * 0.4}
              fill="rgba(236, 240, 241, 0.22)"
            />
            <circle
              cx={dx + 28 - Math.sin((frame + i * 25) / 12) * 15}
              cy={30 - steamOffset * 0.7}
              r={24 + steamOffset * 0.3}
              fill="rgba(189, 195, 199, 0.15)"
            />
          </g>
        ))}

        {/* THE MAIN GREASE-STAINED ROLLING SHUTTER (250 sqft Shutter) */}
        <rect x="220" y="300" width="880" height="580" fill="#34495E" stroke="#1A252F" strokeWidth="6" rx="4" />
        {/* Shutter Horizontal Slats */}
        {Array.from({ length: 28 }).map((_, slatIdx) => (
          <line
            key={slatIdx}
            x1="220"
            y1={320 + slatIdx * 20}
            x2="1100"
            y2={320 + slatIdx * 20}
            stroke="#2C3E50"
            strokeWidth="3"
          />
        ))}

        {/* Central Lock Hasp with Heavy Godrej Padlock */}
        <rect x="640" y="840" width="40" height="35" fill="#F1C40F" stroke="#7D6608" strokeWidth="3" rx="4" />
        <circle cx="660" cy="855" r="4" fill="#1C2833" />

        {/* 4 GLOWING NEON VIRTUAL BRAND LOGOS MOUNTED ON WALL */}
        {/* Brand 1: Biryani Darbar */}
        <g opacity={neonFlicker}>
          <rect x="240" y="330" width="180" height="60" rx="8" fill="#1C2833" stroke="#F39C12" strokeWidth="3" />
          <text x="330" y="365" textAnchor="middle" fill="#F1C40F" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            BIRYANI DARBAR
          </text>
          <text x="330" y="380" textAnchor="middle" fill="#E67E22" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            DUM & HYDERABADI
          </text>
        </g>

        {/* Brand 2: Green Bowl Co. */}
        <g>
          <rect x="450" y="330" width="180" height="60" rx="8" fill="#1C2833" stroke="#2ECC71" strokeWidth="3" />
          <text x="540" y="365" textAnchor="middle" fill="#2ECC71" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            GREEN BOWL CO.
          </text>
          <text x="540" y="380" textAnchor="middle" fill="#1ABC9C" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            HEALTHY SALADS
          </text>
        </g>

        {/* Brand 3: Midnight Smash Burgers */}
        <g opacity={neonFlicker * 0.95}>
          <rect x="660" y="330" width="200" height="60" rx="8" fill="#1C2833" stroke="#E74C3C" strokeWidth="3" />
          <text x="760" y="365" textAnchor="middle" fill="#E74C3C" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            MIDNIGHT BURGERS
          </text>
          <text x="760" y="380" textAnchor="middle" fill="#C0392B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            11 PM - 4 AM DELIVERIES
          </text>
        </g>

        {/* Brand 4: Rolls of Punjab */}
        <g>
          <rect x="890" y="330" width="180" height="60" rx="8" fill="#1C2833" stroke="#E67E22" strokeWidth="3" />
          <text x="980" y="365" textAnchor="middle" fill="#E67E22" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            ROLLS OF PUNJAB
          </text>
          <text x="980" y="380" textAnchor="middle" fill="#F39C12" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
            KATHI & WRAPS
          </text>
        </g>

        {/* Grease & Soot Stains running down shutter */}
        <path d="M 400 300 Q 410 450 395 550" stroke="rgba(11, 14, 20, 0.4)" strokeWidth="12" fill="none" />
        <path d="M 780 300 Q 770 420 785 580" stroke="rgba(11, 14, 20, 0.35)" strokeWidth="16" fill="none" />

        {/* ALLEY ASPHALT & WET ROAD WITH REFLECTIONS */}
        <rect x="0" y="880" width="1920" height="200" fill="#17202A" />
        <rect x="0" y="880" width="1920" height="12" fill="#1C2833" />
        {/* Puddle reflection of neon sign */}
        <ellipse cx="500" cy="940" rx="140" ry="25" fill="#1C2833" stroke="#2ECC71" strokeWidth="1" opacity="0.4" />
        <ellipse cx="800" cy="950" rx="160" ry="28" fill="#1C2833" stroke="#E74C3C" strokeWidth="1" opacity="0.4" />

        {/* PASSING SWIGGY / ZOMATO DELIVERY BIKE IN BACKGROUND */}
        <g transform={`translate(${bikeX}, 875)`}>
          {/* Wheels */}
          <circle cx="40" cy="30" r="18" fill="#0B0E14" stroke="#7F8C8D" strokeWidth="4" />
          <circle cx="130" cy="30" r="18" fill="#0B0E14" stroke="#7F8C8D" strokeWidth="4" />
          {/* Scooter Frame */}
          <path d="M 40 30 L 70 15 L 105 15 L 130 30" stroke="#FC8019" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Thermal Orange Delivery Box */}
          <rect x="45" y="-20" width="40" height="35" rx="4" fill="#FC8019" />
          <text x="50" y="0" fontSize="10" fill="#FFFFFF" fontWeight="bold">SWIGGY</text>
          {/* Rider Silhouette */}
          <circle cx="95" cy="-25" r="10" fill="#1C2833" />
          <path d="M 85 -15 L 105 -15 L 100 15 L 85 15 Z" fill="#2C3E50" />
          {/* Headlight beam on road */}
          <polygon points="140,25 240,40 240,10 140,20" fill="rgba(241, 196, 15, 0.25)" />
        </g>
      </svg>

      {/* 3. HEADLINE BADGE & STREET SIGN (TOP-LEFT) */}
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
            backgroundColor: "rgba(231, 76, 60, 0.2)",
            border: "1px solid #E74C3C",
            padding: "4px 14px",
            borderRadius: 6,
            color: "#E74C3C",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#E74C3C" }} />
          {headline}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: "-0.01em" }}>
          {subheadline}
        </div>
      </div>

      {/* 4. CHARACTER (Strict Left vs Right split geometry - zero text overlap) */}
      {characterSide === "left" ? (
        <CharacterCloudKitchen
          identity={characterIdentity}
          pose={characterPose}
          emotion={characterEmotion}
          isTalking={isTalking}
          scale={1.25}
          left={140}
          bottom={120}
        />
      ) : (
        <CharacterCloudKitchen
          identity={characterIdentity}
          pose={characterPose}
          emotion={characterEmotion}
          isTalking={isTalking}
          scale={1.25}
          flipX={true}
          right={140}
          bottom={120}
        />
      )}
    </div>
  );
};
