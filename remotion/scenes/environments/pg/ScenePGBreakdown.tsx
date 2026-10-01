import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterPG, PGCharacterIdentity, PGCharacterPose, PGCharacterEmotion } from "../../CharacterPG";

export interface ScenePGBreakdownProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: PGCharacterIdentity;
  characterPose?: PGCharacterPose;
  characterEmotion?: PGCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

interface BreakdownItem {
  label: string;
  amount: number;
  pct: string;
  description: string;
  color: string;
  accent: string;
  icon: string;
}

const BREAKDOWN_DATA: BreakdownItem[] = [
  {
    label: "BUILDING MASTER LEASE",
    amount: 4700,
    pct: "42.7%",
    description: "Paid directly to building owner (₹2.8L/mo commercial contract)",
    color: "#2C1B1E",
    accent: "#E74C3C",
    icon: "🏢",
  },
  {
    label: "FOOD & COOK WAGES",
    amount: 2700,
    pct: "24.5%",
    description: "3 meals/day @ ₹90/head + ₹55K kitchen staff salary",
    color: "#2C2314",
    accent: "#F39C12",
    icon: "🍚",
  },
  {
    label: "BESCOM POWER & WATER TANKERS",
    amount: 1100,
    pct: "10.0%",
    description: "LT-3 commercial rate + summer tanker backup",
    color: "#162838",
    accent: "#3498DB",
    icon: "⚡",
  },
  {
    label: "HOUSEKEEPING, WI-FI & REPAIRS",
    amount: 900,
    pct: "8.2%",
    description: "Cleaning staff, ACT Fibernet commercial, plumbing fixes",
    color: "#231A30",
    accent: "#9B59B6",
    icon: "🧹",
  },
  {
    label: "OPERATOR NET PROFIT",
    amount: 1600,
    pct: "14.5%",
    description: "True take-home operator earnings per bed",
    color: "#132D20",
    accent: "#2ECC71",
    icon: "💰",
  },
];

export const ScenePGBreakdown: React.FC<ScenePGBreakdownProps> = ({
  headline = "THE ₹11,000 BED DISSECTION",
  subheadline = "UNIT ECONOMICS OF A BANGALORE BED",
  characterIdentity = "pg_uncle",
  characterPose = "count_cash",
  characterEmotion = "neutral",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered reveal for slices
  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#111418" }}>
      {/* 1. DARK FINANCIAL BLUEPRINT GRID BACKGROUND */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          backgroundImage:
            "radial-gradient(circle at 75% 40%, rgba(46, 204, 113, 0.08) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      />

      {/* 2. HEADER TITLE IN OPPOSITE CORNER */}
      <div
        style={{
          position: "absolute",
          top: 48,
          [characterSide === "left" ? "right" : "left"]: 70,
          textAlign: characterSide === "left" ? "right" : "left",
          zIndex: 40,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            backgroundColor: "rgba(46, 204, 113, 0.15)",
            border: "1px solid #2ECC71",
            borderRadius: 4,
            color: "#2ECC71",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 6,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 1,
          }}
        >
          WHERE DOES THE ₹11,000 ACTUALLY GO?
        </div>
        <div
          style={{
            color: "#95A5A6",
            fontFamily: "system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          {subheadline} · Triple Sharing Bed Monthly Fee
        </div>
      </div>

      {/* 3. EXPLODED 2.5D FINANCIAL BREAKDOWN STACK (Strictly Right Half: left: 740px) */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: characterSide === "left" ? 760 : 120,
          width: 1040,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 30,
        }}
      >
        {BREAKDOWN_DATA.map((item, index) => {
          // Staggered slide and pop
          const enterProgress = spring({
            frame: frame - index * 6,
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const isProfit = index === 4;
          const barWidth = `${(item.amount / 11000) * 100}%`;

          return (
            <div
              key={item.label}
              style={{
                transform: `translateX(${(1 - enterProgress) * 60}px)`,
                opacity: enterProgress,
                backgroundColor: item.color,
                borderRadius: 10,
                border: `2px solid ${item.accent}`,
                padding: "16px 24px",
                boxShadow: isProfit
                  ? "0 0 24px rgba(46, 204, 113, 0.3), inset 0 0 16px rgba(46, 204, 113, 0.15)"
                  : "0 4px 14px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Row 1: Icon, Label, Percentage & Amount */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div>
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        color: "#FFFFFF",
                        letterSpacing: 1,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 12,
                        fontWeight: 800,
                        color: item.accent,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {item.pct}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isProfit ? 28 : 22,
                    fontWeight: 900,
                    color: isProfit ? "#2ECC71" : "#FFFFFF",
                    textShadow: isProfit ? "0 0 12px rgba(46, 204, 113, 0.6)" : "none",
                  }}
                >
                  ₹{item.amount.toLocaleString("en-IN")}
                  <span style={{ fontSize: 13, color: "#7F8C8D", fontWeight: 600, marginLeft: 4 }}>
                    /mo
                  </span>
                </div>
              </div>

              {/* Row 2: Relative Visual Fill Bar */}
              <div
                style={{
                  width: "100%",
                  height: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: barWidth,
                    height: "100%",
                    backgroundColor: item.accent,
                    borderRadius: 3,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Row 3: Concrete Explanation */}
              <div
                style={{
                  fontSize: 12,
                  color: "#BDC3C7",
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                {item.description}
              </div>
            </div>
          );
        })}

        {/* BOTTOM SUMMARY BADGE: Cluster Math */}
        <div
          style={{
            marginTop: 8,
            padding: "14px 20px",
            backgroundColor: "rgba(46, 204, 113, 0.1)",
            border: "1px dashed #2ECC71",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#E8F8F5", fontSize: 13, fontWeight: 700 }}>
            ⚡ <strong>Scale Effect:</strong> At 60 Beds = ₹96,000/mo net · At 180 Beds (3-Cluster) ={" "}
            <span style={{ color: "#2ECC71", fontWeight: 900 }}>₹2,88,000/mo Net Cashflow</span>
          </div>
          <div
            style={{
              padding: "4px 10px",
              backgroundColor: "#2ECC71",
              color: "#0E1626",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1,
            }}
          >
            REALITY CHECK
          </div>
        </div>
      </div>

      {/* 4. CHARACTER PUPPET ANCHOR (Strictly Left or Right, zero collision with breakdown card) */}
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
