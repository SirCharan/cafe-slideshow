"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import slidesData from "@/data/slides.json";
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
  TrendingUp, 
  AlertTriangle, 
  Coffee, 
  Store, 
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

interface SentenceTiming {
  sentence_idx: number;
  text: string;
  local_start: number;
  duration: number;
  global_start: number;
}

interface Slide {
  id: string;
  index: number;
  part: string;
  headline: string;
  chip: string;
  image: string;
  bullets: string[];
  sentences: string[];
  audio: string;
  duration: number;
  sentence_timings: SentenceTiming[];
}

export default function CafeSlideshow() {
  const slides = slidesData as Slide[];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);
  const [showOverviewGrid, setShowOverviewGrid] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSlide = slides[currentIdx];

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

  // Sync audio speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Time update listener
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const t = audioRef.current.currentTime;
    setCurrentTime(t);

    // Track active spoken sentence
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, togglePlay]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Group slides by module part
  const partGroups = [
    { name: "Part 1: The Idea vs Reality", range: [0, 3] },
    { name: "Part 2: Location & Micro-Markets", range: [4, 5] },
    { name: "Part 3: The Capex Breakdown", range: [6, 9] },
    { name: "Part 4: Leases & Compliance", range: [10, 12] },
    { name: "Part 5: Unit Economics & Margins", range: [13, 16] },
    { name: "Part 6: Reality Check & Next", range: [17, 19] },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSlide.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        preload="auto"
      />

      {/* Top Header Navigation Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Coffee className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-orange-500 uppercase">Not A Startup</span>
              <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
                The Economics of Owning a Café in Bangalore
                <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full border border-white/10">
                  Interactive Deck
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Middle Navigation Controls */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
          <button 
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition"
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
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition"
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

          {/* Mute Button */}
          <button 
            onClick={() => setIsMuted(prev => !prev)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Tools & View Toggles */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOverviewGrid(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              showOverviewGrid 
                ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                : "border-white/10 hover:bg-white/5 text-slate-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Slide Grid ({slides.length})</span>
          </button>

          <button
            onClick={() => setShowTranscript(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              showTranscript 
                ? "bg-white/10 border-white/20 text-white" 
                : "border-white/10 hover:bg-white/5 text-slate-400"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript</span>
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

      {/* Overview Grid Drawer Modal */}
      {showOverviewGrid && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md pt-20 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Episode Slide Deck (20 Chapters)</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Click any slide to jump directly. Full unit economics breakdown of Bangalore café reality.
                </p>
              </div>
              <button
                onClick={() => setShowOverviewGrid(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white transition"
              >
                Close Grid [Esc]
              </button>
            </div>

            <div className="space-y-8">
              {partGroups.map((group, gIdx) => {
                const groupSlides = slides.slice(group.range[0], group.range[1] + 1);
                return (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-bold tracking-wider text-orange-400 uppercase">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {groupSlides.map((slide) => {
                        const isSelected = slide.index - 1 === currentIdx;
                        return (
                          <div
                            key={slide.id}
                            onClick={() => {
                              goToSlide(slide.index - 1);
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
            <span className="px-2.5 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wider uppercase">
              {currentSlide.part}
            </span>
            <span className="text-slate-500 text-sm">/</span>
            <span className="text-slate-400 text-xs font-medium tracking-wide">
              CHAPTER {String(currentSlide.index).padStart(2, "0")} OF 20
            </span>
            <span className="text-slate-500 text-sm">·</span>
            <span className="text-amber-300/80 text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {currentSlide.chip}
            </span>
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
          <div className="w-full md:w-[48%] p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-[#0B0E16]/80 relative">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-orange-400 uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                KEY EVIDENCE & COMPONENT
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight mb-2">
                {currentSlide.headline}
              </h2>
            </div>

            {/* Graphic Container with Polaroid Frame */}
            <div className="my-auto py-2 flex flex-col items-center">
              <div className="relative group max-w-[420px] w-full bg-white p-3.5 pb-6 rounded-lg shadow-2xl rotate-[-0.5deg] hover:rotate-0 transition duration-300 border border-black/10">
                {/* Washi tape sticker */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/80 backdrop-blur-sm border border-amber-300/50 shadow-sm rotate-[1.5deg] z-10" />

                <div className="relative aspect-square w-full rounded overflow-hidden bg-slate-950 flex items-center justify-center">
                  <Image
                    src={`/assets/${currentSlide.image}`}
                    alt={currentSlide.headline}
                    fill
                    className="object-contain p-1"
                    priority
                  />
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
            </div>

            {/* Bottom Caption Pill */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-orange-400" />
                Bangalore Commercial Micro-market Data
              </span>
              <span className="font-mono text-[11px] text-slate-500">ASD-STE100 Verified</span>
            </div>
          </div>

          {/* Right Content Column: Structured Unit Economics & Spoken Sync */}
          <div className="w-full md:w-[52%] p-6 md:p-8 flex flex-col justify-between bg-[#080B11]/90">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-orange-400" />
                  Financial Breakdown & Ground Truth
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentSlide.bullets.length} Takeaways
                </span>
              </div>

              {/* Bulleted Insights List */}
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
                        <p className={`text-sm leading-snug ${
                          isHighlighted ? "text-white font-semibold" : "text-slate-300"
                        }`}>
                          {bullet}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Active Spoken Sentence Bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                  Now Narrating (Tara · 146 WPM)
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Sentence {activeSentenceIdx + 1} of {currentSlide.sentences.length}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 min-h-[48px] flex items-center">
                <p className="text-sm font-medium text-amber-200/90 leading-relaxed italic">
                  &ldquo;{currentSlide.sentences[activeSentenceIdx >= 0 ? activeSentenceIdx : 0]}&rdquo;
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Full Transcript Drawer (Collapsible) */}
        {showTranscript && (
          <div className="mt-6 p-5 glass-panel rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                Full Chapter Script (Sentence-by-Sentence Timestamp Sync)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Click any line to scrub audio
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
      <footer className="h-12 border-t border-white/10 bg-[#06080C] px-6 flex items-center justify-between text-xs text-slate-400">
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
          <span>Arrow keys: Navigate</span>
          <span>•</span>
          <span>Space: Audio</span>
          <span>•</span>
          <span>F: Fullscreen</span>
        </div>
      </footer>
    </div>
  );
}
