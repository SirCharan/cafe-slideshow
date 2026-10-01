import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type PGCharacterIdentity =
  | "pg_uncle"
  | "techie_tenant"
  | "kitchen_cook"
  | "master_landlord";

export type PGCharacterPose =
  | "idle"
  | "count_cash"
  | "point_keys"
  | "scold_phone"
  | "stir_pot"
  | "carry_bag"
  | "hold_lease"
  | "walk_cycle";

export type PGCharacterEmotion = "neutral" | "smile" | "stress" | "angry" | "talking";

export interface CharacterPGProps {
  identity: PGCharacterIdentity;
  pose?: PGCharacterPose;
  emotion?: PGCharacterEmotion;
  isTalking?: boolean;
  scale?: number;
  flipX?: boolean;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  top?: number | string;
  style?: React.CSSProperties;
}

export const CharacterPG: React.FC<CharacterPGProps> = ({
  identity,
  pose = "idle",
  emotion = "neutral",
  isTalking = false,
  scale = 1.0,
  flipX = false,
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

  // Walk cycle
  const walkPhase = (frame / 5) % (Math.PI * 2);
  const legSwingL = pose === "walk_cycle" ? Math.sin(walkPhase) * 18 : 0;
  const legSwingR = pose === "walk_cycle" ? -Math.sin(walkPhase) * 18 : 0;
  const walkBounce = pose === "walk_cycle" ? Math.abs(Math.sin(walkPhase)) * 6 : 0;

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: 320,
    height: 520,
    transform: `scale(${scale}) scaleX(${flipX ? -1 : 1}) translateY(${walkBounce}px)`,
    transformOrigin: "bottom center",
    pointerEvents: "none",
    ...(left !== undefined ? { left } : {}),
    ...(right !== undefined ? { right } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
    ...(top !== undefined ? { top } : {}),
    ...style,
  };

  // Color Palettes
  const colors = {
    pg_uncle: {
      skin: "#E5A67C",
      shirt: "#FDFEFE",
      pants: "#2C3E50",
      hair: "#2C3E50",
      shoes: "#17202A",
      chain: "#F1C40F",
    },
    techie_tenant: {
      skin: "#F5CBA7",
      shirt: "#2980B9",
      hoodie: "#1B4F72",
      pants: "#34495E",
      hair: "#1B2631",
      shoes: "#BDC3C7",
      lanyard: "#E74C3C",
    },
    kitchen_cook: {
      skin: "#D38B5D",
      shirt: "#EAEDED",
      pants: "#C0392B",
      hair: "#2C3E50",
      shoes: "#7F8C8D",
      apron: "#E67E22",
    },
    master_landlord: {
      skin: "#E59866",
      shirt: "#D5D8DC",
      safari: "#BFC9CA",
      pants: "#7F8C8D",
      hair: "#566573",
      shoes: "#1C2833",
      gold: "#F39C12",
    },
  }[identity];

  return (
    <div style={posStyle}>
      <svg
        viewBox="0 0 320 520"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id={`shadow-${identity}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* 1. GROUND CONTACT SHADOW */}
        <ellipse cx="160" cy="505" rx="80" ry="12" fill="rgba(0,0,0,0.18)" />

        {/* 2. LEGS */}
        <g id="legs">
          {/* Left Leg */}
          <line
            x1="135"
            y1="340"
            x2={135 + legSwingL}
            y2="490"
            stroke={colors.pants}
            strokeWidth="28"
            strokeLinecap="round"
          />
          {/* Right Leg */}
          <line
            x1="185"
            y1="340"
            x2={185 + legSwingR}
            y2="490"
            stroke={colors.pants}
            strokeWidth="28"
            strokeLinecap="round"
          />
          {/* Shoes */}
          <ellipse cx={135 + legSwingL + 6} cy="495" rx="18" ry="9" fill={colors.shoes} />
          <ellipse cx={185 + legSwingR + 6} cy="495" rx="18" ry="9" fill={colors.shoes} />
        </g>

        {/* 3. TORSO & CLOTHING */}
        <g id="torso" transform={`translate(0, ${breath})`} filter={`url(#shadow-${identity})`}>
          {identity === "pg_uncle" && (
            <>
              {/* White Formal Half-Sleeve Shirt */}
              <rect x="110" y="200" width="100" height="150" rx="16" fill={colors.shirt} stroke="#BDC3C7" strokeWidth="2" />
              {/* Gold Chain */}
              <path d="M 140 205 Q 160 230 180 205" fill="none" stroke={colors.chain} strokeWidth="4" />
              {/* Collar */}
              <polygon points="135,200 160,225 145,200" fill="#EAEDED" stroke="#BDC3C7" strokeWidth="2" />
              <polygon points="185,200 160,225 175,200" fill="#EAEDED" stroke="#BDC3C7" strokeWidth="2" />
              {/* Chest pocket & pen */}
              <rect x="122" y="235" width="22" height="26" rx="3" fill="none" stroke="#BDC3C7" strokeWidth="2" />
              <line x1="133" y1="230" x2="133" y2="242" stroke="#2980B9" strokeWidth="3" />
              {/* Dark Belt */}
              <rect x="110" y="340" width="100" height="12" fill="#1C2833" />
              <rect x="152" y="338" width="16" height="16" fill="#F1C40F" rx="2" />
            </>
          )}

          {identity === "techie_tenant" && (
            <>
              {/* Blue Tech Hoodie */}
              <rect x="105" y="195" width="110" height="155" rx="18" fill={colors.hoodie} stroke="#154360" strokeWidth="2" />
              {/* Hoodie Pouch */}
              <path d="M 125 295 L 195 295 L 205 330 L 115 330 Z" fill="#154360" rx="6" />
              {/* Tech Company Lanyard & Badge */}
              <path d="M 145 195 L 160 270 L 175 195" fill="none" stroke={colors.lanyard} strokeWidth="4" />
              <rect x="150" y="270" width="20" height="28" rx="3" fill="#FFF" stroke="#2C3E50" strokeWidth="2" />
              <rect x="153" y="274" width="14" height="6" fill="#E74C3C" />
            </>
          )}

          {identity === "kitchen_cook" && (
            <>
              {/* Cook Undershirt / Banian */}
              <rect x="115" y="200" width="90" height="145" rx="14" fill={colors.shirt} stroke="#BDC3C7" strokeWidth="2" />
              {/* Red & Orange Kitchen Apron */}
              <path d="M 125 220 L 195 220 L 205 345 L 115 345 Z" fill={colors.apron} stroke="#BA4A00" strokeWidth="2" />
              <rect x="135" y="200" width="50" height="22" fill={colors.apron} />
              {/* White Towel over Shoulder */}
              <path d="M 110 205 Q 105 240 115 265 Q 125 240 120 205" fill="#FDFEFE" stroke="#BDC3C7" strokeWidth="2" />
            </>
          )}

          {identity === "master_landlord" && (
            <>
              {/* Safari Suit Jacket */}
              <rect x="108" y="195" width="104" height="155" rx="14" fill={colors.safari} stroke="#95A5A6" strokeWidth="2" />
              <polygon points="125,195 160,235 140,195" fill="#BDC3C7" />
              <polygon points="195,195 160,235 180,195" fill="#BDC3C7" />
              <rect x="118" y="240" width="26" height="24" rx="2" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="1.5" />
              <line x1="160" y1="235" x2="160" y2="350" stroke="#7F8C8D" strokeWidth="3" />
            </>
          )}
        </g>

        {/* 4. HEAD, FACE & ACCESSORIES */}
        <g id="head" transform={`translate(0, ${headBob})`}>
          {/* Neck */}
          <rect x="145" y="175" width="30" height="30" fill={colors.skin} />

          {/* Head Base */}
          <circle cx="160" cy="130" r="48" fill={colors.skin} stroke="#2C3E50" strokeWidth="3" />

          {/* Hair */}
          {identity === "pg_uncle" && (
            <>
              <path d="M 115 130 Q 120 85 160 85 Q 200 85 205 130 Z" fill={colors.hair} />
              {/* Sideburns */}
              <rect x="112" y="125" width="8" height="20" fill={colors.hair} rx="2" />
              <rect x="200" y="125" width="8" height="20" fill={colors.hair} rx="2" />
              {/* Moustache */}
              <path d="M 145 150 Q 160 156 175 150 Q 160 162 145 150 Z" fill={colors.hair} />
            </>
          )}

          {identity === "techie_tenant" && (
            <>
              <path d="M 112 125 Q 120 78 160 78 Q 200 78 208 125 Z" fill={colors.hair} />
              {/* Modern fade styling */}
              <path d="M 125 90 Q 160 72 195 90" stroke="#154360" strokeWidth="4" fill="none" />
              {/* White Wireless Earbuds */}
              <ellipse cx="114" cy="135" rx="4" ry="7" fill="#FFF" stroke="#BDC3C7" strokeWidth="1" />
              <ellipse cx="206" cy="135" rx="4" ry="7" fill="#FFF" stroke="#BDC3C7" strokeWidth="1" />
            </>
          )}

          {identity === "kitchen_cook" && (
            <>
              {/* Receding Hair & Stubble */}
              <path d="M 118 125 Q 125 95 160 95 Q 195 95 202 125 Z" fill={colors.hair} />
              <circle cx="160" cy="148" r="1.5" fill="#7F8C8D" />
              <circle cx="155" cy="152" r="1.5" fill="#7F8C8D" />
              <circle cx="165" cy="152" r="1.5" fill="#7F8C8D" />
            </>
          )}

          {identity === "master_landlord" && (
            <>
              {/* Greying hair */}
              <path d="M 114 125 Q 120 82 160 82 Q 200 82 206 125 Z" fill="#566573" />
              {/* Big South Indian landlord moustache */}
              <path d="M 140 152 Q 160 162 180 152 Q 160 170 140 152 Z" fill="#2C3E50" />
            </>
          )}

          {/* Eyes & Eyebrows */}
          {blink ? (
            <>
              <line x1="135" y1="128" x2="149" y2="128" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
              <line x1="171" y1="128" x2="185" y2="128" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="142" cy="128" rx="6" ry="6" fill="#1F2421" />
              <circle cx="144" cy="126" r="2" fill="#FFF" />
              <ellipse cx="178" cy="128" rx="6" ry="6" fill="#1F2421" />
              <circle cx="180" cy="126" r="2" fill="#FFF" />
            </>
          )}

          {/* Eyebrows */}
          <line
            x1="134"
            y1={emotion === "angry" ? "120" : emotion === "stress" ? "114" : "117"}
            x2="150"
            y2={emotion === "angry" ? "124" : emotion === "stress" ? "119" : "117"}
            stroke="#1F2421"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="170"
            y1={emotion === "angry" ? "124" : emotion === "stress" ? "119" : "117"}
            x2="186"
            y2={emotion === "angry" ? "120" : emotion === "stress" ? "114" : "117"}
            stroke="#1F2421"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Eyeglasses for PG Uncle & Landlord */}
          {(identity === "pg_uncle" || identity === "master_landlord") && (
            <g stroke="#1F2421" strokeWidth="2.5" fill="rgba(255,255,255,0.25)">
              <rect x="132" y="120" width="22" height="16" rx="4" />
              <rect x="166" y="120" width="22" height="16" rx="4" />
              <line x1="154" y1="127" x2="166" y2="127" />
              <line x1="132" y1="126" x2="114" y2="122" />
              <line x1="188" y1="126" x2="206" y2="122" />
            </g>
          )}

          {/* Mouth */}
          <ellipse
            cx="160"
            cy="154"
            rx={emotion === "smile" ? 9 : 6}
            ry={mouthOpen > 0 ? Math.max(2, mouthOpen) : emotion === "smile" ? 4 : 2}
            fill="#922B21"
          />

          {/* Sweat Drop for Stress */}
          {emotion === "stress" && (
            <path
              d="M 198 115 C 198 110, 206 110, 206 115 C 206 120, 198 120, 198 115 Z"
              fill="#5DADE2"
            />
          )}
        </g>

        {/* 5. ARMS & HELD PROPS (According to Pose) */}
        <g id="arms">
          {pose === "idle" && (
            <>
              <line x1="115" y1="215" x2="95" y2="310" stroke={colors.shirt || colors.skin} strokeWidth="18" strokeLinecap="round" />
              <line x1="205" y1="215" x2="225" y2="310" stroke={colors.shirt || colors.skin} strokeWidth="18" strokeLinecap="round" />
              <circle cx="95" cy="315" r="10" fill={colors.skin} />
              <circle cx="225" cy="315" r="10" fill={colors.skin} />
            </>
          )}

          {pose === "point_keys" && (
            <>
              {/* Left hand holding phone/ledger */}
              <line x1="115" y1="215" x2="95" y2="280" stroke={colors.shirt} strokeWidth="18" strokeLinecap="round" />
              <circle cx="95" cy="285" r="10" fill={colors.skin} />
              {/* Right arm holding heavy brass keychain */}
              <line x1="205" y1="215" x2="235" y2="260" stroke={colors.shirt} strokeWidth="18" strokeLinecap="round" />
              <line x1="235" y1="260" x2="255" y2="250" stroke={colors.skin} strokeWidth="14" strokeLinecap="round" />
              {/* Brass Key Ring with 5 Keys */}
              <circle cx="265" cy="245" r="12" fill="none" stroke="#F1C40F" strokeWidth="4" />
              <rect x="260" y="255" width="4" height="24" fill="#F39C12" />
              <rect x="268" y="255" width="4" height="28" fill="#F1C40F" />
              <rect x="274" y="253" width="4" height="22" fill="#D4AC0D" />
            </>
          )}

          {pose === "count_cash" && (
            <>
              {/* Both arms holding currency bundles */}
              <line x1="115" y1="215" x2="140" y2="280" stroke={colors.shirt} strokeWidth="18" strokeLinecap="round" />
              <line x1="205" y1="215" x2="180" y2="280" stroke={colors.shirt} strokeWidth="18" strokeLinecap="round" />
              {/* Rupee Bundles (₹500 notes - stone grey / orange band) */}
              <rect x="145" y="265" width="34" height="20" rx="3" fill="#A3E4D7" stroke="#16A085" strokeWidth="2" />
              <rect x="142" y="270" width="36" height="18" rx="3" fill="#D5F5E3" stroke="#27AE60" strokeWidth="2" />
              <rect x="156" y="270" width="8" height="18" fill="#E67E22" />
            </>
          )}

          {pose === "stir_pot" && (
            <>
              {/* Left hand on hip */}
              <line x1="115" y1="215" x2="95" y2="270" stroke={colors.skin} strokeWidth="16" strokeLinecap="round" />
              <line x1="95" y1="270" x2="115" y2="295" stroke={colors.skin} strokeWidth="14" strokeLinecap="round" />
              {/* Right arm holding long stainless steel ladle */}
              <line x1="205" y1="215" x2="235" y2="270" stroke={colors.skin} strokeWidth="16" strokeLinecap="round" />
              <line x1="235" y1="270" x2="260" y2="310" stroke={colors.skin} strokeWidth="14" strokeLinecap="round" />
              {/* 3-Foot Steel Ladle */}
              <line x1="210" y1="240" x2="290" y2="350" stroke="#BDC3C7" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="295" cy="358" rx="14" ry="9" fill="#95A5A6" stroke="#7F8C8D" strokeWidth="2" />
            </>
          )}

          {pose === "carry_bag" && (
            <>
              {/* Techie carrying backpack / trolley bag */}
              <line x1="115" y1="215" x2="90" y2="290" stroke={colors.hoodie} strokeWidth="18" strokeLinecap="round" />
              <line x1="205" y1="215" x2="225" y2="280" stroke={colors.hoodie} strokeWidth="18" strokeLinecap="round" />
              <line x1="225" y1="280" x2="240" y2="330" stroke={colors.skin} strokeWidth="14" strokeLinecap="round" />
              {/* Trolley Suitcase */}
              <rect x="235" y="320" width="55" height="90" rx="8" fill="#2C3E50" stroke="#17202A" strokeWidth="3" />
              <line x1="250" y1="320" x2="250" y2="285" stroke="#7F8C8D" strokeWidth="4" />
              <circle cx="245" cy="415" r="6" fill="#17202A" />
              <circle cx="280" cy="415" r="6" fill="#17202A" />
            </>
          )}

          {pose === "hold_lease" && (
            <>
              <line x1="115" y1="215" x2="135" y2="275" stroke={colors.safari} strokeWidth="18" strokeLinecap="round" />
              <line x1="205" y1="215" x2="185" y2="275" stroke={colors.safari} strokeWidth="18" strokeLinecap="round" />
              {/* Karnataka Stamp Paper Lease */}
              <rect x="135" y="250" width="52" height="70" rx="3" fill="#FEF9E7" stroke="#F39C12" strokeWidth="2" />
              <rect x="140" y="255" width="42" height="14" fill="#E74C3C" rx="2" />
              <line x1="140" y1="278" x2="180" y2="278" stroke="#7F8C8D" strokeWidth="2" />
              <line x1="140" y1="286" x2="175" y2="286" stroke="#7F8C8D" strokeWidth="2" />
              <line x1="140" y1="294" x2="165" y2="294" stroke="#7F8C8D" strokeWidth="2" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
