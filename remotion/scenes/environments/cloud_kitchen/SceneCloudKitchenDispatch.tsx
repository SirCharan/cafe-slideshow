import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterCloudKitchen, CKCharacterIdentity, CKCharacterPose, CKCharacterEmotion } from "../../CharacterCloudKitchen";

export interface SceneCloudKitchenDispatchProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: CKCharacterIdentity;
  characterPose?: CKCharacterPose;
  characterEmotion?: CKCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneCloudKitchenDispatch: React.FC<SceneCloudKitchenDispatchProps> = ({
  headline = "THE DISPATCH BOTTLENECK",
  subheadline = "8:30 PM WEEKEND RUSH & PACKAGING DRAIN",
  characterIdentity = "delivery_rider",
  characterPose = "holding_order",
  characterEmotion = "impatient",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Thermal ticket printer spitting paper
  const ticketOffset = (frame * 3) % 180;
  const redBlink = Math.sin((frame / fps) * 8) > 0 ? "#E74C3C" : "#922B21";

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#171F2A" }}>
      {/* 1. DISPATCH WINDOW ENVIRONMENT (SVG) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Grimy Alley Concrete & Rain Streaks */}
        <rect x="0" y="0" width="1920" height="880" fill="#202A36" />
        {/* Rainy Saturday Night Window Grill */}
        <rect x="180" y="160" width="520" height="660" fill="#151C24" stroke="#34495E" strokeWidth="6" rx="8" />
        {/* Metal Grill Slats */}
        {[240, 320, 400, 480, 560, 640].map((gx) => (
          <line key={gx} x1={gx} y1="160" x2={gx} y2="820" stroke="#2C3E50" strokeWidth="6" />
        ))}
        {/* Small Dispatch Sliding Window (Order Pickup Hatch) */}
        <rect x="260" y="440" width="360" height="280" fill="#2C3E50" stroke="#F39C12" strokeWidth="4" rx="4" />
        {/* Counter Stainless Steel Shelf */}
        <rect x="220" y="700" width="440" height="30" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="3" rx="4" />

        {/* THERMAL TICKET PRINTER SPITTING ORDERS CONSTANTLY */}
        <rect x="280" y="560" width="100" height="75" rx="6" fill="#1C2833" stroke="#5D6D7E" strokeWidth="3" />
        <line x1="295" y1="575" x2="365" y2="575" stroke="#2ECC71" strokeWidth="4" />
        {/* Spitting Paper Ticket stream */}
        <path
          d={`M 310 575 L 310 ${640 + ticketOffset} L 350 ${640 + ticketOffset} L 350 575 Z`}
          fill="#FFFDE7"
          stroke="#BDC3C7"
          strokeWidth="1.5"
        />
        <text x="315" y="605" fontSize="9" fill="#1C2833" fontWeight="bold">#4891</text>
        <text x="315" y="620" fontSize="8" fill="#5D4037">2x Biryani</text>

        {/* ALGORITHMIC DELAY TIMER DISPLAY (Flashing Red over 7 mins) */}
        <rect x="420" y="470" width="160" height="60" rx="8" fill="#0B0E14" stroke={redBlink} strokeWidth="3" />
        <text x="440" y="500" fontSize="11" fill="#E74C3C" fontWeight="bold">PREP DELAY</text>
        <text x="440" y="522" fontSize="18" fill="#FFFFFF" fontWeight="900">08:42 MIN</text>
        <circle cx="560" cy="500" r="6" fill={redBlink} />

        {/* PACKING STATION COUNTER (RIGHT SIDE: X=740 to 1840) */}
        <rect x="740" y="160" width="1120" height="720" fill="#1C2430" rx="12" stroke="#2C3E50" strokeWidth="2" />

        {/* PACKAGING TEARDOWN SHELF */}
        <rect x="770" y="240" width="1060" height="24" fill="#34495E" rx="4" />

        {/* WET RAIN ASPHALT GROUND */}
        <rect x="0" y="880" width="1920" height="200" fill="#11161F" />
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
            backgroundColor: "rgba(230, 126, 34, 0.2)",
            border: "1px solid #E67E22",
            padding: "4px 14px",
            borderRadius: 6,
            color: "#E67E22",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#E67E22" }} />
          {headline}
        </div>
        <div style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, letterSpacing: "-0.01em" }}>
          {subheadline}
        </div>
      </div>

      {/* 3. PACKAGING TEARDOWN METRICS (RIGHT SIDE: X=780 to 1820) */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 780,
          width: 1040,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          zIndex: 10,
        }}
      >
        <div style={{ color: "#F39C12", fontSize: 18, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          THE ₹22 PACKAGING BREAKDOWN (PER DELIVERY)
        </div>

        {/* 5 PACKAGING COMPONENT CARDS */}
        {[
          { name: "Microwaveable Virgin PP Round Tub (750ml)", cost: "₹9.50", desc: "Prevents oil leak onto scooter floorboard", icon: "🥣" },
          { name: "Heat-Seal Aluminum Foil & Printed Lid", cost: "₹3.00", desc: "Retains steam and temperature during 35-min trip", icon: "🛡️" },
          { name: "Tamper-Proof Holographic Security Tape", cost: "₹1.50", desc: "Mandatory to prevent rider food-theft complaints", icon: "🔒" },
          { name: "Heavy-Duty Branded Kraft Carry Bag", cost: "₹6.00", desc: "Reinforced handle for 3 heavy meal tubs", icon: "🛍️" },
          { name: "Cutlery Set, Wet Napkin & Mint Sachet", cost: "₹2.00", desc: "Consumer expectation for corporate desk deliveries", icon: "🍴" },
        ].map((pkg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#161E29",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "10px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{pkg.icon}</span>
              <div>
                <div style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 800 }}>{pkg.name}</div>
                <div style={{ color: "#7F8C8D", fontSize: 11, marginTop: 2 }}>{pkg.desc}</div>
              </div>
            </div>
            <div style={{ color: "#F1C40F", fontSize: 18, fontWeight: 900 }}>{pkg.cost}</div>
          </div>
        ))}

        {/* MONTHLY SUMMARY BURN */}
        <div
          style={{
            backgroundColor: "#271C1E",
            border: "2px solid #E74C3C",
            borderRadius: 10,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <div>
            <div style={{ color: "#E74C3C", fontSize: 14, fontWeight: 900 }}>
              TOTAL MONTHLY PACKAGING BURN (120 ORDERS/DAY)
            </div>
            <div style={{ color: "#BDC3C7", fontSize: 12, marginTop: 2 }}>
              120 orders × ₹22 packaging × 30 operating days
            </div>
          </div>
          <div style={{ color: "#E74C3C", fontSize: 26, fontWeight: 900 }}>
            ₹79,200 / MONTH
          </div>
        </div>
      </div>

      {/* 4. CHARACTER (Strict Left Side Anchor - X=140px) */}
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
