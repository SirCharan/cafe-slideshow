import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type CharacterIdentity = "founder" | "barista" | "camper" | "landlord";
export type CharacterPose =
  | "idle"
  | "pour_espresso"
  | "type_laptop"
  | "hand_money"
  | "cross_arms"
  | "walk_cycle"
  | "shrug"
  | "point_phone"
  | "sitting";
export type CharacterEmotion = "neutral" | "smile" | "stress" | "focus" | "talking";

export interface CharacterProps {
  identity: CharacterIdentity;
  pose?: CharacterPose;
  emotion?: CharacterEmotion;
  isTalking?: boolean;
  scale?: number;
  flipX?: boolean;
  x?: number;
  y?: number;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  top?: number | string;
  style?: React.CSSProperties;
}

export const Character: React.FC<CharacterProps> = ({
  identity,
  pose = "idle",
  emotion = "neutral",
  isTalking = false,
  scale = 1.0,
  flipX = false,
  x,
  y,
  left,
  right,
  bottom,
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

  // Walking cycle oscillation
  const walkPhase = (frame / 5) % (Math.PI * 2);
  const legSwingL = pose === "walk_cycle" ? Math.sin(walkPhase) * 18 : 0;
  const legSwingR = pose === "walk_cycle" ? -Math.sin(walkPhase) * 18 : 0;
  const walkBounce = pose === "walk_cycle" ? Math.abs(Math.sin(walkPhase)) * 6 : 0;

  const resolvedLeft = left !== undefined ? left : x !== undefined ? x : undefined;
  const resolvedTop = top !== undefined ? top : y !== undefined ? y : undefined;

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: 320,
    height: 520,
    transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) translateY(${walkBounce}px)`,
    transformOrigin: "bottom center",
    pointerEvents: "none",
    ...(resolvedLeft !== undefined ? { left: resolvedLeft } : {}),
    ...(right !== undefined ? { right } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
    ...(resolvedTop !== undefined ? { top: resolvedTop } : {}),
    ...style,
  };

  // Color Palettes by Identity
  const identityColors = {
    founder: {
      skin: "#FBD3B6",
      hair: "#231F20",
      top: "#384B3E", // Olive/Pine Green jacket
      inner: "#ECE9E2", // Off-white tee
      bottom: "#283442", // Navy denim
      accent: "#E07A5F", // Terracotta watch strap
    },
    barista: {
      skin: "#EAC3A2",
      hair: "#3C2F2F",
      top: "#2D2D2D", // Dark charcoal fitted tee
      apron: "#C86236", // Terracotta specialty café apron
      straps: "#5A3825", // Leather harness straps
      bottom: "#1E1E1E", // Black pants
      accent: "#EAE7DF", // Barista towel
    },
    camper: {
      skin: "#F5CEB0",
      hair: "#4A3B32",
      top: "#354A66", // Tech Slate Blue hoodie
      inner: "#D5D8DC",
      bottom: "#343A40", // Charcoal joggers
      accent: "#EAEAEA", // White AirPods
    },
    landlord: {
      skin: "#DDB590",
      hair: "#707B7C", // Salt and pepper hair
      top: "#EAE6DF", // Safari suit cream/khaki
      bottom: "#D5CFBF", // Khaki trousers
      accent: "#D4AF37", // Gold watch / ring
    },
  }[identity];

  const strokeColor = "#1F2421";
  const strokeW = 6;

  return (
    <div style={posStyle}>

      <svg
        viewBox="0 0 320 520"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="characterShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Ground Contact Shadow */}
        <ellipse
          cx="160"
          cy="505"
          rx={85 - walkBounce * 2}
          ry={14 - walkBounce}
          fill="#1C1E21"
          opacity="0.18"
        />

        {/* 2. LEGS & FEET */}
        {pose === "sitting" ? (
          // Sitting Leg Geometry
          <g id="legs-sitting" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Thighs */}
            <path
              d="M 130 330 L 195 330 L 220 390 L 220 470"
              fill={identityColors.bottom}
            />
            <path
              d="M 110 330 L 175 330 L 195 390 L 195 470"
              fill={identityColors.bottom}
            />
            {/* Shoes */}
            <path d="M 215 470 L 250 470 Q 255 485 240 488 L 210 488 Z" fill="#1C1E21" />
            <path d="M 190 470 L 225 470 Q 230 485 215 488 L 185 488 Z" fill="#1C1E21" />
          </g>
        ) : (
          // Standing / Walking Leg Geometry
          <g id="legs-standing" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Left Leg */}
            <g transform={`rotate(${legSwingL} 130 330)`}>
              <path
                d="M 120 330 L 125 465 L 145 465 L 145 330 Z"
                fill={identityColors.bottom}
              />
              {/* Left Shoe */}
              <path d="M 118 465 L 158 465 Q 166 480 150 485 L 115 485 Z" fill="#1C1E21" />
            </g>

            {/* Right Leg */}
            <g transform={`rotate(${legSwingR} 190 330)`}>
              <path
                d="M 175 330 L 175 465 L 195 465 L 200 330 Z"
                fill={identityColors.bottom}
              />
              {/* Right Shoe */}
              <path d="M 172 465 L 212 465 Q 220 480 204 485 L 169 485 Z" fill="#1C1E21" />
            </g>
          </g>
        )}

        {/* 3. TORSO & CLOTHING */}
        <g id="torso" transform={`translate(0, ${breath})`}>
          {/* Main Body Shirt / Jacket */}
          <path
            d="M 105 185 Q 160 178 215 185 L 225 335 Q 160 345 95 335 Z"
            fill={identityColors.top}
            stroke={strokeColor}
            strokeWidth={strokeW}
            strokeLinejoin="round"
          />

          {/* Identity Specific Overlay */}
          {identity === "barista" && (
            <g id="barista-apron">
              {/* Leather Neck Straps */}
              <line x1="130" y1="185" x2="140" y2="215" stroke={identityColors.straps} strokeWidth="5" />
              <line x1="190" y1="185" x2="180" y2="215" stroke={identityColors.straps} strokeWidth="5" />
              {/* Apron Body */}
              <path
                d="M 125 215 L 195 215 L 215 345 L 105 345 Z"
                fill={identityColors.apron}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeLinejoin="round"
              />
              {/* Apron Pocket */}
              <rect x="135" y="270" width="50" height="40" rx="4" fill="#A84E26" stroke={strokeColor} strokeWidth="3" />
              {/* Hanging Barista Towel */}
              <path d="M 195 335 Q 205 365 200 395 L 188 395 Q 188 365 190 335" fill={identityColors.accent} stroke={strokeColor} strokeWidth="3" />
            </g>
          )}

          {identity === "founder" && (
            <g id="founder-inner-tee">
              {/* Open jacket v-neck showing inner tee */}
              <path d="M 145 185 Q 160 220 175 185 Z" fill={identityColors.inner} stroke={strokeColor} strokeWidth="4" />
            </g>
          )}

          {identity === "camper" && (
            <g id="camper-hoodie">
              {/* Hoodie pocket pouch */}
              <path
                d="M 125 285 Q 160 280 195 285 L 190 325 Q 160 330 130 325 Z"
                fill="#2A3D54"
                stroke={strokeColor}
                strokeWidth="4"
              />
              {/* Drawstrings */}
              <path d="M 148 195 L 148 225" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path d="M 172 195 L 172 225" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {identity === "landlord" && (
            <g id="landlord-safari">
              {/* Lapel & buttons */}
              <line x1="160" y1="185" x2="160" y2="330" stroke={strokeColor} strokeWidth="3" />
              <circle cx="160" cy="225" r="4" fill="#333" />
              <circle cx="160" cy="265" r="4" fill="#333" />
              <circle cx="160" cy="305" r="4" fill="#333" />
              {/* Chest pocket with pen */}
              <rect x="118" y="220" width="30" height="22" rx="2" fill="#DFD9CD" stroke={strokeColor} strokeWidth="3" />
              <line x1="130" y1="215" x2="130" y2="225" stroke={identityColors.accent} strokeWidth="4" />
            </g>
          )}
        </g>

        {/* 4. HEAD, FACE & EMOTIONS */}
        <g id="head" transform={`translate(0, ${headBob + breath * 0.5})`}>
          {/* Neck */}
          <path
            d="M 145 160 L 145 190 L 175 190 L 175 160 Z"
            fill={identityColors.skin}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Ears */}
          <ellipse cx="106" cy="120" rx="9" ry="12" fill={identityColors.skin} stroke={strokeColor} strokeWidth={strokeW} />
          <ellipse cx="214" cy="120" rx="9" ry="12" fill={identityColors.skin} stroke={strokeColor} strokeWidth={strokeW} />

          {/* Head Base */}
          <ellipse
            cx="160"
            cy="118"
            rx="50"
            ry="56"
            fill={identityColors.skin}
            stroke={strokeColor}
            strokeWidth={strokeW}
          />

          {/* Hair Styles */}
          {identity === "barista" && (
            <path
              d="M 110 115 C 105 70, 150 55, 205 75 C 215 95, 215 115, 210 125 C 190 90, 140 85, 110 115 Z"
              fill={identityColors.hair}
              stroke={strokeColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          )}

          {identity === "founder" && (
            <path
              d="M 112 110 C 108 65, 160 50, 210 68 C 215 90, 210 115, 208 120 C 195 85, 145 80, 112 110 Z"
              fill={identityColors.hair}
              stroke={strokeColor}
              strokeWidth={strokeW}
              strokeLinejoin="round"
            />
          )}

          {identity === "camper" && (
            <g id="camper-hair-and-pod">
              <path
                d="M 112 115 C 105 65, 170 55, 208 75 C 212 95, 210 115, 206 122 C 195 90, 140 85, 112 115 Z"
                fill={identityColors.hair}
                stroke={strokeColor}
                strokeWidth={strokeW}
              />
              {/* AirPod in right ear */}
              <ellipse cx="214" cy="120" rx="4" ry="6" fill="#FFFFFF" />
              <line x1="214" y1="123" x2="214" y2="135" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {identity === "landlord" && (
            <g id="landlord-hair">
              {/* Receding salt and pepper */}
              <path
                d="M 108 120 C 108 75, 130 65, 160 65 C 190 65, 212 75, 212 120 C 205 95, 185 85, 160 85 C 135 85, 115 95, 108 120 Z"
                fill={identityColors.hair}
                stroke={strokeColor}
                strokeWidth={strokeW}
              />
              {/* Classic moustache */}
              <path
                d="M 142 142 Q 160 135 178 142 Q 160 152 142 142 Z"
                fill={identityColors.hair}
                stroke={strokeColor}
                strokeWidth="3"
              />
            </g>
          )}

          {/* Spectacles for Founder and Landlord */}
          {(identity === "founder" || identity === "landlord") && (
            <g id="spectacles" stroke={strokeColor} strokeWidth="4" fill="none">
              <rect x="130" y="106" width="22" height="18" rx="4" />
              <rect x="168" y="106" width="22" height="18" rx="4" />
              <line x1="152" y1="114" x2="168" y2="114" />
              <line x1="108" y1="112" x2="130" y2="114" />
            </g>
          )}

          {/* EYES */}
          {blink ? (
            // Closed eyes blink
            <g stroke={strokeColor} strokeWidth="4" strokeLinecap="round">
              <line x1="134" y1="116" x2="148" y2="116" />
              <line x1="172" y1="116" x2="186" y2="116" />
            </g>
          ) : emotion === "stress" ? (
            // Stress wide panicked eyes
            <g>
              <ellipse cx="141" cy="115" rx="7" ry="8" fill="#FFF" stroke={strokeColor} strokeWidth="3" />
              <circle cx="141" cy="115" r="3" fill="#1C1E21" />
              <ellipse cx="179" cy="115" rx="7" ry="8" fill="#FFF" stroke={strokeColor} strokeWidth="3" />
              <circle cx="179" cy="115" r="3" fill="#1C1E21" />
              {/* Angled eyebrows */}
              <line x1="132" y1="102" x2="149" y2="108" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
              <line x1="188" y1="102" x2="171" y2="108" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : (
            // Normal confident eyes
            <g>
              <circle cx="141" cy="115" r="5" fill="#1C1E21" />
              <circle cx="179" cy="115" r="5" fill="#1C1E21" />
              <circle cx="143" cy="113" r="1.8" fill="#FFFFFF" />
              <circle cx="181" cy="113" r="1.8" fill="#FFFFFF" />
              {/* Eyebrows */}
              <path d="M 133 105 Q 141 101 149 104" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 171 104 Q 179 101 187 105" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* MOUTH & EMOTION */}
          {emotion === "smile" ? (
            <path
              d="M 148 136 Q 160 148 172 136"
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ) : emotion === "stress" ? (
            <path
              d="M 146 142 Q 153 136 160 143 Q 167 148 174 141"
              stroke={strokeColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ) : mouthOpen > 0 ? (
            // Talking animated mouth
            <ellipse
              cx="160"
              cy="138"
              rx="8"
              ry={mouthOpen}
              fill="#A83232"
              stroke={strokeColor}
              strokeWidth="3"
            />
          ) : (
            // Neutral calm line
            <line x1="150" y1="138" x2="170" y2="138" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Flying Sweat Drop (Stress) */}
          {emotion === "stress" && (
            <path
              d="M 198 95 C 198 85, 208 85, 208 95 C 208 102, 198 102, 198 95 Z"
              fill="#3898EC"
              stroke={strokeColor}
              strokeWidth="2"
              transform={`translate(0, ${Math.sin(frame * 0.2) * 5})`}
            />
          )}
        </g>

        {/* 5. ARMS & POSES */}
        {pose === "pour_espresso" && (
          <g id="arms-pour" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Left Arm holding Pitcher */}
            <path d="M 105 195 L 75 240 L 125 260" fill="none" />
            {/* Pitcher */}
            <g transform="translate(115, 240) rotate(-25)">
              <rect x="0" y="0" width="30" height="40" rx="3" fill="#D3D3D3" stroke={strokeColor} strokeWidth="4" />
              <path d="M 30 10 Q 42 20 30 30" fill="none" stroke={strokeColor} strokeWidth="4" />
              {/* Steamed Milk Stream */}
              <path d="M 32 5 Q 45 35 48 65" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
            {/* Right Arm holding Ceramic Cup */}
            <path d="M 215 195 L 235 250 L 180 275" fill="none" />
            {/* Ceramic Cup */}
            <g transform="translate(155, 275) rotate(15)">
              <path d="M 0 0 L 32 0 L 26 26 Q 16 30 6 26 Z" fill="#F7F5F0" stroke={strokeColor} strokeWidth="4" />
              <path d="M 32 6 Q 40 12 30 20" fill="none" stroke={strokeColor} strokeWidth="3" />
              <ellipse cx="16" cy="4" rx="14" ry="4" fill="#6F4E37" />
            </g>
          </g>
        )}

        {pose === "type_laptop" && (
          <g id="arms-laptop" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Arms bent onto laptop */}
            <path d="M 105 195 L 90 265 L 140 280" fill="none" />
            <path d="M 215 195 L 230 265 L 180 280" fill="none" />
            {/* 2.5D Laptop on desk */}
            <g transform="translate(100, 275)">
              {/* Keyboard base */}
              <polygon points="0,20 120,20 100,45 -20,45" fill="#C5C9CD" stroke={strokeColor} strokeWidth="4" />
              {/* Laptop Screen with glowing apple */}
              <polygon points="0,20 120,20 120,-60 0,-60" fill="#2B303A" stroke={strokeColor} strokeWidth="4" />
              <circle cx="60" cy="-20" r="7" fill="#EAEAEA" />
            </g>
          </g>
        )}

        {pose === "hand_money" && (
          <g id="arms-money" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Left arm relaxed */}
            <path d="M 105 195 L 90 270 L 105 320" fill="none" />
            {/* Right arm extended forward offering cash */}
            <path d="M 215 195 L 250 240 L 285 240" fill="none" />
            {/* Currency notes in hand */}
            <g transform="translate(280, 225) rotate(-15)">
              <rect x="0" y="0" width="45" height="26" rx="3" fill="#2E7D32" stroke={strokeColor} strokeWidth="3" />
              <circle cx="22" cy="13" r="5" fill="#81C784" />
              <text x="22" y="17" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">₹</text>
            </g>
          </g>
        )}

        {pose === "cross_arms" && (
          <g id="arms-crossed" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Left forearm across */}
            <path d="M 105 195 L 120 260 L 205 250" fill="none" />
            {/* Right forearm over left */}
            <path d="M 215 195 L 200 260 L 115 250" fill="none" />
          </g>
        )}

        {pose === "point_phone" && (
          <g id="arms-phone" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Left arm relaxed */}
            <path d="M 105 195 L 95 270 L 105 320" fill="none" />
            {/* Right arm holding smartphone */}
            <path d="M 215 195 L 235 255 L 195 245" fill="none" />
            {/* Smartphone with glowing display */}
            <g transform="translate(180, 215) rotate(10)">
              <rect x="0" y="0" width="28" height="48" rx="5" fill="#1C1E21" stroke={strokeColor} strokeWidth="3" />
              <rect x="3" y="4" width="22" height="40" rx="3" fill="#FF9800" />
              <text x="14" y="22" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#FFF">₹84k</text>
            </g>
          </g>
        )}

        {pose === "shrug" && (
          <g id="arms-shrug" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* High shrug shoulders */}
            <path d="M 105 185 L 65 220 L 75 260" fill="none" />
            <path d="M 215 185 L 255 220 L 245 260" fill="none" />
            {/* Open palms */}
            <path d="M 75 260 Q 60 270 50 255" fill="none" stroke={strokeColor} strokeWidth="4" />
            <path d="M 245 260 Q 260 270 270 255" fill="none" stroke={strokeColor} strokeWidth="4" />
          </g>
        )}

        {(pose === "idle" || pose === "walk_cycle") && (
          <g id="arms-idle" stroke={strokeColor} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
            {/* Natural swinging arms */}
            <path
              d={`M 105 195 L ${95 - legSwingL * 0.5} 265 L ${105 - legSwingL * 0.7} 325`}
              fill="none"
            />
            <path
              d={`M 215 195 L ${225 - legSwingR * 0.5} 265 L ${215 - legSwingR * 0.7} 325`}
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
