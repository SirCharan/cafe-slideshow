import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../Character";

export interface SceneStreetProps {
  headline?: string;
  subheadline?: string;
  themeColor?: string;
}

export const SceneStreet: React.FC<SceneStreetProps> = ({
  headline = "100 FEET ROAD, INDIRANAGAR",
  subheadline = "SUNDAY 11:00 AM · SPECIALTY COFFEE RUSH",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gentle camera push
  const cameraZoom = interpolate(frame, [0, fps * 8], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Parallax layers
  const treeSway = Math.sin((frame / fps) * 1.5) * 4;
  const pedestrianX = interpolate(frame, [0, fps * 8], [-100, 350], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        backgroundColor: "#F7F5F0",
        overflow: "hidden",
        transform: `scale(${cameraZoom})`,
        transformOrigin: "center center",
      }}
    >
      {/* 1. SKY & SUNBEAMS */}
      <svg width="1920" height="1080" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="60%" stopColor="#F7F5F0" />
            <stop offset="100%" stopColor="#EDEAE1" />
          </linearGradient>
          <linearGradient id="sunbeam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFE082" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#skyGrad)" />
        {/* Morning sunbeam polygons */}
        <polygon points="1200,0 1450,0 1920,800 1600,1080" fill="url(#sunbeam)" />
        <polygon points="900,0 1150,0 1550,1080 1300,1080" fill="url(#sunbeam)" opacity="0.6" />
      </svg>

      {/* 2. BACKGROUND CITY SILHOUETTES & POWERLINES (Z: 0) */}
      <svg width="1920" height="600" style={{ position: "absolute", top: 120, left: 0 }}>
        {/* Distant Bangalore roofs & water tanks */}
        <path
          d="M 0 450 L 150 450 L 150 380 L 260 380 L 260 450 L 450 450 L 450 340 L 580 340 L 580 450 L 800 450 L 800 390 L 920 390 L 920 450 L 1200 450 L 1200 360 L 1350 360 L 1350 450 L 1600 450 L 1600 370 L 1750 370 L 1750 450 L 1920 450"
          fill="none"
          stroke="#D6D1C4"
          strokeWidth="3"
        />
        {/* Iconic overhead powerlines */}
        <path d="M 0 220 Q 960 280 1920 230" fill="none" stroke="#C5BEAE" strokeWidth="2" />
        <path d="M 0 250 Q 960 310 1920 260" fill="none" stroke="#C5BEAE" strokeWidth="1.5" />
      </svg>

      {/* 3. BANGALORE RAIN TREE CANOPY (Z: 1) */}
      <g style={{ transform: `translateX(${treeSway}px)` }}>
        <svg width="1920" height="500" style={{ position: "absolute", top: -40, left: 0 }}>
          {/* Stylized organic foliage blobs */}
          <path
            d="M -80 120 Q 80 40 220 100 Q 380 30 520 110 Q 700 40 850 120 Q 920 220 800 280 Q 500 310 300 270 Q 50 300 -80 240 Z"
            fill="#3B6E47"
            opacity="0.85"
          />
          <path
            d="M 1200 80 Q 1400 20 1600 70 Q 1800 20 1980 90 Q 2040 220 1880 260 Q 1600 280 1400 250 Q 1200 260 1150 180 Z"
            fill="#2D5A38"
            opacity="0.9"
          />
        </svg>
      </g>

      {/* 4. CAFÉ STOREFRONT FACADE (Z: 2) */}
      <div
        style={{
          position: "absolute",
          left: 450,
          top: 260,
          width: 1020,
          height: 640,
          backgroundColor: "#EDEAE1",
          border: "8px solid #2B2B2B",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
        }}
      >
        {/* Café Signboard */}
        <div
          style={{
            position: "absolute",
            top: -65,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#2B2B2B",
            color: "#FFF",
            padding: "16px 56px",
            borderRadius: "6px",
            border: "4px solid #C86236",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: 4,
              color: "#F7F5F0",
            }}
          >
            ROAST &amp; BREW CO.
          </span>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#E07A5F",
              letterSpacing: 2,
              marginTop: 4,
            }}
          >
            SPECIALTY COFFEE ROASTERS
          </div>
        </div>

        {/* Large Floor-to-Ceiling Glass Window */}
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 50,
            width: 920,
            height: 480,
            backgroundColor: "#F4F7F6",
            border: "6px solid #2B2B2B",
            borderRadius: 6,
            overflow: "hidden",
            display: "flex",
          }}
        >
          {/* Glass reflection stripes */}
          <svg width="920" height="480" style={{ position: "absolute", top: 0, left: 0, opacity: 0.25 }}>
            <polygon points="100,0 220,0 80,480 -40,480" fill="#FFF" />
            <polygon points="380,0 520,0 340,480 200,480" fill="#FFF" />
          </svg>

          {/* Inside Café Silhouette Scene */}
          <Character identity="barista" pose="pour_espresso" scale={0.75} right={60} bottom={-10} />
          <Character identity="camper" pose="type_laptop" scale={0.7} left={80} bottom={-40} />
        </div>
      </div>

      {/* 5. STREET PAVEMENT & OUTDOOR SCENE (Z: 3) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 1920,
          height: 220,
          backgroundColor: "#D8D2C2",
          borderTop: "8px solid #2B2B2B",
        }}
      >
        {/* Pavement stone slab grid */}
        <svg width="1920" height="220" style={{ position: "absolute", top: 0, left: 0 }}>
          <line x1="0" y1="90" x2="1920" y2="90" stroke="#B8B09E" strokeWidth="4" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={i}
              x1={i * 150}
              y1="0"
              x2={i * 150 - 40}
              y2="220"
              stroke="#B8B09E"
              strokeWidth="3"
            />
          ))}
        </svg>

        {/* Founder Character walking on street / daydreaming */}
        <Character identity="founder" pose="point_phone" emotion="smile" scale={0.88} left={240} bottom={20} />

        {/* Secondary Walking Pedestrian with Parallax */}
        <Character identity="camper" pose="walk_cycle" scale={0.78} left={pedestrianX} bottom={10} style={{ opacity: 0.85 }} />
      </div>


      {/* 6. TOP HUD BANNER */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 64,
          backgroundColor: "#2B2B2B",
          color: "#F7F5F0",
          padding: "16px 28px",
          borderRadius: 8,
          border: "3px solid #E05A2B",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>{headline}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#E07A5F", marginTop: 4, letterSpacing: 1.5 }}>
          {subheadline}
        </div>
      </div>
    </div>
  );
};
