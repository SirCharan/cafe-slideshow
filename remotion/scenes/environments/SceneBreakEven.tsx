import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SceneBreakEvenProps {
  headline?: string;
  subheadline?: string;
}

export const SceneBreakEven: React.FC<SceneBreakEvenProps> = ({
  headline = "DISSECTING THE ₹280 CUP",
  subheadline = "WHERE DOES THE CASH ACTUALLY GO?",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide-out animations for each cup slice
  const s1Offset = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const s2Offset = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const s3Offset = spring({ frame: frame - 45, fps, config: { damping: 14 } });
  const s4Offset = spring({ frame: frame - 60, fps, config: { damping: 14 } });
  const s5Offset = spring({ frame: frame - 75, fps, config: { damping: 14 } });

  const slices = [
    { label: "BEANS & FRESH MILK", amount: "₹35", pct: "12%", color: "#D35400", spring: s1Offset },
    { label: "BARISTAS & STAFF", amount: "₹42", pct: "15%", color: "#2980B9", spring: s2Offset },
    { label: "COMMERCIAL RENT", amount: "₹42", pct: "15%", color: "#8E44AD", spring: s3Offset },
    { label: "POWER, WATER & GST", amount: "₹50", pct: "18%", color: "#E67E22", spring: s4Offset },
    { label: "NET FOUNDER PROFIT", amount: "₹55", pct: "20%", color: "#27AE60", spring: s5Offset },
  ];

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        backgroundColor: "#F7F5F0",
        overflow: "hidden",
      }}
    >
      {/* 1. ARCHITECTURAL GRID BACKGROUND */}
      <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <pattern id="diagGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="40" y2="40" stroke="#EAE6DF" strokeWidth="1.5" />
            <line x1="40" y1="0" x2="0" y2="40" stroke="#EAE6DF" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#diagGrid)" />
      </svg>

      {/* 2. EXPLODED 2.5D CERAMIC CUP (LEFT SIDE) */}
      <div
        style={{
          position: "absolute",
          left: 180,
          top: 260,
          width: 520,
          height: 600,
        }}
      >
        <svg viewBox="0 0 520 600" width="100%" height="100%">
          {/* Saucer */}
          <ellipse cx="260" cy="540" rx="220" ry="40" fill="#E5E0D5" stroke="#2B2B2B" strokeWidth="8" />
          <ellipse cx="260" cy="535" rx="160" ry="24" fill="#F7F5F0" stroke="#2B2B2B" strokeWidth="4" />

          {/* Cup Handle */}
          <path
            d="M 400 240 C 490 240, 490 400, 400 420"
            fill="none"
            stroke="#2B2B2B"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 400 240 C 490 240, 490 400, 400 420"
            fill="none"
            stroke="#F7F5F0"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Slices of Cup */}
          {/* Slice 1: Beans & Milk (Top Foam Layer) */}
          <g transform={`translate(${slices[0].spring * 30}, 0)`}>
            <polygon points="110,180 410,180 395,240 125,240" fill={slices[0].color} stroke="#2B2B2B" strokeWidth="6" />
            <ellipse cx="260" cy="180" rx="150" ry="35" fill="#E8D7C3" stroke="#2B2B2B" strokeWidth="6" />
            <ellipse cx="260" cy="180" rx="120" ry="22" fill="#C8A27A" />
            {/* Latte art rosette */}
            <path d="M 230 180 Q 260 160 290 180 Q 260 200 230 180 Z" fill="#FFF" />
          </g>

          {/* Slice 2: Baristas & Staff */}
          <g transform={`translate(${slices[1].spring * 50}, 0)`}>
            <polygon points="125,248 395,248 380,310 140,310" fill={slices[1].color} stroke="#2B2B2B" strokeWidth="6" />
          </g>

          {/* Slice 3: Commercial Rent */}
          <g transform={`translate(${slices[2].spring * 70}, 0)`}>
            <polygon points="140,318 380,318 365,380 155,380" fill={slices[2].color} stroke="#2B2B2B" strokeWidth="6" />
          </g>

          {/* Slice 4: Power, Water & GST */}
          <g transform={`translate(${slices[3].spring * 90}, 0)`}>
            <polygon points="155,388 365,388 350,450 170,450" fill={slices[3].color} stroke="#2B2B2B" strokeWidth="6" />
          </g>

          {/* Slice 5: Net Founder Profit (Base) */}
          <g transform={`translate(${slices[4].spring * 110}, 0)`}>
            <polygon points="170,458 350,458 330,520 190,520" fill={slices[4].color} stroke="#2B2B2B" strokeWidth="6" />
          </g>
        </svg>
      </div>

      {/* 3. DYNAMIC DATA CALLOUT CARDS (RIGHT SIDE) */}
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 230,
          width: 950,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {slices.map((slice, index) => {
          const cardX = interpolate(slice.spring, [0, 1], [150, 0]);
          const opacity = interpolate(slice.spring, [0, 1], [0, 1]);

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#FFF",
                border: "4px solid #2B2B2B",
                borderLeft: `16px solid ${slice.color}`,
                borderRadius: 8,
                padding: "16px 28px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transform: `translateX(${cardX}px)`,
                opacity,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    backgroundColor: slice.color,
                    color: "#FFF",
                    fontWeight: 900,
                    fontSize: 18,
                    padding: "4px 12px",
                    borderRadius: 4,
                  }}
                >
                  {slice.pct}
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#2B2B2B", letterSpacing: 1 }}>
                  {slice.label}
                </span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: slice.color }}>
                {slice.amount}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. TOTAL TICKET BADGE */}
      <div
        style={{
          position: "absolute",
          left: 820,
          bottom: 70,
          width: 950,
          backgroundColor: "#2B2B2B",
          color: "#FFF",
          borderRadius: 8,
          border: "4px solid #E05A2B",
          padding: "18px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 14px 40px rgba(0,0,0,0.2)",
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>
          GROSS CUSTOMER PAYMENT
        </span>
        <span style={{ fontSize: 38, fontWeight: 900, color: "#F1C40F" }}>
          ₹280.00
        </span>
      </div>

      {/* 5. TOP HUD BANNER */}
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
