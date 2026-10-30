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
import rawScenesData from "../../data/cafe_v2_scenes.json";

export interface SceneBangaloreCafeV2EngineProps {
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

interface CafeSceneDef {
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

const scenesData = rawScenesData as unknown as CafeSceneDef[];

export const SceneBangaloreCafeV2Engine: React.FC<SceneBangaloreCafeV2EngineProps> = ({
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

  // Continuous Camera Drift (1.00 -> 1.06 Ken Burns Easing)
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
    width: 640,
    entrance: "slide",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#FAF8F5", overflow: "hidden" }}>
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
            {/* SCENE 1: INDIRANAGAR STREET & CAFE BLUEPRINT CUTAWAY */}
            {scene.env === "indiranagar_street" && (
              <AbsoluteFill style={{ backgroundColor: "#FDFBF7" }}>
                {/* Graph paper grid */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(#E5DFD5 1px, transparent 1px), linear-gradient(90deg, #E5DFD5 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    opacity: 0.6,
                  }}
                />
                {/* Blueprint Hero Graphic */}
                <div style={{ position: "absolute", left: "20%", top: "18%", width: 750, height: 750 }}>
                  <Img
                    src={staticFile("thumbnails/ep01_blueprint_cafe.png")}
                    style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 16 }}
                  />
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 2: ARITHMETIC DREAM CHALKBOARD */}
            {scene.env === "arithmetic_dream" && (
              <AbsoluteFill style={{ backgroundColor: "#182234", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 1400, height: 800, border: "8px solid #94A3B8", borderRadius: 24, backgroundColor: "#0F172A", padding: 60, position: "relative" }}>
                  <div style={{ color: "#38BDF8", fontSize: 36, fontWeight: 900, letterSpacing: 2 }}>THE SPECIALTY ARITHMETIC PROJECTION</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 80 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 72, fontWeight: 900, color: "#FCD34D" }}>₹60</div>
                      <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 12 }}>ETHIOPIAN ROAST BEANS</div>
                    </div>
                    <div style={{ fontSize: 60, color: "#64748B", alignSelf: "center" }}>+</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 72, fontWeight: 900, color: "#FCD34D" }}>₹30</div>
                      <div style={{ fontSize: 24, color: "#94A3B8", marginTop: 12 }}>OAT MILK / PACKAGING</div>
                    </div>
                    <div style={{ fontSize: 60, color: "#64748B", alignSelf: "center" }}>=</div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 72, fontWeight: 900, color: "#10B981" }}>₹240</div>
                      <div style={{ fontSize: 24, color: "#34D399", marginTop: 12 }}>RETAIL CUP SALE</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 90, padding: 30, backgroundColor: "rgba(16, 185, 129, 0.15)", borderRadius: 16, border: "2px solid #10B981", textAlign: "center" }}>
                    <span style={{ fontSize: 44, fontWeight: 900, color: "#34D399" }}>75.0% GROSS MARGIN</span>
                    <span style={{ fontSize: 28, color: "#E2E8F0", marginLeft: 24 }}>| 150 Cups/Day = ₹3,00,000 / mo Cashflow</span>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 3: LA MARZOCCO TERRAZZO BAR */}
            {scene.env === "la_marzocco_counter" && (
              <AbsoluteFill style={{ backgroundColor: "#F8FAFC" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", opacity: 0.6 }} />
                {/* Terrazzo Counter Bar */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 380, backgroundColor: "#E2E8F0", borderTop: "8px solid #94A3B8" }} />
                {/* Sunk Cost Slam Cards */}
                <div style={{ position: "absolute", left: 300, top: 220, display: "flex", gap: 50 }}>
                  <div style={{ width: 360, padding: 32, backgroundColor: "#1E293B", borderRadius: 20, border: "4px solid #DC2626", transform: "rotate(-3deg)" }}>
                    <div style={{ fontSize: 20, color: "#EF4444", fontWeight: 900 }}>EQUIPMENT CAPEX</div>
                    <div style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹12,00,000</div>
                    <div style={{ fontSize: 20, color: "#94A3B8", marginTop: 6 }}>La Marzocco Linea PB</div>
                  </div>
                  <div style={{ width: 360, padding: 32, backgroundColor: "#1E293B", borderRadius: 20, border: "4px solid #DC2626", transform: "rotate(2deg)" }}>
                    <div style={{ fontSize: 20, color: "#EF4444", fontWeight: 900 }}>INTERIOR FITOUT</div>
                    <div style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>₹85,00,000</div>
                    <div style={{ fontSize: 20, color: "#94A3B8", marginTop: 6 }}>Microcement + Acoustics</div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 4: 100-FOOT ROAD LANDLORD LEASE */}
            {scene.env === "landlord_lease" && (
              <AbsoluteFill style={{ backgroundColor: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 900, height: 700, backgroundColor: "#FFFBEB", border: "4px solid #B45309", borderRadius: 12, padding: 50, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#92400E", textAlign: "center", borderBottom: "3px solid #D97706", paddingBottom: 16 }}>COMMERCIAL LEASE AGREEMENT · INDIRANAGAR</div>
                  <div style={{ marginTop: 40, fontSize: 32, lineHeight: "54px", color: "#1F2937", fontFamily: "monospace" }}>
                    <div>1. MONTHLY BASE RENT: <strong style={{ color: "#DC2626" }}>₹4,50,000</strong></div>
                    <div>2. SECURITY DEPOSIT: <strong style={{ color: "#DC2626" }}>₹45,00,000 (10 Months)</strong></div>
                    <div>3. ANNUAL ESCALATION: <strong>8% COMPOUNDED</strong></div>
                    <div>4. NOTICE PERIOD: <strong>6 MONTHS MANDATORY</strong></div>
                  </div>
                  <div style={{ marginTop: 60, textAlign: "right" }}>
                    <div style={{ display: "inline-block", border: "4px solid #DC2626", color: "#DC2626", padding: "12px 24px", fontWeight: 900, fontSize: 28, transform: "rotate(-8deg)" }}>
                      GUARANTEED TO LANDLORD
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 5: THE LAPTOP SQUATTER PARADOX */}
            {scene.env === "laptop_squatters" && (
              <AbsoluteFill style={{ backgroundColor: "#0F172A" }}>
                <div style={{ position: "absolute", left: 160, top: 180, width: 900, height: 550, backgroundColor: "#1E293B", borderRadius: 24, padding: 40, border: "2px solid #334155" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#F59E0B" }}>TABLE 4 · TURNOVER ANALYSIS</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
                    <div>
                      <div style={{ fontSize: 20, color: "#94A3B8" }}>OCCUPANCY DURATION</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#EF4444" }}>5.8 HOURS</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, color: "#94A3B8" }}>REVENUE GENERATED</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#FCD34D" }}>₹220</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 20, color: "#94A3B8" }}>REVENUE / HOUR</div>
                      <div style={{ fontSize: 64, fontWeight: 900, color: "#EF4444" }}>₹37.90</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 50, padding: 24, backgroundColor: "rgba(239, 68, 68, 0.15)", borderRadius: 16, border: "2px solid #DC2626", color: "#FCA5A5", fontSize: 24 }}>
                    ⚠️ Power consumed by 2 MacBook Pro 96W chargers exceeded coffee profit.
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 6: CONVEYOR BELT OF SPOILAGE INTO DUMPSTER */}
            {scene.env === "conveyor_dumpster" && (
              <AbsoluteFill style={{ backgroundColor: "#1C1917" }}>
                <div style={{ position: "absolute", left: 160, top: 220, width: 1100, height: 500 }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#EF4444" }}>THE 24-HOUR PERISHABLE CONVEYOR BELT</div>
                  {/* Conveyor track */}
                  <div style={{ marginTop: 40, height: 120, backgroundColor: "#292524", border: "4px solid #78716C", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                    <div style={{ fontSize: 28, color: "#FDE047" }}>🥐 Almond Croissant</div>
                    <div style={{ fontSize: 28, color: "#FDE047" }}>🥪 Sourdough Melt</div>
                    <div style={{ fontSize: 28, color: "#FDE047" }}>🥛 Artisanal Oat Milk</div>
                    <div style={{ fontSize: 36, color: "#EF4444" }}>➔ ➔ ➔</div>
                  </div>
                  {/* Dumpster Target */}
                  <div style={{ marginTop: 40, width: 500, padding: 24, backgroundColor: "#14532D", border: "4px solid #22C55E", borderRadius: 16, color: "#86EFAC", textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 900 }}>GREEN COMPOST DUMPSTER</div>
                    <div style={{ fontSize: 44, fontWeight: 900, color: "#FFFFFF", marginTop: 8 }}>-₹30,000 / MONTH</div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 7: BESCOM & GENSET SURCHARGE */}
            {scene.env === "bescom_genset" && (
              <AbsoluteFill style={{ backgroundColor: "#0C4A6E" }}>
                <div style={{ position: "absolute", left: 180, top: 200, width: 1000 }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#38BDF8" }}>COMMERCIAL POWER CONSUMPTION (8 SPLIT ACs)</div>
                  <div style={{ marginTop: 40, display: "flex", gap: 40 }}>
                    <div style={{ flex: 1, padding: 36, backgroundColor: "#075985", borderRadius: 20, border: "3px solid #38BDF8" }}>
                      <div style={{ fontSize: 20, color: "#BAE6FD" }}>BESCOM COMMERCIAL SLAB</div>
                      <div style={{ fontSize: 56, fontWeight: 900, color: "#FFFFFF", marginTop: 12 }}>₹1,25,000</div>
                      <div style={{ fontSize: 18, color: "#7DD3FC", marginTop: 8 }}>High-Tension / Non-Domestic</div>
                    </div>
                    <div style={{ flex: 1, padding: 36, backgroundColor: "#075985", borderRadius: 20, border: "3px solid #F59E0B" }}>
                      <div style={{ fontSize: 20, color: "#FDE68A" }}>DIESEL GENSET BACKUP</div>
                      <div style={{ fontSize: 56, fontWeight: 900, color: "#FCD34D", marginTop: 12 }}>₹55,000</div>
                      <div style={{ fontSize: 18, color: "#FDE68A", marginTop: 8 }}>60 Liters / Power Cut Day</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 8: BARISTA TALENT POACHING */}
            {scene.env === "barista_poach" && (
              <AbsoluteFill style={{ backgroundColor: "#262626" }}>
                <div style={{ position: "absolute", left: 200, top: 200, width: 1000, color: "#FFFFFF" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#F59E0B" }}>HEAD BARISTA CHURN DYNAMICS</div>
                  <div style={{ display: "flex", marginTop: 40, gap: 50 }}>
                    <div style={{ flex: 1, padding: 32, backgroundColor: "#171717", borderRadius: 20, border: "2px solid #525252" }}>
                      <div style={{ fontSize: 22, color: "#A3A3A3" }}>TRAINING TIME</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#FCD34D", marginTop: 8 }}>4 MONTHS</div>
                      <div style={{ fontSize: 18, color: "#737373", marginTop: 8 }}>Swan latte art & extraction</div>
                    </div>
                    <div style={{ flex: 1, padding: 32, backgroundColor: "#171717", borderRadius: 20, border: "2px solid #DC2626" }}>
                      <div style={{ fontSize: 22, color: "#EF4444" }}>POACHING OFFER</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#EF4444", marginTop: 8 }}>+30% HIKE</div>
                      <div style={{ fontSize: 18, color: "#F87171", marginTop: 8 }}>By VC-funded coffee chain</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 9: THE WHITEBOARD CASH-FLOW GRINDER */}
            {scene.env === "whiteboard_grinder" && (
              <AbsoluteFill style={{ backgroundColor: "#18181B" }}>
                <div style={{ position: "absolute", left: 160, top: 160, width: 1200 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#DC2626" }}>THE OPERATIONAL CASH GRINDER</div>
                  <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                    <div style={{ padding: 24, backgroundColor: "#27272A", borderRadius: 16, border: "2px solid #DC2626" }}>
                      <div style={{ color: "#EF4444", fontWeight: 700 }}>LANDLORD RENT</div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: "#FFF", marginTop: 6 }}>45.0%</div>
                    </div>
                    <div style={{ padding: 24, backgroundColor: "#27272A", borderRadius: 16, border: "2px solid #F59E0B" }}>
                      <div style={{ color: "#F59E0B", fontWeight: 700 }}>BESCOM & DIESEL</div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: "#FFF", marginTop: 6 }}>18.0%</div>
                    </div>
                    <div style={{ padding: 24, backgroundColor: "#27272A", borderRadius: 16, border: "2px solid #3B82F6" }}>
                      <div style={{ color: "#3B82F6", fontWeight: 700 }}>STAFF PAYROLL</div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: "#FFF", marginTop: 6 }}>16.0%</div>
                    </div>
                    <div style={{ padding: 24, backgroundColor: "#27272A", borderRadius: 16, border: "2px solid #10B981" }}>
                      <div style={{ color: "#10B981", fontWeight: 700 }}>OWNER PROFIT</div>
                      <div style={{ fontSize: 36, fontWeight: 900, color: "#34D399", marginTop: 6 }}>4.0%</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 10: TRUE MONTHLY P&L CLIPBOARD */}
            {scene.env === "true_pnl_clipboard" && (
              <AbsoluteFill style={{ backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 850, padding: 50, backgroundColor: "#FFFFFF", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.1)", border: "2px solid #E2E8F0" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", borderBottom: "3px solid #0F172A", paddingBottom: 16 }}>INDIRANAGAR CAFE · TRUE MONTHLY P&L</div>
                  <div style={{ marginTop: 30, fontSize: 24, lineHeight: "48px", color: "#334155" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Gross Monthly Revenue (400 Cups/Day):</span><strong>₹10,00,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}><span>- Commercial Master Lease:</span><strong>-₹4,50,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}><span>- BESCOM Power + Genset:</span><strong>-₹1,80,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}><span>- Head Barista + 3 Kitchen Staff:</span><strong>-₹1,60,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}><span>- Raw Beans, Spoilage & Milk:</span><strong>-₹1,25,000</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#DC2626" }}><span>- GST & Credit Card Terminal Fees:</span><strong>-₹45,000</strong></div>
                    <div style={{ borderTop: "3px solid #0F172A", marginTop: 20, paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 900, color: "#059669" }}>
                      <span>TRUE NET PROFIT:</span><span>₹40,000 (4%)</span>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 11: B2B WHOLESALE ROASTERS */}
            {scene.env === "b2b_roasters" && (
              <AbsoluteFill style={{ backgroundColor: "#1E1B4B" }}>
                <div style={{ position: "absolute", left: 180, top: 200, width: 1000 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#A5B4FC" }}>WHO ACTUALLY MAKES MONEY?</div>
                  <div style={{ display: "flex", gap: 50, marginTop: 40 }}>
                    <div style={{ flex: 1, padding: 36, backgroundColor: "#312E81", borderRadius: 20, border: "2px solid #818CF8" }}>
                      <div style={{ fontSize: 24, color: "#C7D2FE", fontWeight: 700 }}>THE B2B SPECIALTY ROASTER</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#34D399", marginTop: 12 }}>30 TONS / MO</div>
                      <div style={{ fontSize: 18, color: "#E0E7FF", marginTop: 8 }}>Wholesale beans sold to 400 hopeful cafes</div>
                    </div>
                    <div style={{ flex: 1, padding: 36, backgroundColor: "#312E81", borderRadius: 20, border: "2px solid #F59E0B" }}>
                      <div style={{ fontSize: 24, color: "#FDE68A", fontWeight: 700 }}>THE COMMERCIAL LANDLORD</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: "#FCD34D", marginTop: 12 }}>₹54 LAKH / YR</div>
                      <div style={{ fontSize: 18, color: "#FEF3C7", marginTop: 8 }}>Zero operating headache, guaranteed return</div>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* SCENE 12: ANURAG FINAL VERDICT */}
            {scene.env === "anurag_verdict" && (
              <AbsoluteFill style={{ backgroundColor: "#09090B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", maxWidth: 1100 }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#EF4444", letterSpacing: 2 }}>THE FINAL VERDICT</div>
                  <div style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", marginTop: 24, lineHeight: "72px" }}>
                    "Opening a café in Bangalore does not make you a founder.<br />
                    <span style={{ color: "#FCD34D" }}>It makes you an unpaid manager for your landlord's commercial property."</span>
                  </div>
                  <div style={{ marginTop: 40, fontSize: 24, color: "#A1A1AA" }}>
                    Keep your ₹1.5 Crores in a simple index fund and brew your own pour-over.
                  </div>
                </div>
              </AbsoluteFill>
            )}

            {/* 2. THE ANURAG ANALYST MASCOT CHARACTER */}
            <div
              style={{
                position: "absolute",
                [scene.characterSide]: 80,
                bottom: 80 + mascotBounce,
                width: 320,
                height: 480,
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))",
                zIndex: 10,
              }}
            >
              <Img
                src={staticFile("characters/anurag_mascot.jpg")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {/* 3. KINETIC OVERLAY CARD */}
            <KineticOverlay {...kineticProps} />

            {/* 4. CHAPTER PART START CARD */}
            {scene.isPartStart && sceneRelativeFrame < 90 && (
              <PartTransitionCard
                partTitle={scene.partTitle || scene.part}
                subtitle={scene.partSub}
                durationFrames={90}
              />
            )}

            {/* 5. SEAMLESS SCENE TRANSITION */}
            <SceneTransition type="dip_to_black" durationFrames={8} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* 2. PERSISTENT GLOBAL HUD & CHAPTER BAR */}
      <ChapterHeader
        chapterIndex={activeSceneIdx >= 0 ? activeSceneIdx : 0}
        totalChapters={scenesData.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />
      <ChapterBar
        currentChapterIdx={activeSceneIdx >= 0 ? activeSceneIdx : 0}
        totalChapters={scenesData.length}
      />

      {/* 3. SUBTITLE PILL */}
      {captions && (
        <SubtitlePill
          text={activeLine.text}
          highlights={activeLine.highlights}
          isLine1={isLine1}
          bottom={72}
        />
      )}

      {/* 4. AUDIO BUS (Dialogue + Foley SFX) */}
      {!muted && (
        <>
          {sceneTimeline.map((scene) => (
            <React.Fragment key={`audio_${scene.id}`}>
              {/* Line 0 */}
              <Sequence
                from={scene.startFrame}
                durationInFrames={Math.round(scene.line0Dur * fps) + 5}
                name={`VO_${scene.id}_l0`}
              >
                <Audio src={staticFile(`audio/cafe_v2/${scene.id}_s0.wav`)} volume={1.0} />
              </Sequence>
              {/* Line 1 */}
              <Sequence
                from={scene.startFrame + line0EndFrame}
                durationInFrames={Math.round(scene.line1Dur * fps) + 5}
                name={`VO_${scene.id}_l1`}
              >
                <Audio src={staticFile(`audio/cafe_v2/${scene.id}_s1.wav`)} volume={1.0} />
              </Sequence>
            </React.Fragment>
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};
