import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterCloudKitchen, CKCharacterIdentity, CKCharacterPose, CKCharacterEmotion } from "../../CharacterCloudKitchen";

export interface SceneCloudKitchenBreakdownProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: CKCharacterIdentity;
  characterPose?: CKCharacterPose;
  characterEmotion?: CKCharacterEmotion;
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
    label: "AGGREGATOR COMMISSIONS",
    amount: 105,
    pct: "30.0%",
    description: "Swiggy & Zomato base commission (25%) + 18% GST + payment gateway (2%)",
    color: "#271C2E",
    accent: "#9B59B6",
    icon: "🛵",
  },
  {
    label: "RAW INGREDIENTS & MEAT",
    amount: 98,
    pct: "28.0%",
    description: "Fresh chicken leg, aged Daawat basmati rice, pure ghee & saffron spices",
    color: "#2C2314",
    accent: "#F39C12",
    icon: "🍗",
  },
  {
    label: "KITCHEN STAFF & CHEF SALARIES",
    amount: 45,
    pct: "12.9%",
    description: "Head chef Murugan, line cooks & dishwashers (₹65,000/mo total wages)",
    color: "#162838",
    accent: "#3498DB",
    icon: "👨‍🍳",
  },
  {
    label: "SHUTTER RENT, BESCOM & GAS",
    amount: 28,
    pct: "8.0%",
    description: "250 sqft Koramangala lease, commercial exhaust power & commercial LPG",
    color: "#232B2B",
    accent: "#7F8C8D",
    icon: "🏢",
  },
  {
    label: "PREMIUM DELIVERY PACKAGING",
    amount: 22,
    pct: "6.3%",
    description: "Virgin PP tub, heat-seal foil, tamper-proof security tape & kraft bag",
    color: "#163336",
    accent: "#1ABC9C",
    icon: "📦",
  },
  {
    label: "IN-APP PPC ADS & PROMOS",
    amount: 20,
    pct: "5.7%",
    description: "Sponsored carousel ad bids (₹45K/mo) + 50% discount customer subsidy",
    color: "#301B1C",
    accent: "#E74C3C",
    icon: "🎯",
  },
  {
    label: "OPERATOR TRUE NET PROFIT",
    amount: 32,
    pct: "9.1%",
    description: "True take-home profit left in your bank account per ₹350 biryani",
    color: "#132D20",
    accent: "#2ECC71",
    icon: "💰",
  },
];

export const SceneCloudKitchenBreakdown: React.FC<SceneCloudKitchenBreakdownProps> = ({
  headline = "THE ₹350 BIRYANI TEARDOWN",
  subheadline = "WHERE EVERY SINGLE RUPEE ACTUALLY GOES",
  characterIdentity = "kitchen_founder",
  characterPose = "point_tablet",
  characterEmotion = "thinking",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring animation
  const introSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });

  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        backgroundColor: "#0B0E14",
      }}
    >
      {/* 1. DARK FINTECH BACKGROUND */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          background: "radial-gradient(circle at 65% 50%, #17202A 0%, #0B0E14 75%)",
        }}
      />

      {/* Subtle Grid Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.6,
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

      {/* 3. 2.5D EXPLODED 7-TIER COST LEDGER STACK (RIGHT-SIDE: X=700 to 1840) */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 700,
          width: 1140,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 10,
        }}
      >
        {BREAKDOWN_DATA.map((item, idx) => {
          // Staggered spring slide-in per row
          const rowSpring = spring({
            frame: frame - idx * 5,
            fps,
            config: { damping: 14, stiffness: 130 },
          });
          const rowX = interpolate(rowSpring, [0, 1], [180, 0]);
          const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);

          const isProfit = idx === BREAKDOWN_DATA.length - 1;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: item.color,
                border: `2px solid ${isProfit ? "#2ECC71" : item.accent}`,
                borderRadius: 10,
                padding: "11px 22px",
                transform: `translateX(${rowX}px)`,
                opacity: rowOpacity,
                boxShadow: isProfit
                  ? "0 0 25px rgba(46, 204, 113, 0.35)"
                  : "0 6px 18px rgba(0,0,0,0.4)",
              }}
            >
              {/* Left: Icon & Label & Description */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div>
                  <div
                    style={{
                      color: isProfit ? "#2ECC71" : "#FFFFFF",
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      color: "#BDC3C7",
                      fontSize: 12,
                      fontWeight: 500,
                      marginTop: 2,
                    }}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Right: Percentage & Rupee Amount */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: `1px solid ${item.accent}`,
                    borderRadius: 6,
                    padding: "3px 10px",
                    color: item.accent,
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {item.pct}
                </div>
                <div
                  style={{
                    color: isProfit ? "#2ECC71" : "#FFFFFF",
                    fontSize: 22,
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    minWidth: 90,
                    textAlign: "right",
                  }}
                >
                  ₹{item.amount}
                </div>
              </div>
            </div>
          );
        })}

        {/* SUMMARY COMPARISON SUMMARY FOOTER CARD */}
        <div
          style={{
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#1C2833",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "10px 22px",
            opacity: introSpring,
          }}
        >
          <div style={{ color: "#BDC3C7", fontSize: 13, fontWeight: 700 }}>
            GROSS CUSTOMER BILL: <span style={{ color: "#FFFFFF", fontWeight: 900 }}>₹350</span>
          </div>
          <div style={{ color: "#BDC3C7", fontSize: 13, fontWeight: 700 }}>
            TOTAL COSTS & TOLLS: <span style={{ color: "#E74C3C", fontWeight: 900 }}>₹318 (90.9%)</span>
          </div>
          <div style={{ color: "#2ECC71", fontSize: 14, fontWeight: 900 }}>
            NET PROFIT: ₹32 / ORDER (9.1%)
          </div>
        </div>
      </div>

      {/* 4. CHARACTER (Strict Left side anchor - X=140px, never overlaps the 2.5D stack on right) */}
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
