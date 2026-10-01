import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../Character";

export interface SceneCounterProps {
  coffeePrice?: string;
  headline?: string;
  subheadline?: string;
}

export const SceneCounter: React.FC<SceneCounterProps> = ({
  coffeePrice = "₹280",
  headline = "THE ESPRESSO BAR",
  subheadline = "SPECIALTY ROAST · UNIT MARGIN BREAKDOWN",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle continuous camera push
  const zoom = interpolate(frame, [0, fps * 8], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });

  // Animated steam particles rising from cup
  const steam1Y = ((frame * 2.2) % 120);
  const steam1Opacity = interpolate(steam1Y, [0, 40, 100, 120], [0, 0.7, 0.5, 0]);

  const steam2Y = (((frame + 30) * 2.5) % 130);
  const steam2Opacity = interpolate(steam2Y, [0, 40, 110, 130], [0, 0.8, 0.4, 0]);

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        backgroundColor: "#F7F5F0",
        overflow: "hidden",
        transform: `scale(${zoom})`,
        transformOrigin: "55% 55%",
      }}
    >
      {/* 1. WARM INTERIOR WALL WITH SUBTLE METRO TILE (Z: 0) */}
      <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <pattern id="metroTiles" width="60" height="30" patternUnits="userSpaceOnUse">
            <rect width="60" height="30" fill="#EFECE6" stroke="#DFDBD0" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1920" height="750" fill="url(#metroTiles)" />
        {/* Warm shadow wash from hanging lights */}
        <ellipse cx="650" cy="180" rx="350" ry="180" fill="#FFE599" opacity="0.12" />
        <ellipse cx="1400" cy="180" rx="350" ry="180" fill="#FFE599" opacity="0.12" />
      </svg>

      {/* 2. CHALKBOARD MENU (Z: 1) */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 120,
          width: 380,
          height: 380,
          backgroundColor: "#2B2B2B",
          border: "10px solid #5A3825",
          borderRadius: 6,
          boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
          padding: 24,
          color: "#F7F5F0",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 3, borderBottom: "3px dashed #E07A5F", paddingBottom: 10 }}>
          TODAY'S BREWS
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}>
          <span>FLAT WHITE</span>
          <span style={{ color: "#E07A5F" }}>{coffeePrice}</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}>
          <span>POUR-OVER</span>
          <span style={{ color: "#E07A5F" }}>₹320</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}>
          <span>COLD BREW</span>
          <span style={{ color: "#E07A5F" }}>₹300</span>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700 }}>
          <span>SOURDOUGH TOAST</span>
          <span style={{ color: "#3B7A57" }}>₹450</span>
        </div>
      </div>

      {/* 3. BARISTA WORKING BEHIND THE COUNTER (Z: 2) */}
      <Character identity="barista" pose="pour_espresso" isTalking={false} scale={1.05} left={740} bottom={220} />


      {/* 4. MAIN POLISHED WOOD BAR COUNTER (Z: 3) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 340,
          backgroundColor: "#3A2E2B", // Rich dark oak counter
          borderTop: "14px solid #C86236", // Terracotta trim
          boxShadow: "0 -16px 50px rgba(0,0,0,0.18)",
        }}
      >
        {/* Wood grain highlight line */}
        <div style={{ width: "100%", height: 6, backgroundColor: "#E07A5F", opacity: 0.3 }} />
      </div>

      {/* 5. COMMERCIAL ESPRESSO MACHINE (LA MARZOCCO STYLE) (Z: 4) */}
      <div
        style={{
          position: "absolute",
          left: 520,
          bottom: 280,
          width: 320,
          height: 240,
        }}
      >
        <svg viewBox="0 0 320 240" width="100%" height="100%">
          {/* Main Chrome Body */}
          <rect x="20" y="30" width="280" height="180" rx="12" fill="#D3D7DC" stroke="#2B2B2B" strokeWidth="6" />
          {/* Front Brushed Metal Accent Panel */}
          <rect x="40" y="50" width="240" height="90" rx="6" fill="#C86236" stroke="#2B2B2B" strokeWidth="5" />
          {/* Dual Pressure Manometers */}
          <circle cx="80" cy="95" r="20" fill="#FFF" stroke="#2B2B2B" strokeWidth="4" />
          <circle cx="80" cy="95" r="3" fill="#2B2B2B" />
          <line x1="80" y1="95" x2="88" y2="85" stroke="#C0392B" strokeWidth="3" />

          <circle cx="140" cy="95" r="20" fill="#FFF" stroke="#2B2B2B" strokeWidth="4" />
          <circle cx="140" cy="95" r="3" fill="#2B2B2B" />
          <line x1="140" y1="95" x2="148" y2="85" stroke="#27AE60" strokeWidth="3" />

          {/* Group Heads */}
          <rect x="180" y="140" width="36" height="30" rx="3" fill="#4A4A4A" stroke="#2B2B2B" strokeWidth="4" />
          <rect x="235" y="140" width="36" height="30" rx="3" fill="#4A4A4A" stroke="#2B2B2B" strokeWidth="4" />

          {/* Steam Wand & Drip Tray */}
          <path d="M 50 140 Q 30 180 40 210" fill="none" stroke="#A6ACAF" strokeWidth="6" strokeLinecap="round" />
          <rect x="15" y="210" width="290" height="24" rx="4" fill="#7F8C8D" stroke="#2B2B2B" strokeWidth="4" />

          {/* Cup warming tray on top with mugs */}
          <ellipse cx="60" cy="24" rx="14" ry="6" fill="#F7F5F0" stroke="#2B2B2B" strokeWidth="3" />
          <ellipse cx="100" cy="24" rx="14" ry="6" fill="#F7F5F0" stroke="#2B2B2B" strokeWidth="3" />
          <ellipse cx="140" cy="24" rx="14" ry="6" fill="#F7F5F0" stroke="#2B2B2B" strokeWidth="3" />
        </svg>

        {/* Dynamic Steam Rising from Wand */}
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 60,
            transform: `translateY(-${steam1Y}px)`,
            opacity: steam1Opacity,
          }}
        >
          <svg width="40" height="60" viewBox="0 0 40 60">
            <path d="M 20 60 Q 5 40 25 20 Q 35 0 20 -20" fill="none" stroke="#FFF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 6. PASTRY DISPLAY DOME (Z: 4) */}
      <div
        style={{
          position: "absolute",
          left: 1150,
          bottom: 300,
          width: 220,
          height: 180,
        }}
      >
        <svg viewBox="0 0 220 180" width="100%" height="100%">
          {/* Glass Cloche Dome */}
          <path d="M 20 150 Q 20 20 110 20 Q 200 20 200 150 Z" fill="#E8F4F8" fillOpacity="0.45" stroke="#2B2B2B" strokeWidth="5" />
          {/* Glass Top Knob */}
          <circle cx="110" cy="14" r="10" fill="#E8F4F8" stroke="#2B2B2B" strokeWidth="4" />
          {/* Wooden Platter Base */}
          <ellipse cx="110" cy="155" rx="100" ry="16" fill="#8D6E63" stroke="#2B2B2B" strokeWidth="5" />
          {/* Golden Croissant Inside */}
          <path d="M 60 145 Q 110 115 160 145 Q 110 160 60 145 Z" fill="#D35400" stroke="#2B2B2B" strokeWidth="4" />
          <path d="M 80 140 Q 110 125 140 140" fill="none" stroke="#E67E22" strokeWidth="3" />
        </svg>
      </div>

      {/* 7. UPI QR CODE STANDEE ON COUNTER (Z: 5) */}
      <div
        style={{
          position: "absolute",
          left: 1420,
          bottom: 300,
          width: 110,
          height: 150,
          backgroundColor: "#FFF",
          border: "4px solid #2B2B2B",
          borderRadius: 8,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 8,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 900, color: "#1A5276", letterSpacing: 1 }}>BHARAT PE / UPI</div>
        {/* Fake QR Code Grid */}
        <div style={{ width: 80, height: 80, backgroundColor: "#2B2B2B", marginTop: 8, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: 6 }}>
          <div style={{ backgroundColor: "#FFF" }} />
          <div style={{ backgroundColor: "#2B2B2B" }} />
          <div style={{ backgroundColor: "#FFF" }} />
          <div style={{ backgroundColor: "#FFF" }} />
          <div style={{ backgroundColor: "#2B2B2B" }} />
          <div style={{ backgroundColor: "#FFF" }} />
          <div style={{ backgroundColor: "#2B2B2B" }} />
          <div style={{ backgroundColor: "#FFF" }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#27AE60", marginTop: 8 }}>SCAN &amp; PAY</div>
      </div>

      {/* 8. TOP HUD INFO CARD */}
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 64,
          backgroundColor: "#2B2B2B",
          color: "#F7F5F0",
          padding: "16px 32px",
          borderRadius: 8,
          border: "3px solid #E07A5F",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2 }}>{headline}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#E05A2B", marginTop: 4, letterSpacing: 1.5 }}>
          {subheadline}
        </div>
      </div>
    </div>
  );
};
