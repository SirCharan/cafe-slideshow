import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../Character";

export interface SceneSeatingProps {
  isRainy?: boolean;
  timeString?: string;
  headline?: string;
  subheadline?: string;
}

export const SceneSeating: React.FC<SceneSeatingProps> = ({
  isRainy = true,
  timeString = "3:15 PM · TUESDAY",
  headline = "THE LAPTOP SQUATTER REALITY",
  subheadline = "4 HOURS · 1 AMERICANO · 3-PHASE POWER RUNNING",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow tracking pan
  const panX = interpolate(frame, [0, fps * 8], [0, -40], {
    extrapolateRight: "clamp",
  });

  // Clock second hand rotation
  const clockAngle = (frame * 6) % 360;

  // Digital electric meter spinning counter
  const kwhUnits = (1420 + Math.floor(frame * 0.4)).toFixed(1);

  // Rain streaks animation
  const rainOffset = (frame * 18) % 300;

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        backgroundColor: isRainy ? "#E6E9EB" : "#F7F5F0",
        overflow: "hidden",
        transform: `translateX(${panX}px)`,
      }}
    >
      {/* 1. LARGE MONSOON WINDOW (LEFT SIDE) (Z: 0) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          width: 600,
          height: 680,
          backgroundColor: isRainy ? "#C8D1D8" : "#E2EEF8",
          border: "12px solid #2B2B2B",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* Bangalore rain streaks running down glass */}
        {isRainy && (
          <svg width="600" height="680" style={{ position: "absolute", top: 0, left: 0 }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={i}
                x1={(i * 35 + 20)}
                y1={((i * 45 + rainOffset) % 700) - 100}
                x2={(i * 35 + 10)}
                y2={((i * 45 + rainOffset) % 700) + 40}
                stroke="#FFF"
                strokeWidth="2.5"
                opacity="0.6"
              />
            ))}
            {/* Water drops pooling at bottom */}
            <circle cx="120" cy="620" r="5" fill="#FFF" opacity="0.5" />
            <circle cx="280" cy="640" r="7" fill="#FFF" opacity="0.6" />
            <circle cx="450" cy="610" r="4" fill="#FFF" opacity="0.4" />
          </svg>
        )}
      </div>

      {/* 2. BESCOM 3-PHASE DIGITAL ELECTRICITY METER ON WALL (Z: 1) */}
      <div
        style={{
          position: "absolute",
          top: 90,
          right: 180,
          width: 240,
          height: 280,
          backgroundColor: "#F2F4F4",
          border: "6px solid #2B2B2B",
          borderRadius: 10,
          padding: 16,
          boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 900, color: "#C0392B", letterSpacing: 1.5 }}>
          BESCOM · 3-PHASE TARIFF
        </div>
        {/* LCD Counter */}
        <div
          style={{
            backgroundColor: "#2B2B2B",
            color: "#FF5722",
            fontFamily: "monospace",
            fontSize: 28,
            fontWeight: 900,
            padding: "8px 12px",
            borderRadius: 4,
            marginTop: 14,
            textAlign: "right",
            letterSpacing: 3,
          }}
        >
          {kwhUnits} <span style={{ fontSize: 14, color: "#AAA" }}>kWh</span>
        </div>
        {/* Pulsing Red Imp/kWh LED */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 16, gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: frame % 12 < 6 ? "#FF1744" : "#4A000E",
              boxShadow: frame % 12 < 6 ? "0 0 10px #FF1744" : "none",
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>PULSE / 1600 imp</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#2B2B2B", marginTop: 22, borderTop: "2px dashed #CCC", paddingTop: 8 }}>
          BURN RATE: ₹14.50 / UNIT
        </div>
      </div>

      {/* 3. WALL CLOCK (Z: 1) */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 740,
          width: 140,
          height: 140,
          borderRadius: "50%",
          backgroundColor: "#FFF",
          border: "8px solid #2B2B2B",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <svg viewBox="0 0 140 140" width="100%" height="100%">
          <circle cx="70" cy="70" r="4" fill="#2B2B2B" />
          {/* Hour hand pointing at 3 */}
          <line x1="70" y1="70" x2="105" y2="72" stroke="#2B2B2B" strokeWidth="6" strokeLinecap="round" />
          {/* Minute hand pointing at 15 */}
          <line x1="70" y1="70" x2="70" y2="30" stroke="#2B2B2B" strokeWidth="4" strokeLinecap="round" />
          {/* Dynamic second hand */}
          <line
            x1="70"
            y1="70"
            x2="70"
            y2="20"
            stroke="#E05A2B"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${clockAngle} 70 70)`}
          />
        </svg>
      </div>

      {/* 4. LAPTOP CAMPERS SITTING AT TABLE (Z: 2) */}
      <Character identity="camper" pose="sitting" emotion="focus" scale={0.92} left={280} bottom={200} />
      <Character identity="founder" pose="sitting" emotion="stress" scale={0.92} flipX={true} left={620} bottom={200} />


      {/* 5. LONG COMMUNAL WOODEN TABLE (Z: 3) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 120,
          width: 1720,
          height: 290,
          backgroundColor: "#4E3629", // Teak wood
          borderTop: "14px solid #C86236",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 -16px 40px rgba(0,0,0,0.22)",
        }}
      >
        {/* Tangle of MacBook Chargers & Spike Buster on table */}
        <div
          style={{
            position: "absolute",
            top: -24,
            left: 540,
            width: 180,
            height: 36,
            backgroundColor: "#FFF",
            border: "4px solid #2B2B2B",
            borderRadius: 6,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#E74C3C" }} />
          <div style={{ width: 14, height: 14, backgroundColor: "#2B2B2B", borderRadius: 2 }} />
          <div style={{ width: 14, height: 14, backgroundColor: "#2B2B2B", borderRadius: 2 }} />
          <div style={{ width: 14, height: 14, backgroundColor: "#2B2B2B", borderRadius: 2 }} />
        </div>

        {/* Solitary Finished Americano Cup with Drips */}
        <div style={{ position: "absolute", top: -35, left: 450 }}>
          <svg width="40" height="35" viewBox="0 0 40 35">
            <path d="M 4 0 L 36 0 L 30 30 Q 20 34 10 30 Z" fill="#F7F5F0" stroke="#2B2B2B" strokeWidth="4" />
            <path d="M 36 6 Q 44 14 34 22" fill="none" stroke="#2B2B2B" strokeWidth="3" />
            <ellipse cx="20" cy="6" rx="14" ry="4" fill="#3E2723" opacity="0.35" />
          </svg>
        </div>
      </div>

      {/* 6. TOP HUD TIMESTAMP BANNER */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 64,
          backgroundColor: "#2B2B2B",
          color: "#F7F5F0",
          padding: "16px 32px",
          borderRadius: 8,
          border: "3px solid #E05A2B",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>{headline}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#E07A5F", marginTop: 4, letterSpacing: 1.5 }}>
          {subheadline}
        </div>
      </div>
    </div>
  );
};
