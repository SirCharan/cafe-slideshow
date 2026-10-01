import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface SceneTransitionProps {
  children: React.ReactNode;
  isPartStart?: boolean;
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
  isPartStart = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If it's a part start, PartTransitionCard handles the dramatic entrance.
  // For standard scenes, apply a snappy spring slide + settle zoom with light streak.
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  const scale = isPartStart ? 1.0 : interpolate(enterSpring, [0, 1], [1.05, 1.0]);
  const translateX = isPartStart ? 0 : interpolate(enterSpring, [0, 1], [50, 0]);
  const opacity = interpolate(enterSpring, [0, 1], [0.4, 1.0]);

  // High-speed light streak / wipe accent during the first 8 frames (synced with whip_whoosh)
  const streakProgress = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const streakX = interpolate(streakProgress, [0, 1], [-100, 2000]);
  const streakOpacity = interpolate(streakProgress, [0, 0.4, 1], [0, 0.85, 0]);

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        transform: `translateX(${translateX}px) scale(${scale})`,
        transformOrigin: "center center",
        opacity,
      }}
    >
      {children}

      {/* Dynamic Whip Streak Flash (frames 0 to 8) */}
      {!isPartStart && frame <= 10 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: streakX,
            width: 140,
            height: "100%",
            transform: "skewX(-25deg)",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(224, 90, 43, 0.35) 45%, rgba(255, 255, 255, 0.6) 50%, rgba(224, 90, 43, 0.35) 55%, transparent 100%)",
            opacity: streakOpacity,
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
};
