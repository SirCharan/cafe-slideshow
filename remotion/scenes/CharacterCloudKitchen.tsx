import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export type CKCharacterIdentity =
  | "kitchen_founder"
  | "chef_murugan"
  | "delivery_rider";

export type CKCharacterPose =
  | "idle"
  | "point_tablet"
  | "holding_ladle"
  | "holding_order"
  | "stress_head"
  | "count_cash";

export type CKCharacterEmotion = "neutral" | "confident" | "thinking" | "stressed" | "shocked" | "impatient" | "talking";

export interface CharacterCloudKitchenProps {
  identity: CKCharacterIdentity;
  pose?: CKCharacterPose;
  emotion?: CKCharacterEmotion;
  isTalking?: boolean;
  scale?: number;
  flipX?: boolean;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  top?: number | string;
  style?: React.CSSProperties;
}

export const CharacterCloudKitchen: React.FC<CharacterCloudKitchenProps> = ({
  identity,
  pose = "idle",
  emotion = "neutral",
  isTalking = false,
  scale = 1.0,
  flipX = false,
  left,
  right,
  bottom = 120,
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

  return (
    <div
      style={{
        position: "absolute",
        left,
        right,
        bottom,
        top,
        transform: `scale(${scale}) ${flipX ? "scaleX(-1)" : ""}`,
        transformOrigin: "bottom center",
        width: 320,
        height: 640,
        pointerEvents: "none",
        zIndex: 20,
        ...style,
      }}
    >
      <svg viewBox="0 0 320 640" width="320" height="640">
        {/* SHADOW BASE */}
        <ellipse cx="160" cy="620" rx="90" ry="16" fill="rgba(0,0,0,0.18)" />

        {/* 1. KITCHEN FOUNDER (Rohan - 28yo ex-techie) */}
        {identity === "kitchen_founder" && (
          <g transform={`translate(0, ${breath})`}>
            {/* Legs & Dark Jeans */}
            <path d="M 125 400 L 120 600 L 145 605 L 152 420 Z" fill="#2C3E50" />
            <path d="M 168 420 L 175 605 L 200 600 L 195 400 Z" fill="#34495E" />
            {/* Clean White Sneakers */}
            <rect x="110" y="598" width="40" height="18" rx="8" fill="#ECF0F1" stroke="#BDC3C7" strokeWidth="2" />
            <rect x="170" y="598" width="40" height="18" rx="8" fill="#ECF0F1" stroke="#BDC3C7" strokeWidth="2" />

            {/* Torso & Polo Shirt */}
            <rect x="110" y="240" width="100" height="170" rx="14" fill="#16A085" />
            {/* Apron Layer (Commercial Kitchen Apron) */}
            <path d="M 125 280 L 195 280 L 205 470 L 115 470 Z" fill="#2C3E50" opacity="0.95" />
            <line x1="125" y1="280" x2="140" y2="240" stroke="#BDC3C7" strokeWidth="3" />
            <line x1="195" y1="280" x2="180" y2="240" stroke="#BDC3C7" strokeWidth="3" />
            {/* Apron Front Pocket with Order Pen & Ticket */}
            <rect x="135" y="340" width="50" height="40" rx="4" fill="#34495E" />
            <rect x="142" y="330" width="12" height="20" rx="2" fill="#E74C3C" />
            <rect x="160" y="325" width="18" height="25" rx="1" fill="#FFFDE7" stroke="#BDC3C7" strokeWidth="1" />

            {/* Arms & Hands (Holding iPad/Tablet with Orders) */}
            <g>
              {/* Left Arm holding tablet */}
              <path d="M 110 260 L 70 330 L 115 370" fill="none" stroke="#F1C40F" strokeWidth="24" strokeLinecap="round" />
              {/* Right Arm pointing or tapping */}
              <path d="M 210 260 L 245 320 L 205 355" fill="none" stroke="#F1C40F" strokeWidth="24" strokeLinecap="round" />
              {/* Glowing Swiggy/Zomato Tablet */}
              <rect x="100" y="320" width="115" height="75" rx="8" fill="#1C2833" stroke="#F39C12" strokeWidth="3" />
              <rect x="105" y="325" width="105" height="65" rx="4" fill="#E67E22" />
              {/* Order notification badges on tablet */}
              <circle cx="195" cy="335" r="7" fill="#E74C3C" />
              <text x="192" y="338" fontSize="9" fill="#FFFFFF" fontWeight="bold">9</text>
              <text x="115" y="360" fontSize="12" fill="#FFFFFF" fontWeight="bold">NEW ORDER</text>
            </g>

            {/* Head & Face */}
            <g transform={`translate(0, ${headBob})`}>
              {/* Neck */}
              <rect x="145" y="210" width="30" height="35" fill="#F5CBA7" />
              {/* Face */}
              <ellipse cx="160" cy="180" rx="42" ry="48" fill="#F5CBA7" />
              {/* Modern Tech Haircut */}
              <path d="M 115 170 C 115 120, 205 120, 205 170 C 205 145, 175 130, 160 130 C 140 130, 120 145, 115 170 Z" fill="#2C3E50" />
              {/* Smart Glasses */}
              <rect x="130" y="165" width="25" height="18" rx="4" fill="none" stroke="#34495E" strokeWidth="3" />
              <rect x="165" y="165" width="25" height="18" rx="4" fill="none" stroke="#34495E" strokeWidth="3" />
              <line x1="155" y1="174" x2="165" y2="174" stroke="#34495E" strokeWidth="3" />

              {/* Eyes */}
              {!blink ? (
                <>
                  <circle cx="142" cy="174" r="3.5" fill="#1C2833" />
                  <circle cx="178" cy="174" r="3.5" fill="#1C2833" />
                </>
              ) : (
                <>
                  <line x1="138" y1="174" x2="146" y2="174" stroke="#1C2833" strokeWidth="2.5" />
                  <line x1="174" y1="174" x2="182" y2="174" stroke="#1C2833" strokeWidth="2.5" />
                </>
              )}

              {/* Mouth */}
              {mouthOpen > 0 ? (
                <ellipse cx="160" cy="205" rx="8" ry={mouthOpen} fill="#C0392B" />
              ) : emotion === "stressed" ? (
                <path d="M 150 208 Q 160 200 170 208" stroke="#7B241C" strokeWidth="3" fill="none" />
              ) : (
                <path d="M 150 204 Q 160 212 170 204" stroke="#7B241C" strokeWidth="3" fill="none" />
              )}
            </g>
          </g>
        )}

        {/* 2. MASTER CHEF MURUGAN (Commercial Kitchen Cook) */}
        {identity === "chef_murugan" && (
          <g transform={`translate(0, ${breath})`}>
            {/* Legs */}
            <path d="M 125 400 L 120 600 L 145 605 L 152 420 Z" fill="#1C2833" />
            <path d="M 168 420 L 175 605 L 200 600 L 195 400 Z" fill="#1C2833" />
            <rect x="110" y="598" width="40" height="18" rx="6" fill="#2C3E50" />
            <rect x="170" y="598" width="40" height="18" rx="6" fill="#2C3E50" />

            {/* White Double-Breasted Chef Jacket */}
            <rect x="105" y="230" width="110" height="180" rx="12" fill="#ECF0F1" stroke="#BDC3C7" strokeWidth="2" />
            {/* Double buttons */}
            {[260, 290, 320, 350].map((by) => (
              <g key={by}>
                <circle cx="140" cy={by} r="4" fill="#2C3E50" />
                <circle cx="170" cy={by} r="4" fill="#2C3E50" />
              </g>
            ))}

            {/* Red Checked Kitchen Towel on Shoulder */}
            <path d="M 105 240 Q 120 280 115 320 L 100 320 Q 95 270 105 240 Z" fill="#E74C3C" />

            {/* Arms holding giant stainless-steel Biryani Ladle */}
            <path d="M 105 260 L 60 320 L 110 350" fill="none" stroke="#F5CBA7" strokeWidth="24" strokeLinecap="round" />
            <path d="M 215 260 L 255 310 L 220 370" fill="none" stroke="#F5CBA7" strokeWidth="24" strokeLinecap="round" />
            {/* Stainless Steel Biryani Ladle */}
            <line x1="50" y1="290" x2="250" y2="440" stroke="#BDC3C7" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="45" cy="285" rx="18" ry="24" fill="#95A5A6" stroke="#7F8C8D" strokeWidth="2" />

            {/* Head & Chef Toque */}
            <g transform={`translate(0, ${headBob})`}>
              <rect x="145" y="200" width="30" height="35" fill="#E59866" />
              <ellipse cx="160" cy="180" rx="44" ry="46" fill="#E59866" />
              {/* Mustache */}
              <path d="M 140 195 Q 160 190 180 195 Q 160 205 140 195 Z" fill="#1C2833" />

              {/* Eyes */}
              {!blink ? (
                <>
                  <circle cx="144" cy="170" r="3.5" fill="#1C2833" />
                  <circle cx="176" cy="170" r="3.5" fill="#1C2833" />
                </>
              ) : (
                <>
                  <line x1="140" y1="170" x2="148" y2="170" stroke="#1C2833" strokeWidth="2.5" />
                  <line x1="172" y1="170" x2="180" y2="170" stroke="#1C2833" strokeWidth="2.5" />
                </>
              )}

              {/* Tall White Chef Hat (Toque Blanche) */}
              <path d="M 120 150 L 120 110 Q 110 80 140 70 Q 160 60 180 70 Q 210 80 200 110 L 200 150 Z" fill="#FFFFFF" stroke="#BDC3C7" strokeWidth="3" />
              <rect x="120" y="140" width="80" height="15" fill="#F8F9F9" stroke="#BDC3C7" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* 3. SWIGGY / ZOMATO DELIVERY RIDER (Manjunath) */}
        {identity === "delivery_rider" && (
          <g transform={`translate(0, ${breath})`}>
            {/* Legs */}
            <path d="M 125 400 L 120 600 L 145 605 L 152 420 Z" fill="#2C3E50" />
            <path d="M 168 420 L 175 605 L 200 600 L 195 400 Z" fill="#2C3E50" />
            <rect x="110" y="598" width="40" height="18" rx="6" fill="#1C2833" />
            <rect x="170" y="598" width="40" height="18" rx="6" fill="#1C2833" />

            {/* Giant Thermal Delivery Backpack */}
            <rect x="65" y="240" width="55" height="150" rx="8" fill="#E67E22" stroke="#D35400" strokeWidth="3" />
            <rect x="75" y="260" width="35" height="110" fill="#F39C12" />

            {/* Bright Orange/Red Delivery Jacket */}
            <rect x="110" y="240" width="100" height="170" rx="14" fill="#FC8019" />
            {/* Reflective Safety Stripes */}
            <rect x="110" y="310" width="100" height="14" fill="#F1C40F" opacity="0.9" />
            <rect x="110" y="335" width="100" height="14" fill="#FFFFFF" opacity="0.9" />

            {/* Arm holding Customer Order Token */}
            <path d="M 110 260 L 80 320 L 130 350" fill="none" stroke="#F5CBA7" strokeWidth="22" strokeLinecap="round" />
            <path d="M 210 260 L 250 320 L 220 370" fill="none" stroke="#F5CBA7" strokeWidth="22" strokeLinecap="round" />
            {/* Order Bag in Hand */}
            <rect x="220" y="340" width="60" height="70" rx="4" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="2" />
            <text x="232" y="380" fontSize="12" fill="#5D4037" fontWeight="bold">#4891</text>

            {/* Head & Helmet */}
            <g transform={`translate(0, ${headBob})`}>
              <rect x="145" y="210" width="30" height="35" fill="#F5CBA7" />
              <ellipse cx="160" cy="180" rx="40" ry="45" fill="#F5CBA7" />

              {/* Full Motorcycle Helmet on Forehead */}
              <path d="M 115 170 Q 160 110 205 170 L 200 135 Q 160 100 120 135 Z" fill="#1C2833" stroke="#FC8019" strokeWidth="4" />
              <rect x="125" y="130" width="70" height="18" rx="6" fill="#3498DB" opacity="0.7" />

              {/* Eyes looking impatient */}
              {!blink ? (
                <>
                  <circle cx="144" cy="174" r="3.5" fill="#1C2833" />
                  <circle cx="176" cy="174" r="3.5" fill="#1C2833" />
                </>
              ) : (
                <>
                  <line x1="140" y1="174" x2="148" y2="174" stroke="#1C2833" strokeWidth="2.5" />
                  <line x1="172" y1="174" x2="180" y2="174" stroke="#1C2833" strokeWidth="2.5" />
                </>
              )}

              {/* Impatient Mouth */}
              {mouthOpen > 0 ? (
                <ellipse cx="160" cy="202" rx="7" ry={mouthOpen} fill="#922B21" />
              ) : (
                <line x1="150" y1="202" x2="170" y2="202" stroke="#7B241C" strokeWidth="2.5" />
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
