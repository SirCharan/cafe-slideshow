"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import defaultSlidesData from "@/data/slides.json";
import type { Slide, VideoScript, ScriptLine, Visual, ThemeName } from "@/remotion/types";
import { getTheme } from "@/remotion/theme";
// remotion's visuals use Remotion hooks (useCurrentFrame via <Img> premounting) that only
// work inside a registered Composition/Player; this preview renders them standalone, so
// load client-only to avoid the SSR/prerender crash.
const SlideVisual = dynamic(() => import("@/remotion/visuals").then((m) => m.SlideVisual), { ssr: false });
// Same client-only rationale as SlideVisual: Board's element renderers use Remotion hooks.
const Board = dynamic(() => import("@/remotion/board/Board").then((m) => m.Board), { ssr: false });
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Layers,
  FileText,
  CheckCircle2,
  Coffee,
  Store,
  ExternalLink,
  Edit3,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Check,
  Code,
  Mic,
  Clock,
  Sparkle,
  MonitorPlay
} from "lucide-react";

const VISUAL_TYPES: Visual["type"][] = [
  "receipt",
  "bars",
  "range",
  "compare",
  "logos",
  "tree",
  "photo",
  "character",
  "icon",
];

function defaultVisualForType(type: Visual["type"]): Visual {
  switch (type) {
    case "receipt":
      return { type, title: "Title", lines: [] };
    case "bars":
      return { type, title: "Title", items: [] };
    case "range":
      return { type, title: "Title", min: 0, max: 100, unit: "", markers: [] };
    case "compare":
      return { type, title: "Title", left: { title: "Left", rows: [] }, right: { title: "Right", rows: [] } };
    case "logos":
      return { type, title: "Title", items: [] };
    case "tree":
      return { type, title: "Title", root: "Root", branches: [] };
    case "photo":
      return { type, src: "", caption: "" };
    case "character":
      return { type, src: "", caption: "" };
    case "icon":
      return { type, src: "", stat: "", caption: "" };
  }
}

const AVAILABLE_IMAGES = [
  "card_receipt_b01.png",
  "card_rush_b02.png",
  "card_blueprint_b03.png",
  "char_barista.png",
  "thumb_nikhil_restaurant.jpg",
  "card_corridors_b06.png",
  "thumb_wint_wealth.jpg",
  "chart_capex_b08.png",
  "chart_entry_b09.png",
  "icon_rent.png",
  "chart_rent_b12.png",
  "card_compliance_logos.png",
  "chart_cogs_b15.png",
  "icon_scooter.png",
  "chart_salesmix_b17.png",
  "card_chains_b18.png",
  "chart_decision_b19.png",
  "char_rupee.png",
  "barista.jpg",
  "cafe-interior.jpg",
  "cafe-street.jpg",
  "coffee-cup.jpg",
  "espresso.jpg",
  "food-plate.jpg",
  "youtube_thumbnail_cafe.png"
];

export default function CafeSlideshow() {
  const [slides, setSlides] = useState<Slide[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cafe_slideshow_custom_deck");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load custom deck:", e);
        }
      }
    }
    return defaultSlidesData as Slide[];
  });

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTranscript] = useState<boolean>(true);
  const [showOverviewGrid, setShowOverviewGrid] = useState<boolean>(false);
  
  // WYSIWYG & Prompting state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"takeaways" | "script">("takeaways");

  // v2 is one whiteboard theme (getTheme ignores the name); the editor preview still passes
  // a ThemeName since SlideVisual's signature takes one.
  const presentTheme: ThemeName = "ledger";

  // Live visual preview (build animation loop + fit-to-container scale)
  const [previewFrame, setPreviewFrame] = useState<number>(0);
  const [visualScale, setVisualScale] = useState<number>(0.525);
  const visualContainerRef = useRef<HTMLDivElement | null>(null);
  const previewRafRef = useRef<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentSlide = slides[currentIdx] || slides[0];
  const videoScript = currentSlide.video_script;
  const currentVisual = currentSlide.visual;
  const boardSentenceStartFrames = (currentSlide.sentence_timings ?? [])
    .slice()
    .sort((a, b) => a.sentence_idx - b.sentence_idx)
    .map((t) => Math.round(t.local_start * 30));

  // Persist edits to localStorage
  const saveSlides = (newSlides: Slide[]) => {
    setSlides(newSlides);
    if (typeof window !== "undefined") {
      localStorage.setItem("cafe_slideshow_custom_deck", JSON.stringify(newSlides));
    }
  };

  const resetToDefault = () => {
    if (confirm("Reset entire slideshow to default ground-truth version? Any custom edits will be cleared.")) {
      saveSlides(defaultSlidesData as Slide[]);
      localStorage.removeItem("cafe_slideshow_custom_deck");
      setCurrentIdx(0);
    }
  };

  const updateCurrentSlide = (field: keyof Slide, value: Slide[keyof Slide]) => {
    const updated = [...slides];
    updated[currentIdx] = {
      ...updated[currentIdx],
      [field]: value
    };
    saveSlides(updated);
  };

  const updateBullet = (bIdx: number, val: string) => {
    const updated = [...slides];
    const newBullets = [...updated[currentIdx].bullets];
    newBullets[bIdx] = val;
    updated[currentIdx].bullets = newBullets;
    saveSlides(updated);
  };

  const addBullet = () => {
    const updated = [...slides];
    updated[currentIdx].bullets.push("New key takeaway / financial metric");
    saveSlides(updated);
  };

  const deleteBullet = (bIdx: number) => {
    const updated = [...slides];
    updated[currentIdx].bullets = updated[currentIdx].bullets.filter((_, i) => i !== bIdx);
    saveSlides(updated);
  };

  const updateScriptLine = (sIdx: number, field: keyof ScriptLine, val: ScriptLine[keyof ScriptLine]) => {
    const updated = [...slides];
    if (!updated[currentIdx].video_script) return;
    const lines = [...updated[currentIdx].video_script!.script_lines];
    lines[sIdx] = {
      ...lines[sIdx],
      [field]: val
    };
    updated[currentIdx].video_script!.script_lines = lines;
    // Also sync to sentences array if text changed
    if (field === "text") {
      const sents = [...updated[currentIdx].sentences];
      sents[sIdx] = val as string;
      updated[currentIdx].sentences = sents;
    }
    saveSlides(updated);
  };

  const updateDirectorNote = (field: keyof VideoScript, val: VideoScript[keyof VideoScript]) => {
    const updated = [...slides];
    if (!updated[currentIdx].video_script) return;
    updated[currentIdx].video_script = {
      ...updated[currentIdx].video_script!,
      [field]: val
    };
    saveSlides(updated);
  };

  // Navigation handlers
  const goToSlide = useCallback((newIdx: number) => {
    if (newIdx < 0 || newIdx >= slides.length) return;
    setCurrentIdx(newIdx);
    setCurrentTime(0);
    setActiveSentenceIdx(-1);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [slides.length, isPlaying]);

  const handleNext = useCallback(() => {
    if (currentIdx < slides.length - 1) {
      goToSlide(currentIdx + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentIdx, slides.length, goToSlide]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      goToSlide(currentIdx - 1);
    }
  }, [currentIdx, goToSlide]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Playback error:", err);
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Measure the visual preview box so the fixed 800x640 render scales to fit.
  useEffect(() => {
    const el = visualContainerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setVisualScale(entry.contentRect.width / 800);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reset the preview frame when the slide changes (adjust state during render, not in an effect).
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(currentIdx);
  if (previewSlideIdx !== currentIdx) {
    setPreviewSlideIdx(currentIdx);
    setPreviewFrame(0);
  }

  // Drive the visual preview's build animation, looping while the slide with a visual is shown.
  useEffect(() => {
    if (!currentVisual && !currentSlide.board) return;
    let frame = 0;
    const step = () => {
      frame = (frame + 1) % 900;
      setPreviewFrame(frame);
      previewRafRef.current = requestAnimationFrame(step);
    };
    previewRafRef.current = requestAnimationFrame(step);
    return () => {
      if (previewRafRef.current !== null) cancelAnimationFrame(previewRafRef.current);
    };
  }, [currentIdx, currentVisual, currentSlide.board]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);

    if (currentSlide.sentence_timings && currentSlide.sentence_timings.length > 0) {
      const active = currentSlide.sentence_timings.findIndex(st => 
        t >= st.local_start && t <= st.local_start + st.duration + 0.4
      );
      if (active !== -1) {
        setActiveSentenceIdx(active);
      }
    }
  };

  const handleAudioEnded = () => {
    if (currentIdx < slides.length - 1) {
      goToSlide(currentIdx + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        if (e.key === "Space") {
          togglePlay();
        } else {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "e" || e.key === "E") {
        setIsEditMode(prev => !prev);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, togglePlay, toggleFullscreen]);

  const copyAIPromptForSlide = () => {
    const scriptLines = videoScript?.script_lines || [];
    const formattedScript = scriptLines.map(sl => 
      `  - Line ${sl.sentence_idx + 1} [Expression: ${sl.expression}] [Pause: ${sl.pause_s}s]: "${sl.text}"`
    ).join("\n");

    const prompt = `I am refining slide #${currentSlide.index} ("${currentSlide.headline}") of our YouTube documentary series "The Economics of Owning a Café in Bangalore".

CURRENT CHAPTER DETAILS:
- Title: ${currentSlide.headline}
- Part / Module: ${currentSlide.part}
- Category Chip: ${currentSlide.chip}
- Visual Asset: ${currentSlide.image}
- Key Takeaways (On-Screen):
${currentSlide.bullets.map((b, i) => `  ${i+1}. ${b}`).join("\n")}

NARRATION SCRIPT & VOICE DIRECTION:
- Tone: ${videoScript?.tone || "Conversational"}
- Pacing: ${videoScript?.pacing || "142 wpm"}
- Vibe: ${videoScript?.chapter_vibe || "Analytical"}
- Director Note: "${videoScript?.director_note || ""}"
- Spoken Lines with Pauses & Expressions:
${formattedScript}

TASK:
Review this chapter as a world-class documentary director and financial scriptwriter:
1. Polish the script lines to make them punchier, eliminating filler, and adding human cadence.
2. Mark the exact emotional delivery/expression (e.g. wry, cautionary, deadpan, emphatic) for each sentence.
3. Suggest precise pause durations (0.3s to 0.8s) for tension and breath.
4. Improve the 4-5 on-screen visual takeaways with concrete Bangalore numbers (rents, food cost %, barista salaries).
5. Output the revised JSON matching the Slide schema so I can paste it right into the web app!`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const exportJsonDeck = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(slides, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cafe_slideshow_deck_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJsonDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveSlides(parsed);
          setCurrentIdx(0);
          alert(`Successfully imported ${parsed.length} slides!`);
        } else {
          alert("Invalid slide deck format. Expected an array of slides.");
        }
      } catch (err) {
        alert("Failed to parse JSON file: " + err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[var(--chrome)] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSlide.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      <input 
        ref={fileInputRef} 
        type="file" 
        accept=".json" 
        className="hidden" 
        onChange={importJsonDeck} 
      />

      {/* Top Header Navigation Bar */}
      <header className="h-16 border-b border-white/10 bg-[var(--chrome-2)]/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">Not A Startup</span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 font-bold px-1.5 py-0.2 rounded border border-orange-500/30">
                  Script & Director Deck
                </span>
              </div>
              <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                The Economics of Owning a Café in Bangalore
              </h1>
            </div>
          </div>
        </div>

        {/* Middle Playback Controls */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
          <button 
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 transition"
            title="Previous slide (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-orange-600/30 transition"
            title="Play / Pause narration (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen Audio</span>
              </>
            )}
          </button>

          <button 
            onClick={handleNext}
            disabled={currentIdx === slides.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 transition"
            title="Next slide (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs">
            {[1.0, 1.2, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  playbackSpeed === speed
                    ? "bg-white/20 text-orange-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          <button 
            onClick={() => setIsMuted(prev => !prev)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Tools: Edit Mode & AI Export */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.open(`/present?slide=${currentIdx}`, "_blank")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 hover:bg-white/10 text-slate-200 flex items-center gap-1.5 transition"
            title="Open live Remotion present mode in a new tab"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Present</span>
          </button>

          <button
            onClick={() => window.open(`/present?mode=manual&slide=${currentIdx}`, "_blank")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 hover:bg-white/10 text-slate-200 flex items-center gap-1.5 transition"
            title="Open present mode with manual, click-through advance (muted)"
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Present (manual)</span>
          </button>

          <button
            onClick={() => setIsEditMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              isEditMode 
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20" 
                : "border-white/15 hover:bg-white/10 text-slate-200"
            }`}
            title="Toggle direct text editing on slide (Press E)"
          >
            {isEditMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Mode</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Deck (WYSIWYG)</span>
              </>
            )}
          </button>

          <button
            onClick={copyAIPromptForSlide}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition"
            title="Copy structured script & slide prompt for Claude to improve"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-300" />
                <span>Copied for Claude!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask Claude to Polish</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setJsonText(JSON.stringify(currentSlide, null, 2));
              setShowJsonModal(true);
            }}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 transition"
            title="View & Edit Raw Slide JSON"
          >
            <Code className="w-4 h-4" />
          </button>

          {isEditMode && (
            <button
              onClick={() => {
                setJsonText(JSON.stringify(currentSlide, null, 2));
                setShowJsonModal(true);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 hover:bg-white/10 text-slate-200 flex items-center gap-1.5 transition"
              title="Edit this slide's whiteboard storyboard (opens the same slide JSON editor)"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Edit board JSON</span>
            </button>
          )}

          <button
            onClick={() => setShowOverviewGrid(prev => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              showOverviewGrid 
                ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                : "border-white/10 hover:bg-white/5 text-slate-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Deck ({slides.length})</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 transition"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Progress timeline bar */}
      <div className="w-full bg-white/5 h-1 relative">
        <div 
          className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-200"
          style={{ width: `${((currentIdx + (currentTime / (currentSlide.duration || 1))) / slides.length) * 100}%` }}
        />
      </div>

      {/* Edit Mode Alert Banner */}
      {isEditMode && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2 flex items-center justify-between text-xs text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">WYSIWYG Editing Active:</span>
            <span>Edit headlines, bullets, script lines, pause timings, or delivery expressions below. Saves locally.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1 transition"
            >
              <Upload className="w-3 h-3" />
              Import JSON
            </button>
            <button
              onClick={exportJsonDeck}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1 transition"
            >
              <Download className="w-3 h-3" />
              Export Deck
            </button>
            <button
              onClick={resetToDefault}
              className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Raw JSON Editor Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[var(--chrome-3)] border border-white/20 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Edit Slide #{currentSlide.index} JSON (With Video Script & Pauses)</h3>
              </div>
              <button 
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
              >
                Close
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-96 bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-xs text-orange-200 focus:border-orange-500 focus:outline-none resize-none custom-scrollbar"
              />
            </div>

            <div className="p-4 px-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  alert("Copied slide JSON to clipboard!");
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy JSON
              </button>
              
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonText);
                    const updated = [...slides];
                    updated[currentIdx] = {
                      ...updated[currentIdx],
                      ...parsed
                    };
                    saveSlides(updated);
                    setShowJsonModal(false);
                    alert("Slide updated successfully!");
                  } catch (err) {
                    alert("Invalid JSON format: " + err);
                  }
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white shadow-md transition"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slide Overview Grid Drawer */}
      {showOverviewGrid && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md pt-20 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Episode Slide Deck ({slides.length} Chapters)</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Click any slide to jump directly. Full unit economics breakdown of Bangalore café reality.
                </p>
              </div>
              <button
                onClick={() => setShowOverviewGrid(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition"
              >
                Close Deck [Esc]
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {slides.map((slide, slideIdx) => {
                const isSelected = slideIdx === currentIdx;
                return (
                  <div
                    key={slide.id}
                    onClick={() => {
                      goToSlide(slideIdx);
                      setShowOverviewGrid(false);
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition border relative group overflow-hidden ${
                      isSelected
                        ? "bg-orange-950/40 border-orange-500 shadow-lg shadow-orange-500/10"
                        : "glass-panel hover:border-white/25 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono">Ch {String(slide.index).padStart(2, "0")}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] uppercase font-semibold text-slate-300">
                        {slide.chip}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-orange-300 transition line-clamp-1 mb-2">
                      {slide.headline}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {slide.bullets[0]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Presentation Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        {/* Module Chapter Banner */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <input
                type="text"
                value={currentSlide.part}
                onChange={(e) => updateCurrentSlide("part", e.target.value)}
                className="bg-black/50 border border-orange-500/50 rounded px-2 py-1 text-xs font-bold text-orange-400 uppercase tracking-wider"
              />
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wider uppercase">
                {currentSlide.part}
              </span>
            )}
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-slate-400 text-xs font-medium tracking-wide">
              CHAPTER {String(currentSlide.index).padStart(2, "0")} OF {slides.length}
            </span>
            <span className="text-slate-500 text-sm">·</span>
            
            {isEditMode ? (
              <input
                type="text"
                value={currentSlide.chip}
                onChange={(e) => updateCurrentSlide("chip", e.target.value)}
                className="bg-black/50 border border-amber-500/50 rounded px-2 py-1 text-xs font-semibold text-amber-300"
              />
            ) : (
              <span className="text-amber-300/80 text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                {currentSlide.chip}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>
              {Math.floor(currentTime)}s / {Math.round(currentSlide.duration)}s
            </span>
          </div>
        </div>

        {/* 16:9 Presentation Canvas */}
        <div className="w-full aspect-[16/9] glass-panel-glow rounded-2xl overflow-hidden border border-white/15 relative shadow-2xl flex flex-col md:flex-row">
          
          {/* Left Visual Column: Polaroid / Component Graphic */}
          <div className="w-full md:w-[48%] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-[var(--chrome-4)]/85 relative">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-orange-400 uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                KEY EVIDENCE & COMPONENT
              </div>

              {isEditMode ? (
                <input
                  type="text"
                  value={currentSlide.headline}
                  onChange={(e) => updateCurrentSlide("headline", e.target.value)}
                  className="w-full bg-black/60 border border-amber-400/50 rounded-lg p-2 text-2xl md:text-3xl font-black text-white focus:outline-none mb-2"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight mb-2">
                  {currentSlide.headline}
                </h2>
              )}
            </div>

            {/* Graphic Container with Polaroid Frame */}
            <div className="my-auto py-2 flex flex-col items-center">
              <div className="relative group max-w-[420px] w-full bg-white p-3.5 pb-6 rounded-lg shadow-2xl rotate-[-0.5deg] hover:rotate-0 transition duration-300 border border-black/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/80 backdrop-blur-sm border border-amber-300/50 shadow-sm rotate-[1.5deg] z-10" />

                <div
                  ref={visualContainerRef}
                  className={`relative w-full rounded overflow-hidden bg-slate-950 flex items-center justify-center ${
                    currentSlide.board ? "aspect-video" : currentVisual ? "aspect-[5/4]" : "aspect-square"
                  }`}
                >
                  {currentSlide.board ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 1920,
                        height: 1080,
                        // Same fit-to-container technique as the 800x640 SlideVisual preview,
                        // rescaled: visualScale is measured against an 800px-wide reference box.
                        transform: `scale(${(visualScale * 800) / 1920})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <Board
                        board={currentSlide.board}
                        frame={previewFrame}
                        sentenceStartFrames={boardSentenceStartFrames}
                        fps={30}
                        seedBase={currentSlide.id}
                      />
                    </div>
                  ) : currentVisual ? (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 800,
                        height: 640,
                        transform: `scale(${visualScale})`,
                        transformOrigin: "top left",
                      }}
                    >
                      <SlideVisual
                        visual={currentVisual}
                        theme={getTheme(presentTheme)}
                        frame={previewFrame}
                        activeSentence={activeSentenceIdx}
                        width={800}
                        height={640}
                      />
                    </div>
                  ) : (
                    <Image
                      src={`/assets/${currentSlide.image}`}
                      alt={currentSlide.headline}
                      fill
                      className="object-contain p-1"
                      priority
                    />
                  )}
                </div>

                <div className="mt-3.5 px-1 flex items-center justify-between text-slate-800">
                  <span className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase">
                    FIG {String(currentSlide.index).padStart(2, "0")}: {currentSlide.chip}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">
                    Not A Startup #01
                  </span>
                </div>
              </div>

              {/* Asset Switcher in Edit Mode */}
              {isEditMode && (
                <div className="mt-3 w-full max-w-[420px] flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Image:</span>
                  <select
                    value={currentSlide.image}
                    onChange={(e) => updateCurrentSlide("image", e.target.value)}
                    className="w-full bg-[var(--chrome-7)] text-xs text-amber-200 border border-white/15 rounded p-1 focus:outline-none"
                  >
                    {AVAILABLE_IMAGES.map((imgName) => (
                      <option key={imgName} value={imgName}>
                        {imgName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Visual field group in Edit Mode */}
              {isEditMode && (
                <div className="mt-3 w-full max-w-[420px] flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Visual:</span>
                  <select
                    value={currentVisual?.type ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentSlide("visual", val ? defaultVisualForType(val as Visual["type"]) : undefined);
                    }}
                    className="w-full bg-[var(--chrome-7)] text-xs text-amber-200 border border-white/15 rounded p-1 focus:outline-none"
                  >
                    <option value="">None (use image)</option>
                    {VISUAL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setJsonText(JSON.stringify(currentSlide, null, 2));
                      setShowJsonModal(true);
                    }}
                    className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 transition"
                  >
                    <Code className="w-3 h-3" />
                    Edit JSON
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Caption Pill */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-orange-400" />
                Bangalore Commercial Micro-market Data
              </span>
              <span className="font-mono text-[11px] text-slate-500">ASD-STE100 Ground Truth</span>
            </div>
          </div>

          {/* Right Content Column: Dual View (Takeaways & Full Video Script) */}
          <div className="w-full md:w-[52%] p-6 md:p-8 flex flex-col justify-between bg-[var(--chrome-5)]/90">
            <div>
              {/* Header Tab Switcher */}
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("takeaways")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === "takeaways"
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Takeaways ({currentSlide.bullets.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("script")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === "script"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    Video Script & Expressions
                  </button>
                </div>

                {isEditMode && activeTab === "takeaways" && (
                  <button
                    onClick={addBullet}
                    className="px-2 py-0.5 rounded bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[11px] font-semibold flex items-center gap-1 border border-orange-500/30 transition"
                  >
                    <Plus className="w-3 h-3" />
                    Add Bullet
                  </button>
                )}
              </div>

              {/* TAB 1: Key Takeaways */}
              {activeTab === "takeaways" ? (
                <div className="space-y-3">
                  {currentSlide.bullets.map((bullet, bIdx) => {
                    const isHighlighted = activeSentenceIdx === bIdx;
                    return (
                      <div
                        key={bIdx}
                        className={`p-3.5 rounded-xl border transition duration-200 flex items-start gap-3.5 ${
                          isHighlighted
                            ? "bg-orange-500/15 border-orange-500/50 shadow-md shadow-orange-500/5 scale-[1.01]"
                            : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className={`mt-0.5 rounded-full p-1 ${
                          isHighlighted 
                            ? "bg-orange-500 text-white" 
                            : "bg-white/10 text-slate-400"
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        
                        <div className="flex-1">
                          {isEditMode ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => updateBullet(bIdx, e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded p-1.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                              />
                              <button
                                onClick={() => deleteBullet(bIdx)}
                                className="p-1 rounded text-red-400 hover:bg-red-500/20 transition"
                                title="Delete takeaway"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <p className={`text-sm leading-snug ${
                              isHighlighted ? "text-white font-semibold" : "text-slate-300"
                            }`}>
                              {bullet}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TAB 2: Video Script with Pauses & Expressions */
                <div className="space-y-3">
                  {/* Director Notes Header Box */}
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-300 flex items-center gap-1.5">
                        <Sparkle className="w-3.5 h-3.5 text-purple-400" />
                        DIRECTOR VIBE: {videoScript?.chapter_vibe}
                      </span>
                      <span className="text-[11px] font-mono text-purple-400">
                        {videoScript?.tone} · {videoScript?.pacing}
                      </span>
                    </div>
                    {isEditMode ? (
                      <textarea
                        value={videoScript?.director_note || ""}
                        onChange={(e) => updateDirectorNote("director_note", e.target.value)}
                        className="w-full bg-black/60 border border-purple-500/40 rounded p-2 text-xs text-purple-200 focus:outline-none"
                        rows={2}
                      />
                    ) : (
                      <p className="text-xs text-purple-200/90 italic">
                        &ldquo;{videoScript?.director_note}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Individual Script Lines with Pause Badges */}
                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {(videoScript?.script_lines || []).map((line, lIdx) => {
                      const isLineActive = activeSentenceIdx === lIdx;
                      return (
                        <div
                          key={lIdx}
                          className={`p-3 rounded-xl border transition ${
                            isLineActive
                              ? "bg-purple-500/20 border-purple-400 shadow-md shadow-purple-500/10"
                              : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06]"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] mb-1.5">
                            <span className="font-mono text-slate-400 font-semibold">
                              Line {lIdx + 1}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {isEditMode ? (
                                <input
                                  type="text"
                                  value={line.expression}
                                  onChange={(e) => updateScriptLine(lIdx, "expression", e.target.value)}
                                  className="bg-black/50 border border-purple-400/40 rounded px-1.5 py-0.5 text-[10px] text-purple-300 font-medium"
                                />
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30 text-[10px]">
                                  {line.expression}
                                </span>
                              )}

                              {isEditMode ? (
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <span>Pause:</span>
                                  <input
                                    type="number"
                                    step="0.05"
                                    value={line.pause_s}
                                    onChange={(e) => updateScriptLine(lIdx, "pause_s", parseFloat(e.target.value))}
                                    className="w-12 bg-black/50 border border-white/20 rounded px-1 text-center text-white"
                                  />
                                  <span>s</span>
                                </div>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  pause: {line.pause_s}s
                                </span>
                              )}
                            </div>
                          </div>

                          {isEditMode ? (
                            <textarea
                              value={line.text}
                              onChange={(e) => updateScriptLine(lIdx, "text", e.target.value)}
                              className="w-full bg-black/50 border border-white/20 rounded p-2 text-sm text-white focus:outline-none"
                              rows={2}
                            />
                          ) : (
                            <p className={`text-sm leading-relaxed ${
                              isLineActive ? "text-white font-medium" : "text-slate-300"
                            }`}>
                              &ldquo;{line.text}&rdquo;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Active Spoken Sentence Bar */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                  Currently Speaking: Sentence {activeSentenceIdx + 1} of {currentSlide.sentences.length}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Tara · 146 WPM · Storyteller Tone
                </span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 min-h-[44px] flex items-center">
                <p className="text-sm font-medium text-amber-200/90 leading-relaxed italic">
                  &ldquo;{currentSlide.sentences[activeSentenceIdx >= 0 ? activeSentenceIdx : 0]}&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Full Transcript Drawer */}
        {showTranscript && (
          <div className="mt-6 p-5 glass-panel rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                Full Chapter Script (Sentence-by-Sentence Timestamp Sync)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Click any line to scrub audio directly
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
              {currentSlide.sentences.map((sent, sIdx) => {
                const timing = currentSlide.sentence_timings?.[sIdx];
                const isActive = activeSentenceIdx === sIdx;
                return (
                  <div
                    key={sIdx}
                    onClick={() => {
                      if (timing && audioRef.current) {
                        audioRef.current.currentTime = timing.local_start;
                        audioRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }}
                    className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-start gap-2.5 border ${
                      isActive
                        ? "bg-orange-500/20 border-orange-500/40 text-orange-200 font-medium"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400 pt-0.5 shrink-0">
                      {timing ? `${timing.local_start.toFixed(1)}s` : `${sIdx + 1}`}
                    </span>
                    <span className="line-clamp-2">{sent}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Footer info banner */}
      <footer className="h-12 border-t border-white/10 bg-[var(--chrome-6)] px-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>Not A Startup · Episode 1: Café in Bangalore</span>
          <span>•</span>
          <a 
            href="https://youtu.be/kOx2ayjDWa4" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline flex items-center gap-1"
          >
            Watch on YouTube
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span>Hotkeys: [E] WYSIWYG Edit</span>
          <span>•</span>
          <span>[Space] Audio</span>
          <span>•</span>
          <span>[Arrows] Navigate</span>
          <span>•</span>
          <span>[F] Fullscreen</span>
        </div>
      </footer>
    </div>
  );
}
