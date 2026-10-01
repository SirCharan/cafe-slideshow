import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../Character";

export interface SceneLeaseTableProps {
  depositAmount?: string;
  headline?: string;
  subheadline?: string;
}

export const SceneLeaseTable: React.FC<SceneLeaseTableProps> = ({
  depositAmount = "₹25,00,000",
  headline = "THE 10-MONTH DEPOSIT LOCKUP",
  subheadline = "DEAD CAPITAL FROZEN BEFORE CUP ONE",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vault dial spin animation
  const dialRotation = (frame * 12) % 360;

  // Vault door closing progress (closes between frames 40 and 70)
  const doorWidth = interpolate(frame, [40, 70], [280, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        backgroundColor: "#EFECE6",
        overflow: "hidden",
      }}
    >
      {/* 1. RETRO FORMAL OFFICE WALLPAPER (Z: 0) */}
      <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DFD9CD" />
            <stop offset="100%" stopColor="#CDC4B3" />
          </linearGradient>
        </defs>
        <rect width="1920" height="780" fill="url(#wallGrad)" />
        {/* Wainscoting wood paneling lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={i * 170}
            y1={0}
            x2={i * 170}
            y2={780}
            stroke="#BCB39E"
            strokeWidth="3"
            strokeDasharray="16 10"
          />
        ))}
      </svg>

      {/* 2. CHARACTERS: FOUNDER & LANDLORD (Z: 1) */}
      <Character identity="founder" pose="hand_money" emotion="stress" scale={0.95} left={160} bottom={230} />
      <Character identity="landlord" pose="cross_arms" emotion="neutral" scale={1.05} left={680} bottom={230} />


      {/* 3. MASSIVE IRON SAFE VAULT (RIGHT SIDE) (Z: 1) */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 140,
          width: 440,
          height: 600,
          backgroundColor: "#34495E",
          border: "14px solid #1C2833",
          borderRadius: 16,
          boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
        }}
      >
        {/* Safe Interior with Currency Bundles */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            width: 372,
            height: 532,
            backgroundColor: "#1C2833",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Stacks of 500 Rupee Cash Bundles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 90,
                  height: 48,
                  backgroundColor: "#2E7D32",
                  border: "3px solid #1B5E20",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF",
                  fontWeight: 900,
                  fontSize: 14,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                }}
              >
                ₹500
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              fontWeight: 900,
              color: "#F1C40F",
              letterSpacing: 2,
              textAlign: "center",
            }}
          >
            {depositAmount}
            <div style={{ fontSize: 13, color: "#BDC3C7", marginTop: 4 }}>FROZEN IN DEPOSIT</div>
          </div>
        </div>

        {/* Heavy Iron Door Swinging / Sliding Closed */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: doorWidth,
            height: 572,
            backgroundColor: "#2C3E50",
            borderLeft: "10px solid #1B2631",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Combination Wheel Handle */}
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              backgroundColor: "#BDC3C7",
              border: "8px solid #7F8C8D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${dialRotation}deg)`,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#2C3E50" }} />
            <div style={{ position: "absolute", width: 90, height: 10, backgroundColor: "#7F8C8D" }} />
            <div style={{ position: "absolute", width: 10, height: 90, backgroundColor: "#7F8C8D" }} />
          </div>
        </div>
      </div>

      {/* 4. HEAVY MAHOGANY DESK (Z: 2) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 320,
          backgroundColor: "#2E1D13", // Deep dark mahogany
          borderTop: "16px solid #C86236",
          boxShadow: "0 -20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* 100-Rupee Stamp Paper Legal Lease Document on Desk */}
        <div
          style={{
            position: "absolute",
            top: -50,
            left: 560,
            width: 220,
            height: 290,
            backgroundColor: "#FFFDF7",
            border: "4px solid #2B2B2B",
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            padding: 16,
            transform: "rotate(-3deg)",
          }}
        >
          {/* Government of Karnataka Stamp Banner */}
          <div
            style={{
              width: "100%",
              height: 48,
              backgroundColor: "#8E44AD",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: 1.5,
              borderRadius: 2,
            }}
          >
            INDIA NON JUDICIAL ₹100
          </div>
          {/* Fake legal text lines */}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ width: "90%", height: 5, backgroundColor: "#BDC3C7" }} />
            <div style={{ width: "100%", height: 5, backgroundColor: "#BDC3C7" }} />
            <div style={{ width: "85%", height: 5, backgroundColor: "#BDC3C7" }} />
            <div style={{ width: "95%", height: 5, backgroundColor: "#E74C3C" }} />
          </div>
          {/* Signature Line */}
          <div style={{ position: "absolute", bottom: 20, right: 20, borderTop: "2px solid #2B2B2B", width: 80, fontSize: 10, textAlign: "center", fontWeight: 700 }}>
            LESSOR SIGN
          </div>
        </div>

        {/* Bank Cheque being passed */}
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 380,
            width: 170,
            height: 80,
            backgroundColor: "#E8F8F5",
            border: "3px solid #16A085",
            borderRadius: 4,
            padding: 8,
            transform: "rotate(6deg)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 900, color: "#16A085" }}>HDFC BANK LTD</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#2B2B2B", marginTop: 8 }}>
            PAY: LANDLORD
          </div>
          <div style={{ fontSize: 13, fontWeight: 900, color: "#C0392B", textAlign: "right", marginTop: 6 }}>
            {depositAmount}
          </div>
        </div>
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
