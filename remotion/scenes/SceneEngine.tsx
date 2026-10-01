import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneStreet, SceneCounter, SceneSeating, SceneLeaseTable, SceneBreakEven } from "./environments";
import { KineticOverlay, KineticOverlayProps } from "./KineticOverlay";
import { PartTransitionCard } from "./PartTransitionCard";
import { ChapterBar } from "./ChapterBar";
import { ChapterHeader } from "./ChapterHeader";
import { SceneTransition } from "./SceneTransition";

export interface SceneEngineProps {
  muted?: boolean;
}

interface SceneDef {
  id: string;
  name: string;
  part: string;
  isPartStart?: boolean;
  partTitle?: string;
  partSub?: string;
  durationSec: number;
  line0Dur: number;
  pause: number;
  env: "street" | "counter" | "seating" | "lease" | "breakeven";
  overlayLine0: KineticOverlayProps;
  overlayLine1: KineticOverlayProps;
}

export const SceneEngine: React.FC<SceneEngineProps> = ({ muted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 12 Scenes: precisely timed to voiceover lines + pauses
  // Total ~356 seconds (10,680 frames at 30fps) = 5.9 minutes
  const scenes: SceneDef[] = [
    {
      id: "scene_01",
      name: "The Sunday Illusion",
      part: "PART 1 · THE GOLDEN DREAM",
      isPartStart: true,
      partTitle: "THE GOLDEN DREAM",
      partSub: "Why every professional in Bangalore dreams of a café",
      durationSec: 25,
      line0Dur: 13.7,
      pause: 0.5,
      env: "street",
      overlayLine0: {
        badge: "100 FEET ROAD, INDIRANAGAR",
        badgeColor: "#E05A2B",
        title: "SUNDAY 11:00 AM ILLUSION",
        subtitle: "Watching a barista steam whole milk for a ₹280 flat white",
        left: 80,
        bottom: 240,
      },
      overlayLine1: {
        badge: "THE DAYDREAM HOOK",
        badgeColor: "#F39C12",
        title: "EVERY SINGLE CHAIR IS FULL",
        subtitle: "The air smells like roasted Ethiopian beans... 'I could do this'",
        highlightMetric: { value: "100%", label: "TABLE OCCUPANCY", color: "#F39C12" },
        left: 80,
        bottom: 240,
      },
    },
    {
      id: "scene_02",
      name: "The Calculator Trap",
      part: "PART 1 · THE GOLDEN DREAM",
      durationSec: 23,
      line0Dur: 4.4,
      pause: 0.4,
      env: "counter",
      overlayLine0: {
        badge: "THE NAPKIN MATH",
        badgeColor: "#E05A2B",
        title: "SMARTPHONE CALCULATOR TRAP",
        subtitle: "You calculate before the foam even settles on your cup",
        right: 80,
        bottom: 380,
        align: "right",
      },
      overlayLine1: {
        badge: "THE MONEY PRINTER ILLUSION",
        badgeColor: "#27AE60",
        title: "₹25,20,000 / MONTH GROSS",
        subtitle: "300 cups/day × ₹280 = ₹84,000 daily run rate",
        highlightMetric: { value: "₹25,20,000", label: "MONTHLY GROSS RUN RATE", color: "#2ECC71" },
        right: 80,
        bottom: 380,
        align: "right",
      },
    },
    {
      id: "scene_03",
      name: "The Square Footage Trap",
      part: "PART 1 · THE GOLDEN DREAM",
      durationSec: 31,
      line0Dur: 11.4,
      pause: 0.5,
      env: "street",
      overlayLine0: {
        badge: "ROOKIE MISTAKE",
        badgeColor: "#C0392B",
        title: "THE 2,000 SQFT TRAP",
        subtitle: "Thinking more tables directly multiplies specialty coffee profit",
        left: 80,
        bottom: 240,
      },
      overlayLine1: {
        badge: "EXPENSES MULTIPLIER",
        badgeColor: "#E74C3C",
        title: "2X RENT · 3X AIR CONDITIONING",
        subtitle: "Large footprints in Bangalore bleed capex and HVAC electricity",
        highlightMetric: { value: "3X POWER", label: "HVAC ELECTRICITY SPIKE", color: "#E74C3C" },
        left: 80,
        bottom: 240,
      },
    },
    {
      id: "scene_04",
      name: "The 10-Month Lockup",
      part: "PART 2 · THE HIDDEN TRAP",
      isPartStart: true,
      partTitle: "THE HIDDEN TRAP",
      partSub: "Where Bangalore commercial leases choke first-time founders",
      durationSec: 31,
      line0Dur: 10.1,
      pause: 0.5,
      env: "lease",
      overlayLine0: {
        badge: "BANGALORE LEASING REALITY",
        badgeColor: "#8E44AD",
        title: "10-MONTH SECURITY DEPOSIT",
        subtitle: "Landlords on 100ft & 12th Main demand 10 months upfront rent",
        left: 80,
        bottom: 360,
      },
      overlayLine1: {
        badge: "CAPITAL DRAIN",
        badgeColor: "#9B59B6",
        title: "₹25,00,000 CASH FROZEN",
        subtitle: "Locked with landlord earning 0% interest for three years",
        highlightMetric: { value: "₹25,00,000", label: "LOCKED AT 0% INTEREST", color: "#E74C3C" },
        left: 80,
        bottom: 360,
      },
    },
    {
      id: "scene_05",
      name: "The Tuesday 3 PM Graveyard",
      part: "PART 2 · THE HIDDEN TRAP",
      durationSec: 29,
      line0Dur: 9.6,
      pause: 0.5,
      env: "seating",
      overlayLine0: {
        badge: "THE WEEKDAY TRUTH",
        badgeColor: "#2980B9",
        title: "TUESDAY 3:15 PM GRAVEYARD",
        subtitle: "Monsoon drizzle hits Indiranagar; Sunday crowds vanish into thin air",
        left: 80,
        bottom: 320,
      },
      overlayLine1: {
        badge: "THE LAPTOP CAMPER",
        badgeColor: "#3498DB",
        title: "2 CUSTOMERS · 4 HOURS · ₹180 TICKET",
        subtitle: "BESCOM 3-phase meter spinning while campers sip one cold brew",
        highlightMetric: { value: "4 HOURS", label: "PER SINGLE AMERICANO", color: "#3498DB" },
        left: 80,
        bottom: 320,
      },
    },
    {
      id: "scene_06",
      name: "The Capex Blowout",
      part: "PART 2 · THE HIDDEN TRAP",
      durationSec: 30,
      line0Dur: 12.7,
      pause: 0.4,
      env: "counter",
      overlayLine0: {
        badge: "BUDGET OVERRUN",
        badgeColor: "#C0392B",
        title: "BUDGET: ₹10L ➔ ACTUAL: ₹28.5L",
        subtitle: "First-time founders underestimate specialty fitout costs by 2.5x",
        right: 80,
        bottom: 380,
        align: "right",
      },
      overlayLine1: {
        badge: "EQUIPMENT BILL",
        badgeColor: "#D35400",
        title: "ESPRESSO GEAR (₹8L) + CIVIL/HVAC (₹10L)",
        subtitle: "Plus commercial refrigeration, plumbing lines & fire approvals",
        highlightMetric: { value: "₹28,50,000", label: "ACTUAL CAPEX EXPENDITURE", color: "#E74C3C" },
        right: 80,
        bottom: 380,
        align: "right",
      },
    },
    {
      id: "scene_07",
      name: "Dissecting the ₹280 Cup",
      part: "PART 3 · STREET FRICTION",
      isPartStart: true,
      partTitle: "STREET FRICTION",
      partSub: "The ruthless percentage dissection of a single cup of coffee",
      durationSec: 30,
      line0Dur: 7.4,
      pause: 0.5,
      env: "breakeven",
      overlayLine0: {
        badge: "UNIT ECONOMICS",
        badgeColor: "#27AE60",
        title: "DISSECTING THE ₹280 CUP",
        subtitle: "Where does your customer's money actually go?",
        left: 80,
        top: 140,
      },
      overlayLine1: {
        badge: "TRUE PROFIT MARGIN",
        badgeColor: "#2ECC71",
        title: "REAL NET MARGIN: ONLY ₹55 PER CUP",
        subtitle: "Beans (₹35) · Staff (₹42) · Rent (₹42) · Power/GST (₹50)",
        highlightMetric: { value: "₹55.00", label: "TRUE MARGIN PER CUP (19.6%)", color: "#2ECC71" },
        left: 80,
        top: 140,
      },
    },
    {
      id: "scene_08",
      name: "The Delivery App Trap",
      part: "PART 3 · STREET FRICTION",
      durationSec: 28,
      line0Dur: 6.3,
      pause: 0.5,
      env: "counter",
      overlayLine0: {
        badge: "AGGREGATOR TRAP",
        badgeColor: "#D35400",
        title: "DELIVERY WILL NOT SAVE YOU",
        subtitle: "High volume orders dilute your team and paper-thin margins",
        right: 80,
        bottom: 380,
        align: "right",
      },
      overlayLine1: {
        badge: "PLATFORM TAX",
        badgeColor: "#E67E22",
        title: "SWIGGY & ZOMATO TAKE 28%",
        subtitle: "Spill-proof packaging (₹18) + Commission (₹78) = You brew for free",
        highlightMetric: { value: "28.0%", label: "AGGREGATOR COMMISSION CUT", color: "#E67E22" },
        right: 80,
        bottom: 380,
        align: "right",
      },
    },
    {
      id: "scene_09",
      name: "The Fixed-Cost Clock",
      part: "PART 3 · STREET FRICTION",
      durationSec: 26,
      line0Dur: 5.4,
      pause: 0.5,
      env: "seating",
      overlayLine0: {
        badge: "DAILY BREAK-EVEN",
        badgeColor: "#C0392B",
        title: "THE FIXED-COST CLOCK",
        subtitle: "Before the front shutter opens, your rent and wages run",
        left: 80,
        bottom: 320,
      },
      overlayLine1: {
        badge: "MORNING BURN",
        badgeColor: "#E74C3C",
        title: "DAILY BURN: ₹4,800 / DAY",
        subtitle: "Your first 18 cups sold every single morning just pay the landlord",
        highlightMetric: { value: "₹4,800", label: "FIXED BURN BEFORE 1ST SALE", color: "#E74C3C" },
        left: 80,
        bottom: 320,
      },
    },
    {
      id: "scene_10",
      name: "The Food Margin Secret",
      part: "PART 4 · THE SURVIVOR'S PLAYBOOK",
      isPartStart: true,
      partTitle: "THE SURVIVOR'S PLAYBOOK",
      partSub: "How the surviving 15% of independent cafés stay profitable",
      durationSec: 29,
      line0Dur: 9.7,
      pause: 0.5,
      env: "counter",
      overlayLine0: {
        badge: "INDUSTRY PLAYBOOK",
        badgeColor: "#27AE60",
        title: "THE FOOD MARGIN SECRET",
        subtitle: "Coffee brings footfall · Fresh food delivers real margins",
        right: 80,
        bottom: 380,
        align: "right",
      },
      overlayLine1: {
        badge: "REVENUE FORMULA",
        badgeColor: "#2ECC71",
        title: "TARGET: >40% FOOD MIX",
        subtitle: "Croissants, sourdough & bowls command 68% gross margin",
        highlightMetric: { value: "> 40%", label: "FOOD REVENUE MIX TARGET", color: "#2ECC71" },
        right: 80,
        bottom: 380,
        align: "right",
      },
    },
    {
      id: "scene_11",
      name: "The Side-Street Advantage",
      part: "PART 4 · THE SURVIVOR'S PLAYBOOK",
      durationSec: 25,
      line0Dur: 10.4,
      pause: 0.5,
      env: "street",
      overlayLine0: {
        badge: "LOCATION DISCIPLINE",
        badgeColor: "#27AE60",
        title: "THE HSR SIDE-STREET RULE",
        subtitle: "Skip 100ft Road ego rent · Pick leafy HSR & Koramangala lanes",
        left: 80,
        bottom: 240,
      },
      overlayLine1: {
        badge: "RENT CEILING LAW",
        badgeColor: "#2ECC71",
        title: "KEEP RENT STRICTLY UNDER 15%",
        subtitle: "15% of projected monthly gross is the mathematical ceiling",
        highlightMetric: { value: "≤ 15%", label: "MAXIMUM SUSTAINABLE RENT RATIO", color: "#2ECC71" },
        left: 80,
        bottom: 240,
      },
    },
    {
      id: "scene_12",
      name: "Master the Basics",
      part: "PART 4 · THE SURVIVOR'S PLAYBOOK",
      durationSec: 29,
      line0Dur: 17.3,
      pause: 0.6,
      env: "counter",
      overlayLine0: {
        badge: "EPISODE 01 CONCLUSION",
        badgeColor: "#E05A2B",
        title: "MASTER BASICS BEFORE RENT DOES",
        subtitle: "Capex is just the price of admission to the room",
        right: 80,
        bottom: 380,
        align: "right",
      },
      overlayLine1: {
        badge: "THE 12-MONTH SHIELD",
        badgeColor: "#F39C12",
        title: "KEEP 9–12 MONTHS CASH RUNWAY",
        subtitle: "Until Tuesday 3:00 PM pays for itself in Bangalore",
        highlightMetric: { value: "12 MO", label: "MINIMUM LIQUID RUNWAY", color: "#F39C12" },
        right: 80,
        bottom: 380,
        align: "right",
      },
    },
  ];

  // Calculate cumulative start frames
  let accumulatedFrame = 0;
  const sceneTimeline = scenes.map((s) => {
    const start = accumulatedFrame;
    const durationFrames = Math.round(s.durationSec * fps);
    accumulatedFrame += durationFrames;
    return { ...s, startFrame: start, durationFrames };
  });

  // Current active scene
  const currentSceneIdx = sceneTimeline.findIndex(
    (s) => frame >= s.startFrame && frame < s.startFrame + s.durationFrames
  );
  const activeScene = sceneTimeline[currentSceneIdx >= 0 ? currentSceneIdx : 0];

  // Dynamic Camera & Continuous Zoom Pulse (Rule of 4 seconds)
  const pushCycle = Math.sin((frame / (fps * 3.5)) * Math.PI);
  const continuousScale = 1.0 + Math.max(0, pushCycle) * 0.035;

  // Auto-Ducking BGM calculation
  const isTransition = sceneTimeline.some(
    (s) => Math.abs(frame - s.startFrame) < fps * 1.4
  );
  const targetBgmVol = isTransition ? 0.28 : 0.12;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F5F0", overflow: "hidden" }}>
      {/* 1. Dynamic Camera Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${continuousScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Render each scene sequence */}
        {sceneTimeline.map((scene, idx) => {
          const startVoiceOffset = scene.isPartStart ? 1.6 : 0.8;
          const line0Start = Math.round(fps * startVoiceOffset);
          const line1Start = line0Start + Math.round(fps * (scene.line0Dur + scene.pause));

          return (
            <Sequence
              key={scene.id}
              from={scene.startFrame}
              durationInFrames={scene.durationFrames}
            >
              {/* Scene Transition (Spring slide + settle zoom + light streak wipe) */}
              <SceneTransition isPartStart={scene.isPartStart}>
                {scene.env === "street" && (
                  <SceneStreet
                    headline={idx === 0 ? "100 FEET ROAD, INDIRANAGAR" : "BANGALORE STREET REALITY"}
                    subheadline={idx === 0 ? "SUNDAY 11:00 AM · SPECIALTY COFFEE RUSH" : "SIDE STREET FOOTFALL DYNAMICS"}
                  />
                )}
                {scene.env === "counter" && (
                  <SceneCounter
                    headline={scene.id === "scene_02" ? "THE NAPKIN MATH ILLUSION" : "SPECIALTY ESPRESSO BAR"}
                    subheadline={scene.id === "scene_02" ? "300 CUPS × ₹280 = ₹25 LAKHS / MONTH" : "UNIT ECONOMICS & LABOUR COST"}
                  />
                )}
                {scene.env === "seating" && (
                  <SceneSeating
                    isRainy={scene.id === "scene_05"}
                    headline={scene.id === "scene_05" ? "THE TUESDAY 3 PM REALITY" : "FIXED COST DAILY BURN"}
                    subheadline={scene.id === "scene_05" ? "2 CUSTOMERS · 4 HOURS · 3-PHASE AC" : "₹4,800 BURN BEFORE OPENING THE DOOR"}
                  />
                )}
                {scene.env === "lease" && (
                  <SceneLeaseTable
                    depositAmount="₹25,00,000"
                    headline="10-MONTH SECURITY DEPOSIT"
                    subheadline="BANGALORE COMMERCIAL RENTAL REALITY"
                  />
                )}
                {scene.env === "breakeven" && (
                  <SceneBreakEven
                    headline="DISSECTING THE ₹280 FLAT WHITE"
                    subheadline="WHERE DOES THE MONEY ACTUALLY GO?"
                  />
                )}
              </SceneTransition>

              {/* Kinetic On-Screen Text Overlay 1 (Spoken Line 0) */}
              <Sequence from={line0Start} durationInFrames={Math.max(1, line1Start - line0Start)}>
                <KineticOverlay
                  badge={scene.overlayLine0.badge}
                  badgeColor={scene.overlayLine0.badgeColor}
                  title={scene.overlayLine0.title}
                  subtitle={scene.overlayLine0.subtitle}
                  highlightMetric={scene.overlayLine0.highlightMetric}
                  align={scene.overlayLine0.align}
                  left={scene.overlayLine0.left}
                  right={scene.overlayLine0.right}
                  bottom={scene.overlayLine0.bottom}
                  top={scene.overlayLine0.top}
                />
              </Sequence>

              {/* Kinetic On-Screen Text Overlay 2 (Spoken Line 1: Punchline & Numbers) */}
              <Sequence from={line1Start}>
                <KineticOverlay
                  badge={scene.overlayLine1.badge}
                  badgeColor={scene.overlayLine1.badgeColor}
                  title={scene.overlayLine1.title}
                  subtitle={scene.overlayLine1.subtitle}
                  highlightMetric={scene.overlayLine1.highlightMetric}
                  align={scene.overlayLine1.align}
                  left={scene.overlayLine1.left}
                  right={scene.overlayLine1.right}
                  bottom={scene.overlayLine1.bottom}
                  top={scene.overlayLine1.top}
                />
              </Sequence>

              {/* Part Transition Card (1.5s visual card at the start of new parts) */}
              {scene.isPartStart && (
                <Sequence from={0} durationInFrames={Math.round(fps * 1.6)}>
                  <PartTransitionCard
                    partNumber={scene.part.split("·")[0].trim()}
                    title={scene.partTitle || ""}
                    subtitle={scene.partSub || ""}
                  />
                </Sequence>
              )}
            </Sequence>
          );
        })}
      </div>

      {/* 2. FLOATING TOP-LEFT CHAPTER INDICATOR */}
      <ChapterHeader
        chapterIndex={currentSceneIdx >= 0 ? currentSceneIdx : 0}
        totalChapters={scenes.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />

      {/* 3. PERSISTENT CHAPTER HUD & PROGRESS BAR (BOTTOM) */}
      <ChapterBar
        currentChapterIdx={currentSceneIdx >= 0 ? currentSceneIdx : 0}
        totalChapters={scenes.length}
        chapterTitle={activeScene.name}
        partName={activeScene.part}
      />

      {/* 4. MULTI-TRACK AUDIO ENGINE */}
      {!muted && (
        <>
          {/* TRACK 1: Ambient Lo-Fi BGM with Dynamic Auto-Ducking */}
          <Audio
            src={staticFile("audio/bgm/cafe_groove.mp3")}
            loop
            volume={targetBgmVol}
          />

          {/* TRACK 2: Spoken Voiceover Narration (Per Scene Sentence-Pairs) */}
          {sceneTimeline.map((s) => {
            const startVoiceOffset = s.isPartStart ? 1.6 : 0.8;
            const line0Start = Math.round(fps * startVoiceOffset);
            const line1Start = line0Start + Math.round(fps * (s.line0Dur + s.pause));

            return (
              <Sequence key={`voice-${s.id}`} from={s.startFrame}>
                {/* Sentence 0 */}
                <Sequence from={line0Start}>
                  <Audio src={staticFile(`audio/v3/${s.id}_s0.wav`)} volume={1.0} />
                </Sequence>
                {/* Sentence 1 */}
                <Sequence from={line1Start}>
                  <Audio src={staticFile(`audio/v3/${s.id}_s1.wav`)} volume={1.0} />
                </Sequence>
              </Sequence>
            );
          })}

          {/* TRACK 3: Transition Whip-Whooshes & Foley Hits */}
          {sceneTimeline.map((s, idx) => (
            <React.Fragment key={`sfx-group-${s.id}`}>
              {/* Scene Transition Whoosh */}
              {idx > 0 && (
                <Sequence from={s.startFrame - 4}>
                  <Audio src={staticFile("audio/sfx/whip_whoosh.wav")} volume={0.45} />
                </Sequence>
              )}

              {/* Scene Specific Diegetic Foley Cues */}
              {s.id === "scene_01" && (
                <>
                  <Sequence from={s.startFrame + 15}>
                    <Audio src={staticFile("audio/sfx/door_chime.wav")} volume={0.5} />
                  </Sequence>
                  <Sequence from={s.startFrame + 45}>
                    <Audio src={staticFile("audio/sfx/portafilter_clack.wav")} volume={0.55} />
                  </Sequence>
                  <Sequence from={s.startFrame + 75}>
                    <Audio src={staticFile("audio/sfx/steam_wand_hiss.wav")} volume={0.4} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_02" && (
                <>
                  <Sequence from={s.startFrame + 20}>
                    <Audio src={staticFile("audio/sfx/screen_tap.wav")} volume={0.6} />
                  </Sequence>
                  <Sequence from={s.startFrame + 40}>
                    <Audio src={staticFile("audio/sfx/calculator_taps.wav")} volume={0.5} />
                  </Sequence>
                  <Sequence from={s.startFrame + 120}>
                    <Audio src={staticFile("audio/sfx/upi_success_voice.wav")} volume={0.55} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_03" && (
                <>
                  <Sequence from={s.startFrame + 15}>
                    <Audio src={staticFile("audio/sfx/paper_unroll.wav")} volume={0.55} />
                  </Sequence>
                  <Sequence from={s.startFrame + 50}>
                    <Audio src={staticFile("audio/sfx/measuring_tape.wav")} volume={0.6} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_04" && (
                <>
                  <Sequence from={s.startFrame + 25}>
                    <Audio src={staticFile("audio/sfx/stamp_thud.wav")} volume={0.65} />
                  </Sequence>
                  <Sequence from={s.startFrame + 80}>
                    <Audio src={staticFile("audio/sfx/safe_door_slam.wav")} volume={0.7} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_05" && (
                <>
                  <Sequence from={s.startFrame + 20}>
                    <Audio src={staticFile("audio/sfx/monsoon_rain_window.wav")} volume={0.5} />
                  </Sequence>
                  <Sequence from={s.startFrame + 60}>
                    <Audio src={staticFile("audio/sfx/wall_clock_tick.wav")} volume={0.4} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_06" && (
                <>
                  <Sequence from={s.startFrame + 20}>
                    <Audio src={staticFile("audio/sfx/receipt_printer.wav")} volume={0.6} />
                  </Sequence>
                  <Sequence from={s.startFrame + 70}>
                    <Audio src={staticFile("audio/sfx/calculator_taps.wav")} volume={0.55} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_07" && (
                <>
                  <Sequence from={s.startFrame + 30}>
                    <Audio src={staticFile("audio/sfx/slice_laser.wav")} volume={0.6} />
                  </Sequence>
                  <Sequence from={s.startFrame + 90}>
                    <Audio src={staticFile("audio/sfx/cup_saucer_clink.wav")} volume={0.65} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_08" && (
                <>
                  <Sequence from={s.startFrame + 25}>
                    <Audio src={staticFile("audio/sfx/screen_tap.wav")} volume={0.6} />
                  </Sequence>
                  <Sequence from={s.startFrame + 60}>
                    <Audio src={staticFile("audio/sfx/mechanical_gear.wav")} volume={0.5} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_09" && (
                <>
                  <Sequence from={s.startFrame + 20}>
                    <Audio src={staticFile("audio/sfx/wall_clock_tick.wav")} volume={0.45} />
                  </Sequence>
                  <Sequence from={s.startFrame + 80}>
                    <Audio src={staticFile("audio/sfx/door_chime.wav")} volume={0.55} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_10" && (
                <>
                  <Sequence from={s.startFrame + 20}>
                    <Audio src={staticFile("audio/sfx/plate_table_clatter.wav")} volume={0.6} />
                  </Sequence>
                  <Sequence from={s.startFrame + 70}>
                    <Audio src={staticFile("audio/sfx/upi_success_voice.wav")} volume={0.55} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_11" && (
                <>
                  <Sequence from={s.startFrame + 20}>
                    <Audio src={staticFile("audio/sfx/paper_unroll.wav")} volume={0.55} />
                  </Sequence>
                  <Sequence from={s.startFrame + 60}>
                    <Audio src={staticFile("audio/sfx/stamp_thud.wav")} volume={0.6} />
                  </Sequence>
                </>
              )}

              {s.id === "scene_12" && (
                <>
                  <Sequence from={s.startFrame + 30}>
                    <Audio src={staticFile("audio/sfx/cup_saucer_clink.wav")} volume={0.6} />
                  </Sequence>
                  <Sequence from={s.startFrame + 90}>
                    <Audio src={staticFile("audio/sfx/door_chime.wav")} volume={0.5} />
                  </Sequence>
                </>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </AbsoluteFill>
  );
};
