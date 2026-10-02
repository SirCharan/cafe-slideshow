import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterFounderHouse, FHCharacterIdentity, FHCharacterPose, FHCharacterEmotion } from "../../CharacterFounderHouse";

export interface SceneLandlordOfficeProps {
  headline?: string;
  subheadline?: string;
  characterIdentity?: FHCharacterIdentity;
  characterPose?: FHCharacterPose;
  characterEmotion?: FHCharacterEmotion;
  characterSide?: "left" | "right";
  isTalking?: boolean;
}

export const SceneLandlordOffice: React.FC<SceneLandlordOfficeProps> = ({
  headline = "THE HSR LANDLORD CARTEL",
  subheadline = "₹2,60,000 / MONTH · ₹25L LOCKED DEPOSIT",
  characterIdentity = "landlord_uncle",
  characterPose = "holding_davara",
  characterEmotion = "smug",
  characterSide = "right",
  isTalking = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden", backgroundColor: "#1C140D" }}>
      {/* 1. TEAK WALLS & RICH WOODEN INTERIOR */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 700,
          background: "linear-gradient(180deg, #2D1E12 0%, #3D2919 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          width: 1920,
          height: 380,
          background: "linear-gradient(180deg, #4A3320 0%, #291A0E 100%)",
        }}
      />

      {/* 2. VECTOR ENVIRONMENT (SVG) */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {/* Ornate Gold Trim on Wall */}
        <line x1="0" y1="120" x2="1920" y2="120" stroke="#D97706" strokeWidth="4" opacity="0.6" />
        <line x1="0" y1="700" x2="1920" y2="700" stroke="#D97706" strokeWidth="6" opacity="0.8" />

        {/* Framed Karnataka Property Title Deed on Left Wall */}
        <g transform="translate(180, 160)">
          <rect x="0" y="0" width="280" height="360" rx="8" fill="#FDFBF7" stroke="#B45309" strokeWidth="12" />
          <rect x="15" y="15" width="250" height="330" fill="none" stroke="#D97706" strokeWidth="2" />
          <text x="140" y="55" textAnchor="middle" fill="#78350F" fontSize="14" fontWeight="bold">
            GOVT OF KARNATAKA
          </text>
          <text x="140" y="80" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">
            KHATA CERTIFICATE 'A'
          </text>
          <line x1="40" y1="100" x2="240" y2="100" stroke="#78350F" strokeWidth="2" />
          <text x="140" y="130" textAnchor="middle" fill="#1E293B" fontSize="11">
            PLOT: HSR LAYOUT SEC 4
          </text>
          <text x="140" y="160" textAnchor="middle" fill="#B45309" fontSize="16" fontWeight="900">
            VALUE: ₹8.5 CRORE
          </text>
          <text x="140" y="210" textAnchor="middle" fill="#047857" fontSize="13" fontWeight="bold">
            0% COUNTERPARTY RISK
          </text>
          {/* Stamped Red Seal */}
          <circle cx="140" cy="275" r="38" fill="none" stroke="#DC2626" strokeWidth="4" />
          <text x="140" y="280" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">
            REGISTERED
          </text>
        </g>

        {/* HEAVY TEAK DESK (Center / Right) */}
        <g transform="translate(680, 520)">
          <rect x="0" y="0" width="1020" height="260" rx="8" fill="#451A03" stroke="#290E02" strokeWidth="8" />
          <rect x="0" y="0" width="1020" height="24" fill="#78350F" />

          {/* Stamped Master Lease Contract Paper */}
          <g transform="translate(120, -60)">
            <rect x="0" y="0" width="240" height="140" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <text x="20" y="30" fill="#0F172A" fontSize="13" fontWeight="bold">
              MASTER LEASE DEED
            </text>
            <text x="20" y="55" fill="#EF4444" fontSize="15" fontWeight="900">
              RENT: ₹2,60,000 / MO
            </text>
            <text x="20" y="80" fill="#D97706" fontSize="12" fontWeight="bold">
              SECURITY DEPOSIT: ₹25,00,000
            </text>
            <text x="20" y="105" fill="#64748B" fontSize="10">
              5% MANDATORY ANNUAL HIKE
            </text>
            <rect x="150" y="70" width="70" height="50" fill="none" stroke="#DC2626" strokeWidth="3" rx="4" />
            <text x="185" y="100" textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">
              SIGNED
            </text>
          </g>

          {/* Locked Iron Safe in corner */}
          <g transform="translate(760, -180)">
            <rect x="0" y="0" width="200" height="240" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
            <circle cx="100" cy="120" r="45" fill="#334155" stroke="#94A3B8" strokeWidth="5" />
            <circle cx="100" cy="120" r="16" fill="#F59E0B" />
            <text x="100" y="210" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="bold">
              ₹25L AT 0% INTEREST
            </text>
          </g>
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
          backgroundColor: "rgba(30, 20, 10, 0.94)",
          padding: "12px 36px",
          borderRadius: 16,
          border: "2px solid #F59E0B",
          boxShadow: "0 12px 36px rgba(0,0,0,0.6)",
          zIndex: 20,
        }}
      >
        <span style={{ color: "#F59E0B", fontSize: 14, fontWeight: 800, letterSpacing: 2 }}>{headline}</span>
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
        right={characterSide === "right" ? 220 : undefined}
        bottom={100}
      />
    </div>
  );
};
