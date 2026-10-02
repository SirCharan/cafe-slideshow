import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterFounderHouse, FHCharacterIdentity, FHCharacterPose, FHCharacterEmotion } from "../../CharacterFounderHouse";

export interface SceneFounderWaterfallProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: FHCharacterIdentity;
  characterPose?: FHCharacterPose;
  characterEmotion?: FHCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneFounderWaterfall: React.FC<SceneFounderWaterfallProps> = ({
  headline = "FORENSIC P&L WATERFALL · 14 BEDS",
  subheadline = "₹4,90,000 GROSS ➔ ONLY ₹70,000 NET PROFIT",
  characterIdentity = "forensic_accountant",
  characterPose = "pointing_ledger",
  characterEmotion = "serious",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Waterfall stagger animation
  const animProgress = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: "clamp" });

  const rows = [
    { label: "GROSS REVENUE (14 BEDS @ ₹35K)", amount: "+₹4,90,000", pct: "100%", color: "#22C55E", bg: "rgba(34, 197, 94, 0.15)", border: "#22C55E" },
    { label: "MASTER LEASE (8-BHK VILLA)", amount: "-₹2,60,000", pct: "-53.1%", color: "#EF4444", bg: "rgba(239, 68, 68, 0.12)", border: "#EF4444" },
    { label: "DOMESTIC STAFF (3 MEALS + CLEANING)", amount: "-₹60,000", pct: "-12.2%", color: "#F97316", bg: "rgba(249, 115, 22, 0.12)", border: "#F97316" },
    { label: "BESCOM POWER (14 ACs) + WATER TANKER", amount: "-₹35,000", pct: "-7.1%", color: "#EAB308", bg: "rgba(234, 179, 8, 0.12)", border: "#EAB308" },
    { label: "DUAL FIBER LEASED LINES (ACT + AIRTEL)", amount: "-₹25,000", pct: "-5.1%", color: "#3B82F6", bg: "rgba(59, 130, 246, 0.12)", border: "#3B82F6" },
    { label: "RUNWAY DEATHS & UNPAID RENT PROVISION", amount: "-₹40,000", pct: "-8.2%", color: "#A855F7", bg: "rgba(168, 85, 247, 0.12)", border: "#A855F7" },
    { label: "OPERATOR NET PROFIT (EBIT)", amount: "₹70,000", pct: "14.3%", color: "#10B981", bg: "rgba(16, 185, 129, 0.25)", border: "#10B981" },
  ];

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#080B11" }}>
      {/* 1. DARK FINTECH BACKGROUND WITH SUBTLE GRID */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          backgroundImage: "radial-gradient(#1E293B 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.45,
        }}
      />

      {/* 2. FORENSIC WATERFALL STACK (Center-Right: X: 640 to 1840) */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 80,
          width: 1100,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 15,
        }}
      >
        {rows.map((row, idx) => {
          const rowDelay = idx * 5;
          const rowOpacity = interpolate(frame - rowDelay, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const rowTranslateX = interpolate(frame - rowDelay, [0, 15], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const isFinal = idx === rows.length - 1;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isFinal ? "16px 28px" : "12px 24px",
                backgroundColor: row.bg,
                border: `2px solid ${row.border}`,
                borderRadius: 14,
                opacity: rowOpacity,
                transform: `translateX(${rowTranslateX}px)`,
                boxShadow: isFinal ? "0 10px 30px rgba(16, 185, 129, 0.3)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: row.color,
                  }}
                />
                <span
                  style={{
                    color: isFinal ? "#FFFFFF" : "#E2E8F0",
                    fontSize: isFinal ? 20 : 16,
                    fontWeight: isFinal ? 900 : 700,
                    letterSpacing: 0.5,
                  }}
                >
                  {row.label}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span
                  style={{
                    color: row.color,
                    fontSize: isFinal ? 28 : 22,
                    fontWeight: 900,
                    fontFamily: "monospace",
                  }}
                >
                  {row.amount}
                </span>
                <span
                  style={{
                    color: row.color,
                    fontSize: 14,
                    fontWeight: 800,
                    padding: "4px 10px",
                    borderRadius: 8,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    minWidth: 65,
                    textAlign: "right",
                  }}
                >
                  {row.pct}
                </span>
              </div>
            </div>
          );
        })}

        {/* 3. DANGER CALLOUT: 12 BEDS = ZERO MARGIN */}
        <div
          style={{
            marginTop: 10,
            padding: "14px 24px",
            backgroundColor: "rgba(220, 38, 38, 0.15)",
            border: "2px dashed #EF4444",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#FCA5A5", fontSize: 15, fontWeight: 800 }}>
            ⚠️ BREAK-EVEN FLOOR: 12 BEDS (85.7% OCCUPANCY)
          </span>
          <span style={{ color: "#EF4444", fontSize: 16, fontWeight: 900 }}>
            2 EMPTY BEDS = ₹0 PROFIT · 3 BEDS = CASH BLEED
          </span>
        </div>
      </div>

      {/* 4. SCENE METRIC BADGE (Top Center) */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(8, 11, 17, 0.94)",
          padding: "12px 36px",
          borderRadius: 16,
          border: "2px solid #10B981",
          boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
          zIndex: 20,
        }}
      >
        <span style={{ color: "#34D399", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>{headline}</span>
        <span style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, marginTop: 4 }}>{subheadline}</span>
      </div>

      {/* 5. CHARACTER RIG */}
      <CharacterFounderHouse
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={1.05}
        left={characterSide === "left" ? 140 : undefined}
        right={characterSide === "right" ? 140 : undefined}
        bottom={100}
      />
    </div>
  );
};
