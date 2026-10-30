import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { KineticOverlay, KineticOverlayProps } from "./KineticOverlay";
import { PartTransitionCard } from "./PartTransitionCard";
import { ChapterBar } from "./ChapterBar";
import { ChapterHeader } from "./ChapterHeader";
import { SceneTransition } from "./SceneTransition";
import { SubtitlePill } from "./SubtitlePill";
import rawScenesData from "../../data/cultfit_scenes.json";

export interface SceneCultfitFranchiseEngineProps {
  muted?: boolean;
  captions?: boolean;
}

interface SceneLineDef {
  idx: number;
  text: string;
  pause_s: number;
  durationSec: number;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  highlights: string[];
}

interface CultfitSceneDef {
  id: string;
  name: string;
  part: string;
  isPartStart?: boolean;
  partTitle?: string;
  partSub?: string;
  env: string;
  characterSide: "left" | "right";
  durationSec: number;
  line0Dur: number;
  line1Dur: number;
  pause: number;
  lines: SceneLineDef[];
}

const scenesData = rawScenesData as unknown as CultfitSceneDef[];

export const SceneCultfitFranchiseEngine: React.FC<SceneCultfitFranchiseEngineProps> = ({
  muted = false,
  captions = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Compute exact frame ranges for each scene
  let currentAccumulatedFrame = 0;
  const sceneTimeline = scenesData.map((s) => {
    const startFrame = currentAccumulatedFrame;
    const durationFrames = Math.round(s.durationSec * fps);
    currentAccumulatedFrame += durationFrames;
    return {
      ...s,
      startFrame,
      durationFrames,
      endFrame: startFrame + durationFrames,
    };
  });

  // Active scene index
  const activeSceneIdx = sceneTimeline.findIndex(
    (s) => frame >= s.startFrame && frame < s.endFrame
  );
  const activeScene = activeSceneIdx !== -1 ? sceneTimeline[activeSceneIdx] : sceneTimeline[0];
  const sceneRelativeFrame = frame - activeScene.startFrame;

  // Active sentence inside scene
  const line0EndFrame = Math.round((activeScene.line0Dur + activeScene.lines[0].pause_s) * fps);
  const isLine1 = sceneRelativeFrame >= line0EndFrame && activeScene.lines.length > 1;
  const activeLine = isLine1 ? activeScene.lines[1] : activeScene.lines[0];

  // Continuous Camera Drift (1.00 -> 1.055 Ken Burns Easing)
  const cameraScale = interpolate(
    sceneRelativeFrame,
    [0, activeScene.durationFrames],
    [1.00, 1.055],
    { easing: Easing.bezier(0.25, 0.1, 0.25, 1.0), extrapolateRight: "clamp" }
  );

  // Mascot Breathing / Subtle Bounce
  const mascotBounce = Math.sin(frame / 6) * 4;

  // Kinetic overlay props
  const kineticProps: KineticOverlayProps = {
    badge: activeLine.badge,
    badgeColor: activeLine.badgeColor,
    title: activeLine.title,
    subtitle: activeLine.subtitle,
    align: activeScene.characterSide === "left" ? "right" : "left",
    anchorSide: activeScene.characterSide === "left" ? "right" : "left",
    offsetX: 100,
    bottomOffset: 340,
    width: 680,
    entrance: "slide",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0F19", overflow: "hidden" }}>
      {/* 1. VISUAL SCENE ENVIRONMENTS WITH CONTINUOUS CAMERA DRIFT */}
      {sceneTimeline.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
          name={scene.name}
        >
          <AbsoluteFill
            style={{
              transform: `scale(${cameraScale})`,
              transformOrigin: scene.characterSide === "left" ? "70% 50%" : "30% 50%",
            }}
          >
            {/* SCENE 1: THE NEON FITNESS TEMPLE */}
            {scene.env === "cult_neon_studio" && (
              <AbsoluteFill style={{ backgroundColor: "#090D16" }}>
                {/* Tech Gym Neon Grid Background */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(#1E293B 1px, transparent 1px), linear-gradient(90deg, #1E293B 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.4,
                  }}
                />
                {/* Neon Tube Light Rigs */}
                <div style={{ position: "absolute", top: 120, left: "15%", width: 700, height: 8, backgroundColor: "#06B6D4", boxShadow: "0 0 25px #06B6D4", borderRadius: 4 }} />
                <div style={{ position: "absolute", top: 150, left: "25%", width: 500, height: 8, backgroundColor: "#EC4899", boxShadow: "0 0 25px #EC4899", borderRadius: 4 }} />
                
                {/* Blueprint Hero Graphic */}
                <div style={{ position: "absolute", left: "22%", top: "18%", width: 750, height: 750 }}>
                  <Img
                    src={staticFile("thumbnails/cultfit_blueprint_thumb.png")}
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 16, border: "2px solid #334155" }}
                  />
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 2: GAMIFIED APP ECOSYSTEM */}
            {scene.env === "cult_gamified_app" && (
              <AbsoluteFill style={{ backgroundColor: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 780, border: "4px solid #38BDF8", borderRadius: 24, backgroundColor: "#1E293B", padding: 50, position: "relative", boxShadow: "0 0 40px rgba(56, 189, 248, 0.25)" }}>
                  <div style={{ color: "#38BDF8", fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>CULT.FIT MEMBER APP · 7:00 PM BATCH</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
                    <div style={{ width: 360, padding: 30, backgroundColor: "#0F172A", borderRadius: 16, border: "2px solid #22C55E" }}>
                      <div style={{ fontSize: 20, color: "#4ADE80", fontWeight: 900 }}>SLOT STATUS</div>
                      <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>40 / 40</div>
                      <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6 }}>100% Booked in 4 Secs</div>
                    </div>
                    <div style={{ width: 360, padding: 30, backgroundColor: "#0F172A", borderRadius: 16, border: "2px solid #3B82F6" }}>
                      <div style={{ fontSize: 20, color: "#60A5FA", fontWeight: 900 }}>AVERAGE ATTENDANCE</div>
                      <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>450</div>
                      <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6 }}>Daily Check-in Volume</div>
                    </div>
                    <div style={{ width: 360, padding: 30, backgroundColor: "#0F172A", borderRadius: 16, border: "2px solid #F59E0B" }}>
                      <div style={{ fontSize: 20, color: "#FBBF24", fontWeight: 900 }}>FRANCHISE PROMISE</div>
                      <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹8.1L</div>
                      <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6 }}>Monthly Gross Inflow</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 60, padding: 24, backgroundColor: "rgba(34, 197, 94, 0.15)", borderRadius: 16, border: "2px solid #22C55E", textAlign: "center" }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: "#4ADE80" }}>THE SEDUCTIVE PROJECTION:</span>
                    <span style={{ fontSize: 28, color: "#E2E8F0", marginLeft: 20 }}>450 Members × ₹1,800/mo = ₹8,10,000 / mo Inflow</span>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 3: REVENUE DASHBOARD */}
            {scene.env === "cult_revenue_dashboard" && (
              <AbsoluteFill style={{ backgroundColor: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1350, height: 780, border: "6px solid #4B5563", borderRadius: 24, backgroundColor: "#1F2937", padding: 60, position: "relative" }}>
                  <div style={{ color: "#F59E0B", fontSize: 36, fontWeight: 900, letterSpacing: 2 }}>UNIT ECONOMICS: TOP-LINE REVENUE ARITHMETIC</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 80 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 68, fontWeight: 900, color: "#60A5FA" }}>4,500</div>
                      <div style={{ fontSize: 24, color: "#9CA3AF", marginTop: 12 }}>SQUARE FEET FACILITY</div>
                    </div>
                    <div style={{ fontSize: 60, color: "#9CA3AF", alignSelf: "center" }}>×</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 68, fontWeight: 900, color: "#FBBF24" }}>450</div>
                      <div style={{ fontSize: 24, color: "#9CA3AF", marginTop: 12 }}>ACTIVE SUBSCRIBERS</div>
                    </div>
                    <div style={{ fontSize: 60, color: "#9CA3AF", alignSelf: "center" }}>×</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 68, fontWeight: 900, color: "#34D399" }}>₹1,800</div>
                      <div style={{ fontSize: 24, color: "#9CA3AF", marginTop: 12 }}>AVG MONTHLY REALIZATION</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 80, padding: 30, backgroundColor: "rgba(16, 185, 129, 0.2)", borderRadius: 16, border: "2px solid #10B981", textAlign: "center" }}>
                    <span style={{ fontSize: 44, fontWeight: 900, color: "#34D399" }}>₹8,10,000 GROSS MONTHLY CASH</span>
                    <div style={{ fontSize: 22, color: "#CBD5E1", marginTop: 8 }}>Automated recurring UPI payments hitting the account like clockwork</div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 4: UPFRONT FITOUT DRAIN */}
            {scene.env === "cult_construction_site" && (
              <AbsoluteFill style={{ backgroundColor: "#18181B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 750, border: "4px solid #DC2626", borderRadius: 20, backgroundColor: "#27272A", padding: 50, position: "relative" }}>
                  <div style={{ color: "#EF4444", fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>DAY ZERO FITOUT REQUIREMENTS (MANDATORY CUREFIT SPECS)</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
                    <div style={{ width: 360, padding: 32, backgroundColor: "#18181B", borderRadius: 16, border: "3px solid #DC2626", transform: "rotate(-2deg)" }}>
                      <div style={{ fontSize: 20, color: "#EF4444", fontWeight: 900 }}>FRANCHISE FEE</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹20,00,000</div>
                      <div style={{ fontSize: 18, color: "#A1A1AA", marginTop: 6 }}>100% Non-Refundable</div>
                    </div>
                    <div style={{ width: 360, padding: 32, backgroundColor: "#18181B", borderRadius: 16, border: "3px solid #DC2626", transform: "rotate(1deg)" }}>
                      <div style={{ fontSize: 20, color: "#EF4444", fontWeight: 900 }}>ACOUSTIC RUBBER & RIGS</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹45,00,000</div>
                      <div style={{ fontSize: 18, color: "#A1A1AA", marginTop: 6 }}>Double-Layer Shock Absorber</div>
                    </div>
                    <div style={{ width: 360, padding: 32, backgroundColor: "#18181B", borderRadius: 16, border: "3px solid #DC2626", transform: "rotate(-1deg)" }}>
                      <div style={{ fontSize: 20, color: "#EF4444", fontWeight: 900 }}>SHOWERS & NEON RIGS</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹40,00,000</div>
                      <div style={{ fontSize: 18, color: "#A1A1AA", marginTop: 6 }}>High-Lumen Club Lighting</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 70, textAlign: "center" }}>
                    <div style={{ display: "inline-block", padding: "16px 36px", backgroundColor: "#DC2626", color: "#FFFFFF", fontWeight: 900, fontSize: 32, borderRadius: 12 }}>
                      TOTAL FITOUT SUNK CAPITAL: ₹1,05,00,000
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 5: HARDWARE & EQUIPMENT CAPEX */}
            {scene.env === "cult_equipment_rig" && (
              <AbsoluteFill style={{ backgroundColor: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1350, height: 750, border: "4px solid #8B5CF6", borderRadius: 20, backgroundColor: "#1E293B", padding: 50, position: "relative" }}>
                  <div style={{ color: "#A78BFA", fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>MANDATORY CALIBRATED EQUIPMENT INVENTORY</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 60 }}>
                    <div style={{ width: 380, padding: 32, backgroundColor: "#0F172A", borderRadius: 16, border: "2px solid #8B5CF6" }}>
                      <div style={{ fontSize: 20, color: "#C4B5FD", fontWeight: 900 }}>CARDIO ARSENAL</div>
                      <div style={{ fontSize: 46, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹28,00,000</div>
                      <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6 }}>Concept-2 Rowers + Air Bikes</div>
                    </div>
                    <div style={{ width: 380, padding: 32, backgroundColor: "#0F172A", borderRadius: 16, border: "2px solid #8B5CF6" }}>
                      <div style={{ fontSize: 20, color: "#C4B5FD", fontWeight: 900 }}>RIGS & DUMBBELLS</div>
                      <div style={{ fontSize: 46, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹27,00,000</div>
                      <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6 }}>Custom Pull-up Rig + Urethane</div>
                    </div>
                    <div style={{ width: 380, padding: 32, backgroundColor: "#0F172A", borderRadius: 16, border: "2px solid #EF4444" }}>
                      <div style={{ fontSize: 20, color: "#F87171", fontWeight: 900 }}>WORKING CAPITAL + DEP</div>
                      <div style={{ fontSize: 46, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹60,00,000</div>
                      <div style={{ fontSize: 18, color: "#94A3B8", marginTop: 6 }}>Pre-op Marketing + Deposits</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 70, textAlign: "center" }}>
                    <div style={{ display: "inline-block", padding: "18px 48px", backgroundColor: "#EF4444", color: "#FFFFFF", fontWeight: 900, fontSize: 36, borderRadius: 12, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)" }}>
                      TOTAL DAY-ONE INVESTMENT: ₹2,20,00,000
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 6: HIGH STREET LEASE TRAP */}
            {scene.env === "cult_commercial_lease" && (
              <AbsoluteFill style={{ backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1000, height: 720, backgroundColor: "#FFFBEB", border: "4px solid #B45309", borderRadius: 12, padding: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#92400E", textAlign: "center", borderBottom: "3px solid #D97706", paddingBottom: 16 }}>COMMERCIAL HIGH-STREET LEASE · INDIRANAGAR / HSR</div>
                  <div style={{ marginTop: 40, fontSize: 30, lineHeight: "52px", color: "#1F2937", fontFamily: "monospace" }}>
                    <div>1. FLOOR PLATE: <strong>4,500 SQ FT (HIGH STREET)</strong></div>
                    <div>2. RENT PER SQ FT: <strong>₹90 / SQ FT / MO</strong></div>
                    <div>3. MONTHLY RENT: <strong style={{ color: "#DC2626" }}>₹4,05,000 (FIXED)</strong></div>
                    <div>4. SECURITY DEPOSIT: <strong style={{ color: "#DC2626" }}>₹40,50,000 (10 MONTHS)</strong></div>
                    <div>5. ANNUAL ESCALATION: <strong>9% COMPOUNDED</strong></div>
                  </div>
                  <div style={{ marginTop: 50, textAlign: "right" }}>
                    <div style={{ display: "inline-block", border: "4px solid #DC2626", color: "#DC2626", padding: "12px 24px", fontWeight: 900, fontSize: 28, transform: "rotate(-6deg)" }}>
                      LANDLORD DEMANDS ON 1ST OF EVERY MONTH
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 7: ELECTRICITY SHOCK */}
            {scene.env === "cult_hvac_burn" && (
              <AbsoluteFill style={{ backgroundColor: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 750, backgroundColor: "#0C4A6E", borderRadius: 20, border: "4px solid #38BDF8", padding: 50, position: "relative" }}>
                  <div style={{ color: "#38BDF8", fontSize: 32, fontWeight: 900 }}>50-TON COMMERCIAL HVAC COOLING BURNOUT</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 70 }}>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#082F49", borderRadius: 16, border: "2px solid #0284C7" }}>
                      <div style={{ fontSize: 24, color: "#7DD3FC", fontWeight: 900 }}>OPERATING SPECS</div>
                      <div style={{ fontSize: 32, color: "#FFFFFF", marginTop: 16 }}>16 Hours Daily Operation</div>
                      <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 8 }}>Cooling 40 Sweaty Techies per Batch</div>
                      <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 8 }}>Karnataka Non-Domestic Tariff</div>
                    </div>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#082F49", borderRadius: 16, border: "3px solid #EF4444" }}>
                      <div style={{ fontSize: 24, color: "#F87171", fontWeight: 900 }}>MONTHLY POWER BILL</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹1,40,000</div>
                      <div style={{ fontSize: 24, color: "#FCA5A5", marginTop: 12 }}>Eats 17.2% of Total Inflow!</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 8: TRAINER TALENT WAR */}
            {scene.env === "cult_trainer_stage" && (
              <AbsoluteFill style={{ backgroundColor: "#1E1B4B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 750, backgroundColor: "#312E81", borderRadius: 20, border: "4px solid #A78BFA", padding: 50, position: "relative" }}>
                  <div style={{ color: "#C4B5FD", fontSize: 32, fontWeight: 900 }}>TRAINER PAYROLL & ATTRITION FRAGILITY</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 70 }}>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#1E1B4B", borderRadius: 16, border: "2px solid #818CF8" }}>
                      <div style={{ fontSize: 24, color: "#A5B4FC", fontWeight: 900 }}>MONTHLY COACH PAYROLL</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹2,50,000</div>
                      <div style={{ fontSize: 22, color: "#C7D2FE", marginTop: 12 }}>4 Cult Certified Trainers + 2 Support Coaches</div>
                    </div>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#1E1B4B", borderRadius: 16, border: "3px solid #EF4444" }}>
                      <div style={{ fontSize: 24, color: "#F87171", fontWeight: 900 }}>THE ATTRITION CLIFF</div>
                      <div style={{ fontSize: 34, fontWeight: 900, color: "#FFFFFF", marginTop: 12 }}>Lead Coach Quits</div>
                      <div style={{ fontSize: 26, color: "#FCA5A5", marginTop: 12 }}>20 Members Leave with the Coach for Private Sessions</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 9: THE BRAND SQUEEZE (CUREFIT ROYALTY) */}
            {scene.env === "cult_platform_tax" && (
              <AbsoluteFill style={{ backgroundColor: "#2E1065", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 750, backgroundColor: "#3B0764", borderRadius: 20, border: "4px solid #C084FC", padding: 50, position: "relative" }}>
                  <div style={{ color: "#E9D5FF", fontSize: 32, fontWeight: 900 }}>CUREFIT HQ PLATFORM ROYALTY & PROMO DILUTION</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 70 }}>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#2E1065", borderRadius: 16, border: "3px solid #A855F7" }}>
                      <div style={{ fontSize: 24, color: "#D8B4FE", fontWeight: 900 }}>TOP-LINE ROYALTY</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>12.0%</div>
                      <div style={{ fontSize: 24, color: "#E9D5FF", marginTop: 12 }}>₹97,200 deducted before you touch a rupee!</div>
                    </div>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#2E1065", borderRadius: 16, border: "3px solid #EF4444" }}>
                      <div style={{ fontSize: 24, color: "#F87171", fontWeight: 900 }}>PROMOTIONAL SALES</div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#FFFFFF", marginTop: 12 }}>Cult Pass Elite Heavy Discounts</div>
                      <div style={{ fontSize: 22, color: "#FCA5A5", marginTop: 12 }}>Per-session payout shrinks, but rent remains unchanged</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 10: THE ANNUAL CHURN GRAVEYARD */}
            {scene.env === "cult_churn_graveyard" && (
              <AbsoluteFill style={{ backgroundColor: "#18181B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 750, backgroundColor: "#27272A", borderRadius: 20, border: "4px solid #EF4444", padding: 50, position: "relative" }}>
                  <div style={{ color: "#EF4444", fontSize: 32, fontWeight: 900 }}>THE DIRTY SECRET: THE APRIL RESOLUTION CHURN</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 70 }}>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#18181B", borderRadius: 16, border: "3px solid #22C55E" }}>
                      <div style={{ fontSize: 24, color: "#4ADE80", fontWeight: 900 }}>JANUARY NEW YEAR RESOLUTION</div>
                      <div style={{ fontSize: 60, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>450 ACTIVE</div>
                      <div style={{ fontSize: 22, color: "#86EFAC", marginTop: 12 }}>Centers overflowing, high app utilization</div>
                    </div>
                    <div style={{ width: 550, padding: 36, backgroundColor: "#18181B", borderRadius: 16, border: "3px solid #DC2626" }}>
                      <div style={{ fontSize: 24, color: "#F87171", fontWeight: 900 }}>APRIL GHOST TOWN</div>
                      <div style={{ fontSize: 60, fontWeight: 900, color: "#EF4444", marginTop: 8 }}>60% CHURN</div>
                      <div style={{ fontSize: 22, color: "#FCA5A5", marginTop: 12 }}>Curefit algorithm deprioritizes low-utilization centers</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 11: MONTHLY FORENSIC P&L */}
            {scene.env === "cult_pl_ledger" && (
              <AbsoluteFill style={{ backgroundColor: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1200, height: 760, backgroundColor: "#1F2937", border: "4px solid #F59E0B", borderRadius: 20, padding: 48, position: "relative" }}>
                  <div style={{ color: "#F59E0B", fontSize: 28, fontWeight: 900 }}>FORENSIC MONTHLY P&L (4,500 SQ FT CULT CENTER)</div>
                  <div style={{ marginTop: 32, fontSize: 26, lineHeight: "48px", color: "#F3F4F6", fontFamily: "monospace" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>GROSS MONTHLY SUBSCRIPTIONS:</span><strong style={{ color: "#34D399" }}>+ ₹8,10,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>- HIGH STREET LEASE RENT:</span><strong style={{ color: "#EF4444" }}>- ₹4,05,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>- TRAINER & COACH PAYROLL:</span><strong style={{ color: "#EF4444" }}>- ₹2,50,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>- 50-TON HVAC BESCOM POWER:</span><strong style={{ color: "#EF4444" }}>- ₹1,40,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>- CUREFIT 12% PLATFORM ROYALTY:</span><strong style={{ color: "#EF4444" }}>- ₹97,200</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "3px solid #4B5563", paddingTop: 16, marginTop: 12 }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: "#FCD34D" }}>TRUE MONTHLY NET PROFIT:</span>
                      <strong style={{ fontSize: 36, color: "#34D399" }}>+ ₹1,35,000</strong>
                    </div>
                  </div>
                  <div style={{ marginTop: 36, textAlign: "center" }}>
                    <div style={{ display: "inline-block", padding: "12px 30px", backgroundColor: "#DC2626", color: "#FFFFFF", fontWeight: 900, fontSize: 26, borderRadius: 8 }}>
                      TRUE NET MARGIN: ONLY 16.6% (MANAGING 24/7 DRAMA)
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 12: THE FINAL VERDICT */}
            {scene.env === "cult_verdict_podium" && (
              <AbsoluteFill style={{ backgroundColor: "#090D16", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1300, height: 750, border: "6px solid #DC2626", borderRadius: 24, backgroundColor: "#0F172A", padding: 50, position: "relative" }}>
                  <div style={{ color: "#EF4444", fontSize: 34, fontWeight: 900, textAlign: "center" }}>THE FINAL FINANCIAL VERDICT</div>
                  <div style={{ display: "flex", justifyContent: "space-around", marginTop: 60 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 26, color: "#94A3B8" }}>UPFRONT CAPITAL SUNK</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#EF4444", marginTop: 8 }}>₹2.20 CRORES</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 26, color: "#94A3B8" }}>MONTHLY NET CASH</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#34D399", marginTop: 8 }}>₹1.35 LAKHS</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 26, color: "#94A3B8" }}>CAPITAL PAYBACK</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#F59E0B", marginTop: 8 }}>54 MONTHS</div>
                      <div style={{ fontSize: 20, color: "#FCD34D", marginTop: 4 }}>4.5 YEARS TO RECOVER DAY ONE</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 70, padding: 30, backgroundColor: "rgba(220, 38, 38, 0.2)", borderRadius: 16, border: "2px solid #DC2626", textAlign: "center" }}>
                    <div style={{ fontSize: 34, fontWeight: 900, color: "#EF4444" }}>
                      YOU ARE NOT DISRUPTING FITNESS.
                    </div>
                    <div style={{ fontSize: 26, color: "#E2E8F0", marginTop: 8 }}>
                      You are financing Curefit's real estate footprint with your own life savings.
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* 2. AUDIO STRETCHES PER SCENE */}
      {!muted &&
        sceneTimeline.map((scene) => (
          <Sequence
            key={`audio_${scene.id}`}
            from={scene.startFrame}
            durationInFrames={scene.durationFrames}
          >
            {scene.lines.map((l, lIdx) => {
              const lineStartFrame =
                lIdx === 0
                  ? 0
                  : Math.round((scene.line0Dur + scene.lines[0].pause_s) * fps);
              return (
                <Sequence
                  key={`line_${scene.id}_${lIdx}`}
                  from={lineStartFrame}
                  durationInFrames={Math.round(l.durationSec * fps)}
                >
                  <Audio src={staticFile(`audio/cultfit/${scene.id}_s${lIdx}.wav`)} />
                </Sequence>
              );
            })}
          </Sequence>
        ))}

      {/* 3. ANURAG ANALYST MASCOT CHARACTER */}
      <div
        style={{
          position: "absolute",
          bottom: -40 + mascotBounce,
          left: activeScene.characterSide === "left" ? 60 : undefined,
          right: activeScene.characterSide === "right" ? 60 : undefined,
          width: 380,
          height: 520,
          zIndex: 40,
          pointerEvents: "none",
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
        }}
      >
        <Img
          src={staticFile("characters/anurag_mascot.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 24,
            border: "3px solid rgba(255, 255, 255, 0.2)",
          }}
        />
      </div>

      {/* 4. CHAPTER BAR (BOTTOM PROGRESS TRACK) */}
      <ChapterBar
        currentSceneId={activeScene.id}
        totalScenes={sceneTimeline.length}
        progressPercent={(frame / (sceneTimeline[sceneTimeline.length - 1].endFrame || 1)) * 100}
      />

      {/* 5. CHAPTER HEADER (TOP BRAND STRIP) */}
      <ChapterHeader
        chapterIndex={activeSceneIdx >= 0 ? activeSceneIdx : 0}
        totalChapters={scenesData.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />

      {/* 6. KINETIC OVERLAY CARD */}
      <KineticOverlay {...kineticProps} />

      {/* 7. PART TRANSITION SPLASH (ON PART CHANGE) */}
      {activeScene.isPartStart && sceneRelativeFrame < 45 && (
        <PartTransitionCard
          partTitle={activeScene.partTitle || activeScene.part}
          subtitle={activeScene.partSub || ""}
        />
      )}

      {/* 8. SUBTITLE PILL */}
      {captions && (
        <SubtitlePill
          text={activeLine.text}
          highlights={activeLine.highlights}
        />
      )}

      {/* 9. SCENE TRANSITION FLASH */}
      <SceneTransition />
    </AbsoluteFill>
  );
};
