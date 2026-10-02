import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type FHCharacterIdentity =
  | "founder_hoodie"
  | "operator_vest"
  | "landlord_uncle"
  | "chef_cook"
  | "hvac_technician"
  | "defeated_founder"
  | "rwa_president"
  | "forensic_accountant";

export type FHCharacterPose =
  | "idle"
  | "holding_latte"
  | "holding_cables"
  | "holding_phone_sms"
  | "pointing_finger"
  | "holding_davara"
  | "showing_ipad"
  | "flipping_dosa"
  | "pulling_suitcase"
  | "point_chart"
  | "pointing_ledger"
  | "head_in_hands"
  | "holding_wrench";

export type FHCharacterEmotion =
  | "neutral"
  | "dreamy"
  | "anxious"
  | "exhausted"
  | "shattered"
  | "confident"
  | "stern"
  | "smug"
  | "depressed"
  | "furious"
  | "serious"
  | "triumphant"
  | "talking";

export interface CharacterFounderHouseProps {
  identity: FHCharacterIdentity;
  pose?: FHCharacterPose;
  emotion?: FHCharacterEmotion;
  isTalking?: boolean;
  scale?: number;
  flipX?: boolean;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  top?: number | string;
  style?: React.CSSProperties;
}

export const CharacterFounderHouse: React.FC<CharacterFounderHouseProps> = ({
  identity,
  pose = "idle",
  emotion = "neutral",
  isTalking = false,
  scale = 1.0,
  flipX = false,
  left,
  right,
  bottom = 80,
  top,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural breathing & micro-sway
  const breath = Math.sin((frame / fps) * 2.5) * 2;
  const headBob = Math.sin((frame / fps) * 3) * 1.5;

  // Blinking loop (every 75 frames for 4 frames)
  const blink = frame % 75 < 4;

  // Mouth flap when talking
  const mouthOpen = isTalking || emotion === "talking" ? (Math.sin(frame * 0.8) + 1) * 3.5 : 0;

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: 320,
    height: 640,
    transform: `scale(${scale}) scaleX(${flipX ? -1 : 1})`,
    transformOrigin: "bottom center",
    left,
    right,
    bottom,
    top,
    zIndex: 10,
    pointerEvents: "none",
    ...style,
  };

  // Color & accessory themes by identity
  const config = {
    founder_hoodie: {
      shirt: "#2C3E50",
      accent: "#3498DB",
      skin: "#E0AC69",
      hair: "#1A1A1A",
      tag: "AI FOUNDER (HSR)",
    },
    operator_vest: {
      shirt: "#16A085",
      accent: "#1ABC9C",
      skin: "#D2996E",
      hair: "#2C3E50",
      tag: "FOUNDER HOUSE OPERATOR",
    },
    landlord_uncle: {
      shirt: "#C0392B",
      accent: "#F39C12",
      skin: "#C68642",
      hair: "#7F8C8D",
      tag: "HSR VILLA OWNER",
    },
    chef_cook: {
      shirt: "#BDC3C7",
      accent: "#E67E22",
      skin: "#B87333",
      hair: "#2C3E50",
      tag: "HOUSE COOK (3 MEALS)",
    },
    hvac_technician: {
      shirt: "#2980B9",
      accent: "#F1C40F",
      skin: "#D2996E",
      hair: "#1A1A1A",
      tag: "BESCOM / HVAC TECH",
    },
    defeated_founder: {
      shirt: "#34495E",
      accent: "#7F8C8D",
      skin: "#D2996E",
      hair: "#1A1A1A",
      tag: "UNFUNDED TENANT",
    },
    rwa_president: {
      shirt: "#7F8C8D",
      accent: "#E74C3C",
      skin: "#C68642",
      hair: "#BDC3C7",
      tag: "SECTOR 4 RWA PRESIDENT",
    },
    forensic_accountant: {
      shirt: "#1F2937",
      accent: "#10B981",
      skin: "#E0AC69",
      hair: "#111827",
      tag: "FINANCIAL ANALYST",
    },
  }[identity] || {
    shirt: "#2C3E50",
    accent: "#3498DB",
    skin: "#E0AC69",
    hair: "#1A1A1A",
    tag: "RESIDENT",
  };

  return (
    <div style={posStyle}>
      <svg viewBox="0 0 320 640" width="100%" height="100%">
        {/* Soft ground drop shadow */}
        <ellipse cx="160" cy="625" rx="90" ry="16" fill="rgba(0,0,0,0.35)" />

        {/* Character Base Torso & Shoulders */}
        <g transform={`translate(0, ${breath})`}>
          {/* Legs / Jeans */}
          <path d="M 125 430 L 125 615 L 148 615 L 152 460 L 168 460 L 172 615 L 195 615 L 195 430 Z" fill="#1C2833" />
          {/* Shoes */}
          <rect x="118" y="610" width="34" height="15" rx="7" fill="#111" />
          <rect x="168" y="610" width="34" height="15" rx="7" fill="#111" />

          {/* Torso / Hoodie / Kurta / Shirt */}
          <path
            d="M 105 270 C 105 240, 215 240, 215 270 L 222 435 C 222 445, 98 445, 98 435 Z"
            fill={config.shirt}
          />
          {/* Collar / Hoodie pocket / Accent line */}
          <path d="M 130 250 L 160 290 L 190 250" stroke={config.accent} strokeWidth="6" fill="none" />
          <rect x="125" y="360" width="70" height="45" rx="8" fill="rgba(0,0,0,0.15)" />

          {/* Arms & Hands based on pose */}
          {pose === "holding_latte" && (
            <g>
              <path d="M 105 275 L 80 340 L 130 365" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              {/* Ceramic Coffee Cup */}
              <rect x="126" y="345" width="26" height="32" rx="4" fill="#F8F9FA" />
              <path d="M 152 352 Q 162 361 152 370" stroke="#F8F9FA" strokeWidth="4" fill="none" />
              <ellipse cx="139" cy="347" rx="11" ry="4" fill="#6F4E37" />
            </g>
          )}

          {pose === "pulling_suitcase" && (
            <g>
              {/* Arm reaching down to trolley */}
              <path d="M 215 275 L 245 350 L 260 420" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              {/* Trolley Suitcase */}
              <rect x="250" y="440" width="60" height="110" rx="8" fill="#2C3E50" stroke="#BDC3C7" strokeWidth="3" />
              <path d="M 270 440 L 270 410 L 290 410 L 290 440" stroke="#BDC3C7" strokeWidth="5" fill="none" />
              <circle cx="260" cy="555" r="8" fill="#E74C3C" />
              <circle cx="300" cy="555" r="8" fill="#E74C3C" />
            </g>
          )}

          {pose === "showing_ipad" && (
            <g>
              <path d="M 105 275 L 85 340 L 140 345" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              <path d="M 215 275 L 235 340 L 180 345" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              {/* Glowing iPad / Tablet */}
              <rect x="120" y="320" width="80" height="55" rx="6" fill="#111827" stroke="#374151" strokeWidth="3" />
              <rect x="126" y="326" width="68" height="43" fill="#1E293B" />
              <rect x="132" y="335" width="56" height="8" rx="2" fill="#10B981" />
              <rect x="132" y="348" width="38" height="6" rx="2" fill="#3B82F6" />
            </g>
          )}

          {pose === "pointing_ledger" && (
            <g>
              <path d="M 105 275 L 80 330 L 70 390" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              <path d="M 215 275 L 245 320 L 290 300" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              {/* Index finger pointing right */}
              <circle cx="295" cy="298" r="8" fill={config.skin} />
              <path d="M 295 298 L 315 290" stroke={config.skin} strokeWidth="7" strokeLinecap="round" />
            </g>
          )}

          {pose !== "holding_latte" && pose !== "pulling_suitcase" && pose !== "showing_ipad" && pose !== "pointing_ledger" && (
            <g>
              <path d="M 105 275 L 85 350 L 95 410" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              <path d="M 215 275 L 235 350 L 225 410" stroke={config.shirt} strokeWidth="22" strokeLinecap="round" fill="none" />
              <circle cx="95" cy="415" r="11" fill={config.skin} />
              <circle cx="225" cy="415" r="11" fill={config.skin} />
            </g>
          )}
        </g>

        {/* Head and Face */}
        <g transform={`translate(0, ${headBob})`}>
          {/* Neck */}
          <rect x="146" y="215" width="28" height="35" rx="5" fill={config.skin} />

          {/* Head Shape */}
          <ellipse cx="160" cy="180" rx="42" ry="50" fill={config.skin} />

          {/* Hair */}
          <path
            d="M 118 175 C 115 125, 205 125, 202 175 C 190 150, 130 150, 118 175 Z"
            fill={config.hair}
          />
          {identity === "landlord_uncle" && (
            // Mustache for Bangalore landlord uncle
            <path d="M 140 195 Q 160 188 180 195 Q 160 205 140 195 Z" fill="#333333" />
          )}

          {/* Eyes (Blinking animation) */}
          {blink ? (
            <g stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round">
              <line x1="140" y1="175" x2="152" y2="175" />
              <line x1="168" y1="175" x2="180" y2="175" />
            </g>
          ) : (
            <g fill="#1A1A1A">
              <ellipse cx="146" cy="175" rx="5" ry="6" />
              <ellipse cx="174" cy="175" rx="5" ry="6" />
              <circle cx="148" cy="173" r="2" fill="#FFFFFF" />
              <circle cx="176" cy="173" r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* Eyebrows based on emotion */}
          {emotion === "stressed" || emotion === "anxious" || emotion === "shattered" ? (
            <g stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round">
              <line x1="138" y1="164" x2="152" y2="168" />
              <line x1="168" y1="168" x2="182" y2="164" />
            </g>
          ) : emotion === "furious" || emotion === "stern" ? (
            <g stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round">
              <line x1="138" y1="168" x2="152" y2="164" />
              <line x1="168" y1="164" x2="182" y2="168" />
            </g>
          ) : (
            <g stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round">
              <line x1="138" y1="164" x2="152" y2="164" />
              <line x1="168" y1="164" x2="182" y2="164" />
            </g>
          )}

          {/* Mouth with talking flap */}
          <path
            d={`M 148 202 Q 160 ${202 + mouthOpen} 172 202`}
            stroke="#1A1A1A"
            strokeWidth="3.5"
            fill={mouthOpen > 2 ? "#800000" : "none"}
            strokeLinecap="round"
          />
        </g>

        {/* Identity Badge Tag under character */}
        <g transform="translate(160, 630)">
          <rect x="-85" y="0" width="170" height="24" rx="12" fill="#0B0E14" stroke={config.accent} strokeWidth="2" />
          <text
            x="0"
            y="16"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.8"
            fontFamily="Arial, sans-serif"
          >
            {config.tag}
          </text>
        </g>
      </svg>
    </div>
  );
};
