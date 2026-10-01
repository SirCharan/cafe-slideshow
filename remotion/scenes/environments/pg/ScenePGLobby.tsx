import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterPG, PGCharacterIdentity, PGCharacterPose, PGCharacterEmotion } from "../../CharacterPG";

export interface ScenePGLobbyProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: PGCharacterIdentity;
  characterPose?: PGCharacterPose;
  characterEmotion?: PGCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const ScenePGLobby: React.FC<ScenePGLobbyProps> = ({
  headline = "PG RECEPTION & LOBBY",
  subheadline = "CCTV MONITORING & BIOMETRIC LOCKS",
  characterIdentity = "pg_uncle",
  characterPose = "point_keys",
  characterEmotion = "neutral",
  characterSide = "left",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blinking LEDs
  const recBlink = frame % 30 < 15;
  const wifiBlink1 = frame % 12 < 6;
  const wifiBlink2 = frame % 18 < 9;

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#F4F6F6" }}>
      {/* 1. LOBBY INTERIOR WALLS & TILES */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 740,
          backgroundColor: "#EAEDED",
          backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 100%",
        }}
      />

      {/* 2. RECEPTION PROPS & FIXTURES */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* 4-CAM CCTV SECURITY MONITOR */}
        <g transform="translate(680, 120)">
          {/* Monitor Frame */}
          <rect x="0" y="0" width="380" height="240" rx="8" fill="#17202A" stroke="#2C3E50" strokeWidth="4" />
          <rect x="10" y="10" width="360" height="220" rx="4" fill="#0E1626" />

          {/* 4 Camera Splits */}
          <rect x="16" y="16" width="170" height="100" fill="#1A252F" stroke="#2C3E50" strokeWidth="1.5" />
          <rect x="194" y="16" width="170" height="100" fill="#1A252F" stroke="#2C3E50" strokeWidth="1.5" />
          <rect x="16" y="124" width="170" height="100" fill="#1A252F" stroke="#2C3E50" strokeWidth="1.5" />
          <rect x="194" y="124" width="170" height="100" fill="#1A252F" stroke="#2C3E50" strokeWidth="1.5" />

          {/* Camera Labels */}
          <text x="24" y="32" fill="#2ECC71" fontSize="11" fontFamily="monospace">CAM 01 · MAIN GATE</text>
          <text x="202" y="32" fill="#2ECC71" fontSize="11" fontFamily="monospace">CAM 02 · KITCHEN</text>
          <text x="24" y="140" fill="#2ECC71" fontSize="11" fontFamily="monospace">CAM 03 · 2ND FLR</text>
          <text x="202" y="140" fill="#2ECC71" fontSize="11" fontFamily="monospace">CAM 04 · TERRACE</text>

          {/* Pulsing REC Indicator */}
          <circle cx="345" cy="30" r="5" fill={recBlink ? "#E74C3C" : "#7F8C8D"} />
          <text x="315" y="34" fill="#E74C3C" fontSize="10" fontFamily="monospace" fontWeight="900">REC</text>
        </g>

        {/* BIOMETRIC FINGERPRINT SCANNER ON WALL */}
        <g transform="translate(1120, 240)">
          <rect x="0" y="0" width="110" height="170" rx="8" fill="#1C2833" stroke="#2C3E50" strokeWidth="3" />
          <rect x="15" y="15" width="80" height="50" rx="4" fill="#2C3E50" />
          <text x="55" y="44" fill="#3498DB" fontSize="12" fontFamily="monospace" textAnchor="middle">VERIFIED</text>
          {/* Glowing Optical Fingerprint Sensor */}
          <rect x="25" y="80" width="60" height="75" rx="6" fill="#117A65" stroke="#16A085" strokeWidth="2" />
          <ellipse cx="55" cy="118" rx="20" ry="26" fill="none" stroke="#2ECC71" strokeWidth="2.5" opacity={recBlink ? 0.9 : 0.6} />
          <ellipse cx="55" cy="118" rx="14" ry="18" fill="none" stroke="#2ECC71" strokeWidth="2" opacity={recBlink ? 0.9 : 0.6} />
        </g>

        {/* NOTICE BOARD (Bangalore PG Rules) */}
        <g transform="translate(420, 140)">
          <rect x="0" y="0" width="220" height="260" rx="4" fill="#D35400" stroke="#A04000" strokeWidth="6" />
          <rect x="10" y="10" width="200" height="240" fill="#FEF9E7" />
          <rect x="20" y="20" width="180" height="28" fill="#C0392B" rx="3" />
          <text x="110" y="38" fill="#FFF" fontSize="11" fontWeight="900" fontFamily="'Space Grotesk', sans-serif" textAnchor="middle">
            PG HOUSE RULES
          </text>
          <text x="25" y="70" fill="#2C3E50" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif">1. RENT DUE BY 5TH (₹500 FINE)</text>
          <text x="25" y="95" fill="#2C3E50" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif">2. STRICTLY NO OUTSIDE GUESTS</text>
          <text x="25" y="120" fill="#2C3E50" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif">3. SWITCH OFF GEYSERS AFTER USE</text>
          <text x="25" y="145" fill="#2C3E50" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif">4. MAIN GATE CLOSES AT 10:30 PM</text>
          <text x="25" y="170" fill="#2C3E50" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif">5. 1-MONTH NOTICE BEFORE LEAVING</text>
          {/* UPI QR Code Standee printed on rules */}
          <rect x="75" y="195" width="70" height="45" fill="#FFF" stroke="#2C3E50" strokeWidth="1" />
          <rect x="85" y="202" width="14" height="14" fill="#2C3E50" />
          <rect x="121" y="202" width="14" height="14" fill="#2C3E50" />
          <rect x="103" y="220" width="14" height="14" fill="#2C3E50" />
        </g>

        {/* KEY BOARD WITH BRASS KEYS */}
        <g transform="translate(1280, 160)">
          <rect x="0" y="0" width="180" height="190" rx="4" fill="#5D6D7E" stroke="#34495E" strokeWidth="3" />
          <text x="90" y="28" fill="#FFF" fontSize="11" fontWeight="900" fontFamily="'Space Grotesk', sans-serif" textAnchor="middle">
            ROOM KEYS
          </text>
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <g key={`${row}-${col}`} transform={`translate(${20 + col * 38}, ${45 + row * 45})`}>
                <circle cx="10" cy="5" r="4" fill="#F1C40F" />
                <rect x="8" y="9" width="4" height="18" fill="#D4AC0D" />
                <text x="10" y="34" fill="#EAEDED" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  {101 + row * 10 + col}
                </text>
              </g>
            ))
          )}
        </g>

        {/* HIGH-SPEED WI-FI ROUTER WITH ANTENNAS */}
        <g transform="translate(560, 480)">
          <line x1="20" y1="20" x2="5" y2="-25" stroke="#1C2833" strokeWidth="3" />
          <line x1="50" y1="20" x2="50" y2="-30" stroke="#1C2833" strokeWidth="3" />
          <line x1="80" y1="20" x2="95" y2="-25" stroke="#1C2833" strokeWidth="3" />
          <rect x="0" y="20" width="100" height="35" rx="6" fill="#1C2833" stroke="#2C3E50" strokeWidth="2" />
          {/* LED lights */}
          <circle cx="20" cy="37" r="3" fill="#2ECC71" />
          <circle cx="35" cy="37" r="3" fill={wifiBlink1 ? "#2ECC71" : "#117A65"} />
          <circle cx="50" cy="37" r="3" fill={wifiBlink2 ? "#2ECC71" : "#117A65"} />
          <circle cx="65" cy="37" r="3" fill="#2ECC71" />
        </g>
      </svg>

      {/* 3. RECEPTION COUNTER (Foreground) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 340,
          backgroundColor: "#5D4037",
          borderTop: "16px solid #8D6E63",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Reception Counter Top Edge & Ledger */}
        <div style={{ width: "100%", height: 35, backgroundColor: "#4E342E" }} />
      </div>

      {/* 4. TOP HEADLINE BANNER */}
      <div
        style={{
          position: "absolute",
          top: 36,
          right: 48,
          backgroundColor: "rgba(28, 30, 33, 0.88)",
          backdropFilter: "blur(8px)",
          padding: "12px 28px",
          borderRadius: 6,
          border: "2px solid #E67E22",
          textAlign: "right",
          zIndex: 40,
        }}
      >
        <div
          style={{
            color: "#F39C12",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            color: "#ECF0F1",
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.2,
            marginTop: 4,
          }}
        >
          {subheadline}
        </div>
      </div>

      {/* 5. CHARACTER ANCHOR (Strictly Left or Right, zero center collision) */}
      <CharacterPG
        identity={characterIdentity}
        pose={characterPose}
        emotion={characterEmotion}
        isTalking={isTalking}
        scale={0.92}
        left={characterSide === "left" ? 140 : undefined}
        right={characterSide === "right" ? 140 : undefined}
        bottom={140}
      />
    </div>
  );
};
