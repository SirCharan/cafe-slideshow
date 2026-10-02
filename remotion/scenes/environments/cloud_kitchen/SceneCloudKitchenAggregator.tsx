import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterCloudKitchen, CKCharacterIdentity, CKCharacterPose, CKCharacterEmotion } from "../../CharacterCloudKitchen";

export interface SceneCloudKitchenAggregatorProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: CKCharacterIdentity;
  characterPose?: CKCharacterPose;
  characterEmotion?: CKCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneCloudKitchenAggregator: React.FC<SceneCloudKitchenAggregatorProps> = ({
  headline = "THE AGGREGATOR TOLL GATE",
  subheadline = "SWIGGY & ZOMATO MERCHANT PORTAL",
  characterIdentity = "kitchen_founder",
  characterPose = "point_tablet",
  characterEmotion = "shocked",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin((frame / fps) * 4) * 0.05 + 1.0;
  const graphDrop = spring({ frame: frame - 15, fps, config: { damping: 12, stiffness: 100 } });

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#0F141C" }}>
      {/* 1. DARK FINTECH BACKGROUND */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          background: "radial-gradient(circle at 70% 50%, #1A252F 0%, #0B0E14 80%)",
        }}
      />

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
            backgroundColor: "rgba(155, 89, 182, 0.2)",
            border: "1px solid #9B59B6",
            padding: "4px 14px",
            borderRadius: 6,
            color: "#9B59B6",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#9B59B6" }} />
          {headline}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: "-0.01em" }}>
          {subheadline}
        </div>
      </div>

      {/* 3. AGGREGATOR DASHBOARD & IN-APP PPC SCREEN (RIGHT SIDE: X=680 to 1840) */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 680,
          width: 1160,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 10,
        }}
      >
        {/* TOP ROW: DUAL AGGREGATOR STATUS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Swiggy Partner Card */}
          <div
            style={{
              backgroundColor: "#1C2430",
              border: "2px solid #FC8019",
              borderRadius: 12,
              padding: "18px 24px",
              boxShadow: "0 8px 24px rgba(252, 128, 25, 0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#FC8019", fontSize: 16, fontWeight: 900 }}>SWIGGY PARTNER</div>
              <span style={{ color: "#2ECC71", fontSize: 12, fontWeight: 700 }}>● LIVE & ORDERING</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ color: "#BDC3C7", fontSize: 13 }}>Platform Take Rate</div>
              <div style={{ color: "#E74C3C", fontSize: 28, fontWeight: 900 }}>29.5%</div>
            </div>
            <div style={{ color: "#7F8C8D", fontSize: 11, marginTop: 4 }}>
              Base Commission (25%) + 18% GST + Payment Gateway (2%)
            </div>
          </div>

          {/* Zomato For Business Card */}
          <div
            style={{
              backgroundColor: "#1C2430",
              border: "2px solid #E23744",
              borderRadius: 12,
              padding: "18px 24px",
              boxShadow: "0 8px 24px rgba(226, 55, 68, 0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#E23744", fontSize: 16, fontWeight: 900 }}>ZOMATO BUSINESS</div>
              <span style={{ color: "#2ECC71", fontSize: 12, fontWeight: 700 }}>● LIVE & ORDERING</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ color: "#BDC3C7", fontSize: 13 }}>Platform Take Rate</div>
              <div style={{ color: "#E74C3C", fontSize: 28, fontWeight: 900 }}>31.2%</div>
            </div>
            <div style={{ color: "#7F8C8D", fontSize: 11, marginTop: 4 }}>
              Includes ₹3 delivery fee split + 18% GST on merchant fees
            </div>
          </div>
        </div>

        {/* MIDDLE CARD: THE IN-APP PPC BIDDING WAR (Sponsored Carousels) */}
        <div
          style={{
            backgroundColor: "#171F2A",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 800 }}>
                SPONSORED CAROUSEL PPC CAMPAIGN
              </div>
              <div style={{ color: "#BDC3C7", fontSize: 12, marginTop: 2 }}>
                Koramangala 3km Radius · Target: Biryani & Dinner Cravings
              </div>
            </div>
            <div
              style={{
                backgroundColor: "rgba(231, 76, 60, 0.2)",
                border: "1px solid #E74C3C",
                borderRadius: 8,
                padding: "6px 14px",
                color: "#E74C3C",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              ₹1,500 / DAY BURN
            </div>
          </div>

          {/* Visibility Drop Graph */}
          <div style={{ marginTop: 16, height: 110, position: "relative", backgroundColor: "#0E1520", borderRadius: 8, padding: "12px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#7F8C8D", fontSize: 11 }}>
              <span>Day 1 - 20 (With In-App Ads)</span>
              <span>Day 21+ (Ad Budget Paused)</span>
            </div>
            {/* SVG Graph line dropping from Page 1 to Page 9 */}
            <svg viewBox="0 0 1000 60" style={{ width: "100%", height: 60, marginTop: 6 }}>
              {/* Healthy ad zone */}
              <line x1="0" y1="15" x2="600" y2="15" stroke="#2ECC71" strokeWidth="4" />
              {/* Steep cliff drop */}
              <path
                d={`M 600 15 C 650 15, 680 ${15 + graphDrop * 35}, 1000 ${15 + graphDrop * 35}`}
                fill="none"
                stroke="#E74C3C"
                strokeWidth="4"
              />
              <circle cx="600" cy="15" r="5" fill="#2ECC71" />
              <circle cx="980" cy={15 + graphDrop * 35} r="6" fill="#E74C3C" />
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, marginTop: -2 }}>
              <span style={{ color: "#2ECC71" }}>PAGE 1 · TOP 3 RECOMMENDATIONS</span>
              <span style={{ color: "#E74C3C" }}>PAGE 9 · 0 ORGANIC ORDERS</span>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: THE MANDATORY 50% DISCOUNT MECHANISM */}
        <div
          style={{
            backgroundColor: "#20171B",
            border: "2px solid #E74C3C",
            borderRadius: 12,
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ color: "#E74C3C", fontSize: 15, fontWeight: 900, textTransform: "uppercase" }}>
              CONSUMER DISCOUNT SUBSIDY TRAP
            </div>
            <div style={{ color: "#BDC3C7", fontSize: 12, marginTop: 2 }}>
              "FLAT 50% OFF UP TO ₹100" PROMOTIONAL CAMPAIGN
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, textAlign: "right" }}>
            <div>
              <div style={{ color: "#7F8C8D", fontSize: 11, fontWeight: 700 }}>AGGREGATOR SHARE</div>
              <div style={{ color: "#BDC3C7", fontSize: 18, fontWeight: 900 }}>₹0.00 (0%)</div>
            </div>
            <div>
              <div style={{ color: "#E74C3C", fontSize: 11, fontWeight: 700 }}>KITCHEN SHARE</div>
              <div style={{ color: "#E74C3C", fontSize: 18, fontWeight: 900 }}>₹100 (100%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHARACTER (Strict Left Side Anchor - X=140px, never overlaps dashboard on right) */}
      <CharacterCloudKitchen
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={1.25}
        left={140}
        bottom={110}
      />
    </div>
  );
};
