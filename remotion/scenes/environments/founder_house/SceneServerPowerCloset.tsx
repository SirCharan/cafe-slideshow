import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterFounderHouse, FHCharacterIdentity, FHCharacterPose, FHCharacterEmotion } from "../../CharacterFounderHouse";

export interface SceneServerPowerClosetProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: FHCharacterIdentity;
  characterPose?: FHCharacterPose;
  characterEmotion?: FHCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneServerPowerCloset: React.FC<SceneServerPowerClosetProps> = ({
  headline = "THE INFRASTRUCTURE TAX",
  subheadline = "DUAL LEASED LINES · BESCOM COMMERCIAL POWER",
  characterIdentity = "hvac_technician",
  characterPose = "holding_wrench",
  characterEmotion = "anxious",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spinning disc inside electric meter
  const meterSpin = (frame * 12) % 360;
  // Blinking router packet LEDs
  const ledGreen = frame % 8 < 5;
  const ledCyan = frame % 12 < 7;
  const ledAmber = frame % 15 < 8;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#0A0F1D" }}>
      {/* 1. UTILITY CLOSET WALL & METAL FLOOR */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 740,
          background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 740,
          left: 0,
          width: 1920,
          height: 340,
          background: "linear-gradient(180deg, #334155 0%, #1E293B 100%)",
        }}
      />

      {/* 2. VECTOR ENVIRONMENT (SVG) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Metal Conduit Pipes Running Up Wall */}
        {[220, 245, 270, 720, 745].map((px, i) => (
          <rect key={i} x={px} y="0" width="14" height="740" fill="#64748B" stroke="#475569" strokeWidth="2" />
        ))}

        {/* 19-INCH SERVER RACK (Center-Right: X: 880 to 1420) */}
        <g transform="translate(860, 160)">
          {/* Main Server Cabinet Shell */}
          <rect x="0" y="0" width="460" height="660" rx="10" fill="#0B0F19" stroke="#38BDF8" strokeWidth="4" />
          <rect x="20" y="20" width="420" height="620" fill="#030712" />

          {/* Unit 1: ACT ENTERPRISE LEASED LINE ROUTER */}
          <g transform="translate(30, 40)">
            <rect x="0" y="0" width="400" height="85" rx="6" fill="#111827" stroke="#1E293B" strokeWidth="2" />
            <text x="20" y="32" fill="#E2E8F0" fontSize="13" fontWeight="bold">
              ACT FIBER ENTERPRISE (1 Gbps DEDICATED)
            </text>
            <text x="20" y="52" fill="#38BDF8" fontSize="11">
              STATIC IP · 99.9% SLA · ₹15,000 / MO
            </text>
            {/* Blinking Port LEDs */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
              <circle
                key={p}
                cx={260 + p * 15}
                cy="62"
                r="4"
                fill={ledGreen ? "#10B981" : "#064E3B"}
              />
            ))}
          </g>

          {/* Unit 2: AIRTEL BACKUP LEASED LINE */}
          <g transform="translate(30, 145)">
            <rect x="0" y="0" width="400" height="85" rx="6" fill="#111827" stroke="#1E293B" strokeWidth="2" />
            <text x="20" y="32" fill="#E2E8F0" fontSize="13" fontWeight="bold">
              AIRTEL COMMERCIAL FIBER (BACKUP FAILOVER)
            </text>
            <text x="20" y="52" fill="#F43F5E" fontSize="11">
              AUTO-FAILOVER · ₹10,000 / MO
            </text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
              <circle
                key={p}
                cx={260 + p * 15}
                cy="62"
                r="4"
                fill={ledCyan ? "#06B6D4" : "#164E63"}
              />
            ))}
          </g>

          {/* Unit 3: HIGH-CAPACITY COMMERCIAL UPS & INVERTER */}
          <g transform="translate(30, 250)">
            <rect x="0" y="0" width="400" height="150" rx="6" fill="#1F2937" stroke="#374151" strokeWidth="2" />
            <text x="20" y="35" fill="#F59E0B" fontSize="14" fontWeight="bold">
              5KVA HEAVY INVERTER + 4X TUBULAR BATTERIES
            </text>
            <text x="20" y="60" fill="#9CA3AF" fontSize="12">
              POWER CUT RUNTIME: 4 HOURS FOR 14 MACBOOKS
            </text>
            <rect x="20" y="80" width="360" height="24" rx="4" fill="#111827" />
            <rect x="20" y="80" width="280" height="24" rx="4" fill="#10B981" />
            <text x="180" y="97" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
              BATTERY HEALTH: 84%
            </text>
          </g>

          {/* Unit 4: HEAVY CABLE HARNESS */}
          {[0, 1, 2, 3, 4].map((c) => (
            <path
              key={c}
              d={`M ${80 + c * 40} 420 Q ${160 + c * 20} 560 ${220 + c * 30} 600`}
              fill="none"
              stroke={["#38BDF8", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"][c]}
              strokeWidth="5"
            />
          ))}
        </g>

        {/* BESCOM THREE-PHASE COMMERCIAL ELECTRIC METER (Right Side) */}
        <g transform="translate(1440, 240)">
          <rect x="0" y="0" width="320" height="420" rx="12" fill="#E2E8F0" stroke="#64748B" strokeWidth="8" />
          <rect x="20" y="20" width="280" height="380" fill="#F8FAFC" />

          <text x="160" y="60" textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="900">
            BESCOM COMMERCIAL
          </text>
          <text x="160" y="85" textAnchor="middle" fill="#DC2626" fontSize="12" fontWeight="bold">
            LT-3 INDUSTRIAL TARIFF
          </text>

          {/* Digital Counter Display */}
          <rect x="40" y="110" width="240" height="70" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          <text x="160" y="155" textAnchor="middle" fill="#22C55E" fontSize="32" fontWeight="bold" fontFamily="monospace">
            08472.6
          </text>
          <text x="250" y="155" fill="#22C55E" fontSize="14">kWh</text>

          {/* Spinning aluminum disc */}
          <circle cx="160" cy="240" r="45" fill="#CBD5E1" stroke="#475569" strokeWidth="4" />
          <g transform={`rotate(${meterSpin}, 160, 240)`}>
            <line x1="120" y1="240" x2="200" y2="240" stroke="#DC2626" strokeWidth="5" />
          </g>

          <text x="160" y="325" textAnchor="middle" fill="#EF4444" fontSize="15" fontWeight="bold">
            14 AIR CONDITIONERS ACTIVE
          </text>
          <text x="160" y="355" textAnchor="middle" fill="#B91C1C" fontSize="18" fontWeight="900">
            BILL: ₹35,000 / MO
          </text>
        </g>
      </svg>

      {/* 3. SCENE METRIC BADGE (Top Center) */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(15, 23, 42, 0.94)",
          padding: "12px 36px",
          borderRadius: 16,
          border: "2px solid #EF4444",
          boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
          zIndex: 20,
        }}
      >
        <span style={{ color: "#F87171", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>{headline}</span>
        <span style={{ color: "#FFFFFF", fontSize: 24, fontWeight: 900, marginTop: 4 }}>{subheadline}</span>
      </div>

      {/* 4. CHARACTER RIG */}
      <CharacterFounderHouse
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={1.05}
        left={characterSide === "left" ? 180 : undefined}
        right={characterSide === "right" ? 180 : undefined}
        bottom={100}
      />
    </div>
  );
};
